import React, { useState } from 'react';
import ChatWindow from './chatWindow';
import Starboard from './starboard';

type RoomInfo = {
    name: string,
    id: number
}

const defaultRooms = [
    {
        id: 1,
        name: "Sandbox"
    }
]

const App = () => {
    const [currentRoom, setCurrentRoom] = useState(240);
    const [favoriteRooms, setFavoriteRooms] = useState<RoomInfo[]>(() => JSON.parse(localStorage.getItem("chat-favorite-rooms") ?? JSON.stringify(defaultRooms)));
    const [editingRoomNumber, setEditingRoomNumber] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addFavoriteRoom = async (ev) => {
        if (Number.isNaN(+editingRoomNumber)) {
            return;
        }
        const response = await fetch(`https://chat.stackexchange.com/rooms/${+editingRoomNumber}/sandbox`);
        if (!response.ok) {
            console.error("Failed");
            setError(response.statusText);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const newDocument = parser.parseFromString(text, 'text/html');
        const title = newDocument.title.split(" | chat")[0];

        setFavoriteRooms(
            (previousFavoriteRooms) => {
                const newRooms = [
                    ...previousFavoriteRooms,
                    {
                        id: +editingRoomNumber,
                        name: title
                    }
                ];
                localStorage.setItem('chat-favorite-rooms', JSON.stringify(newRooms));
                return newRooms;
            }
        )
    }

    return <div className='main-window'>
        <div className='channels'>
            {
                favoriteRooms.map(room => (<button
                    type="button"
                    onClick={() => setCurrentRoom(room.id)}
                    key={room.id}
                >{room.name}</button>))
            }
            <input type='number' value={editingRoomNumber} onChange={(ev) => setEditingRoomNumber(ev.target.value)} />
            <button onClick={addFavoriteRoom}>Add Favorite</button>
        </div>
        <ChatWindow chatRoomId={currentRoom} key={currentRoom} />
        <Starboard roomId={currentRoom} />
    </div>
}

export default App;
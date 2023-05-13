import React, { useState } from 'react';

const defaultRooms = [
    {
        "siteName": "Code Golf",
        "siteLogo": "https://cdn.sstatic.net/Sites/codegolf/Img/favicon.ico?v=dc", "rooms": [
            {
                "id": 240,
                "name": "The Nineteenth Byte"
            },
            {
                "id": 145982,
                "name": "SE Chat Clients"
            }]
    },
    {
        "siteName": "Area 51",
        "siteLogo": "https://cdn.sstatic.net/area51/img/favicon.ico?v=dc", "rooms": [
            {
                "id": 241,
                "name": "Area 51"
            },
            {
                "id": 140719,
                "name": "Programming Language Design and Implementation"
            }]
    }
]

type RoomInfo = {
    name: string,
    id: number
}

type SiteRooms = {
    siteName: string,
    siteLogo: string,
    rooms: RoomInfo[]
}

const SiteChannels = ({ site, onChangeChannel, currentChannel }: { site: SiteRooms, onChangeChannel: (id: number) => void, currentChannel: number }) => {
    const [expanded, setExpanded] = useState(true);

    return <>
        <button className={'channel-category ' + (expanded ? 'expanded' : 'collapsed')} onClick={() => setExpanded(e => !e)}>
            <img src={site.siteLogo} />
            {site.siteName}
        </button>
        {
            expanded && site.rooms.map((room) => (
                <button
                    type="button"
                    className={'channel ' + (currentChannel === room.id ? 'active' : '')}
                    onClick={() => onChangeChannel(room.id)}
                    key={room.id}
                >
                    {room.name}
                </button>
            ))
        }
    </>
}

const ChannelList = ({ onChangeChannel, channelId }: { onChangeChannel: (channelId: number) => void, channelId: number }) => {
    const [favoriteRooms, setFavoriteRooms] = useState<SiteRooms[]>(() => JSON.parse(localStorage.getItem("chat-favorite-rooms") ?? JSON.stringify(defaultRooms)));
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
            return;
        }
        const text = await response.text();
        const parser = new DOMParser();
        const newDocument = parser.parseFromString(text, 'text/html');
        const title = newDocument.title.split(" | chat")[0];

        const siteName = (newDocument.querySelector('#footer-logo a img') as HTMLImageElement).alt;
        const siteLogo = (newDocument.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement).href;

        setFavoriteRooms(
            (previousFavoriteRooms) => {
                let newRooms: SiteRooms[];
                if (previousFavoriteRooms.some(i => i.siteName === siteName)) {
                    console.log("site already exists: ", siteName);
                    newRooms = previousFavoriteRooms.map(
                        i => i.siteName == siteName ? {
                            ...i,
                            rooms: [
                                ...i.rooms,
                                {
                                    id: +editingRoomNumber,
                                    name: title
                                }
                            ]
                        } : i
                    );
                } else {
                    console.log("site does not exist");
                    newRooms = [
                        ...previousFavoriteRooms,
                        {
                            siteName,
                            siteLogo,
                            rooms: [{
                                id: +editingRoomNumber,
                                name: title
                            }]
                        }
                    ]
                }
                localStorage.setItem('chat-favorite-rooms', JSON.stringify(newRooms));
                return newRooms;
            }
        )
    }

    return <div className='channels'>
        {
            error && <div className='error'>{error}</div>
        }
        {
            favoriteRooms.map(site => (
                <SiteChannels site={site} onChangeChannel={onChangeChannel} key={site.siteName} currentChannel={channelId} />
            )
            )
        }

        <h3>Join a Room</h3>
        <input type='number' value={editingRoomNumber} onChange={(ev) => setEditingRoomNumber(ev.target.value)} placeholder="Room ID" />
        <button onClick={addFavoriteRoom}>Add Favorite</button>
    </div>
}

export default ChannelList;
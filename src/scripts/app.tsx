import React, { useState } from 'react';
import ChannelList from './channelList';
import ChatWindow from './chatWindow';
import Starboard from './starboard';

const App = () => {
    const [currentRoom, setCurrentRoom] = useState(240);

    return <div className='main-window'>
        <ChannelList onChangeChannel={setCurrentRoom} channelId={currentRoom} />
        <ChatWindow chatRoomId={currentRoom} key={currentRoom} />
        <Starboard roomId={currentRoom} />
    </div >
}

export default App;
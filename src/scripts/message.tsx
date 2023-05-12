import React from 'react';
import { useFkey } from "./fkeyprovider"
import { groupMessages, MessageGroup } from "./util"



const Message = ({ group }: { group: MessageGroup }) => {
    const user_info = useFkey();

    const date = new Date(group.messages[0].time_stamp * 1000);

    return <div className={'message' + (group.author.id === user_info?.userId ? ' mine' : '') + (group.author.id === 0 ? ' system-message' : '')}>
        <div className='message-author'>
            <div className='author-name'>
                {group.author.name}
            </div>
            <div className='author-time'>
                {date.getHours()}:{date.getMinutes()}
            </div>
        </div>
        <div className='message-content'>
            {
                group.messages.map(submessage =>
                    (<div key={submessage.message_id}>{submessage.content}</div>)
                )
            }
        </div>
    </div>
}

export default Message;
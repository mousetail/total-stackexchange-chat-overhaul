import React, { useState, useCallback } from 'react';
import { useFkey } from './fkeyprovider';
import { chatRoomId } from './util';

const MessageComposer = () => {
    const fkey = useFkey();
    const [message, setMessage] = useState('');

    const onMessageChange = useCallback(
        (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMessage(ev.target.value)
        },
        [setMessage]
    )

    const onSubmit = useCallback(
        (ev: React.FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            setMessage('');

            fetch(`https://chat.stackexchange.com/chats/${chatRoomId}/messages/new`, {
                method: 'POST',
                body: `text=${encodeURIComponent(message)}&fkey=${fkey?.fkey}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(
                () => setMessage('')
            );
        },
        [message]
    );

    const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            onSubmit(ev as unknown as React.FormEvent<HTMLFormElement>);
        }
    }

    return <div className='message-composer'>
        <form onSubmit={onSubmit}>
            <textarea value={message} onChange={onMessageChange} onKeyDown={onKeyDown}></textarea>
            <button type='submit'>Send</button>
        </form>
    </div>
}

export default MessageComposer;
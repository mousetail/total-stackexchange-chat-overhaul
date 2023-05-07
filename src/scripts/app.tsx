import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useFkey } from './fkeyprovider';
import MessageComposer from './MessageComposer';
import { ChatEvent, EventType, NewMessageEvent } from './types';
import { chatRoomId, groupMessages, MessageGroup, sanitizeMessage } from './util';

const createSocket = async (fkey: string, setSocket: (ws: WebSocket) => void, setMessages: (cb: (g: MessageGroup[]) => MessageGroup[]) => void): Promise<WebSocket> => {
    const auth = await fetch("https://chat.stackexchange.com/ws-auth", {
        'method': 'POST',
        'body': `roomid=${chatRoomId}&fkey=${fkey}`,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    });
    const { url } = await auth.json();

    const socket = new WebSocket(url + "?l=" + (+ new Date()));

    socket.addEventListener(
        'open', () => {
            setSocket(socket);

            setMessages(messages => [...messages, {
                author: {
                    id: 0,
                    name: 'system'
                },
                messages: [
                    {
                        message_id: 0,
                        room_id: 0,
                        user_id: 0,
                        user_name: 'system',
                        content: 'Connected',
                        event_type: 1,
                        time_stamp: 0
                    }
                ]
            }])
        }
    )

    socket.addEventListener('message', (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (!data?.r1?.e) {
            return;
        }

        data.r1.e.map(
            (chatEvent: ChatEvent) => {
                if (chatEvent.event_type === EventType.Message && chatEvent.content) {
                    setMessages((oldMessages) => {
                        if (oldMessages[oldMessages.length - 1].author.id === chatEvent.user_id) {
                            return [...oldMessages.slice(0, oldMessages.length - 1),
                            {
                                ...oldMessages[oldMessages.length - 1],
                                messages: [
                                    ...oldMessages[oldMessages.length - 1].messages,
                                    chatEvent
                                ]
                            }
                            ]
                        } else {
                            return [...oldMessages, {
                                author: {
                                    id: chatEvent.user_id,
                                    name: chatEvent.user_name
                                },
                                messages: [
                                    sanitizeMessage(chatEvent)
                                ]
                            }]
                        }
                    })
                }
            }
        )
    });


    return socket;
}

const App = () => {
    const [messages, setMessages] = useState<MessageGroup[]>([]);
    const fkey = useFkey();
    const [socket, setSocket] = useState<WebSocket | undefined>();
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!fkey) return;

        fetch(`https://chat.stackexchange.com/chats/${chatRoomId}/events`, {
            'method': 'POST',
            'body': 'since=0&mode=Messages&msgCount=100&fkey=' + fkey,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }
        ).then(
            (res) => {
                if (!res.ok) {
                    return res.text().then((e) => Promise.reject(e))
                } else {
                    return res.json() as Promise<{ events: ChatEvent[] }>
                }
            }
        ).then(
            (res) => setMessages(groupMessages(res.events.filter(
                (event: ChatEvent) => event.event_type === EventType.Message && event.content
            )))
        ).catch(
            console.error
        )
    }, [fkey]);

    useEffect(
        () => {
            if (!fkey) return;

            const socketPromise = createSocket(fkey, setSocket, setMessages);

            return () => void (socketPromise.then(socket => socket.close()));
        },
        [fkey]
    );

    useEffect(
        () => {
            containerRef.current?.scrollIntoView({ behavior: 'smooth' })
        },
        [messages]
    )

    return <div>
        <div className="messages-container">
            {
                messages.map(
                    (message: MessageGroup) => (
                        <div className='message' key={message.messages[0].message_id}>
                            <div className='message-author'>{message.author.name}</div>
                            <div className='message-content'>
                                {
                                    message.messages.map(submessage =>
                                        (<div key={submessage.message_id}>{submessage.content}</div>)
                                    )
                                }
                            </div>
                        </div>
                    )
                )
            }
            <div ref={containerRef} />
        </div>

        <MessageComposer />
    </div>
}

export default App;
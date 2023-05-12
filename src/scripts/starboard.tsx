import React, { useEffect, useState } from 'react';

type StarboardMessage = {
    times: number,
    author: string,
    message: string,
    message_id: number,
    date: Date
}

const Starboard = ({ roomId }: { roomId: number }) => {
    const [starData, setStarData] = useState<StarboardMessage[]>([]);

    useEffect(
        () => {
            fetch(`https://chat.stackexchange.com/chats/stars/${roomId}?count=0&_=${+new Date()}`
            ).then(
                res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    } else {
                        return res.text()
                    }
                }
            ).then(
                (starBoardText) => {
                    const parser = new DOMParser();
                    const starDocument = parser.parseFromString(starBoardText, 'text/html');

                    const starredMessages = starDocument.getElementsByTagName('li');

                    const newStarData: StarboardMessage[] = [...starredMessages].map(
                        (message) => {
                            let times = message.querySelector('.times');
                            if (times !== null) {
                                message.removeChild(times!.parentElement!);
                            }

                            const date = message.querySelector('.relativetime') as HTMLLinkElement | null;
                            date?.parentElement?.removeChild(date);

                            const author = message.querySelector('a[rel="noreferrer noopener"] ~ a') as HTMLAnchorElement;
                            author?.parentElement?.removeChild(author);

                            const dateline = message.querySelector('a[rel="noreferrer noopener"]') as HTMLAnchorElement;
                            dateline!.parentElement!.removeChild(dateline!.nextSibling!);
                            message.removeChild(dateline!);

                            const message_id = dateline?.href.split('#')[1];

                            const quick_unstar = message.querySelector('.quick-unstar');
                            quick_unstar?.parentElement?.removeChild(quick_unstar);

                            return {
                                times: Number.parseInt(times === null ? '1' : times.textContent!),
                                author: author?.innerText ?? '',
                                message: message.textContent ?? '',
                                message_id: Number.parseInt(message_id ?? '0'),
                                date: new Date(date?.title ?? '')
                            }
                        }
                    )

                    setStarData(newStarData);
                }
            )
        },
        [roomId]
    )

    return <div className='starboard'>
        {
            starData.map(
                item => (
                    <div key={item.message_id} className='star'>
                        <b>{item.times} ★</b>
                        <span>{item.message}</span>
                        <span className='star-author'>by {item.author}</span>
                    </div>
                )
            )
        }
    </div>
}

export default Starboard;
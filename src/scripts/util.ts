import { NewMessageEvent } from "./types";

export const chatRoomId = 1;

export const getFkey = async ()=> {
    const response = await fetch(`https://chat.stackexchange.com/rooms/${chatRoomId}/sandbox`);
    const parser = new DOMParser();
    const dom = parser.parseFromString(await response.text(), 'text/html');
    const fkey = (dom.querySelector('input[name="fkey"]') as HTMLInputElement).value;

    return fkey;
}

export interface MessageGroup {
    author: {
        name: string,
        id: number
    },
    messages: NewMessageEvent[]
}

export const sanitizeMessage = (message: NewMessageEvent) => {
    const area = document.createElement('textarea');
    area.innerHTML = message.content.replace(
        /<\/?[a-zA-Z0-9 "'=\-\/:\._#?]+?>/g, ''
    )

    return {
        ...message,
        content: area.value
    }
}

export const groupMessages = (messages: NewMessageEvent[]): MessageGroup[] => {
    if (messages.length == 0) {
        return [];
    }
    const new_messages = [
        {
            author: {
                name: messages[0].user_name, 
                id: messages[0].user_id
            },
            messages: [sanitizeMessage(messages[0])]
        }
    ];
    messages.forEach((message: NewMessageEvent, index: number) => {
        if (index > 0) {
            if (new_messages[new_messages.length - 1].author.id === message.user_id) {
                new_messages[new_messages.length - 1].messages.push(sanitizeMessage(message))
            } else {
                new_messages.push(
                    {
                        author: {
                            name: message.user_name,
                            id: message.user_id
                        },
                        messages: [sanitizeMessage(message)]
                    }
                )
            }
        }
    });

    return new_messages;
}
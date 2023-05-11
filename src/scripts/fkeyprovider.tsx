import React, { createContext, useState, useEffect, useContext } from 'react';
import { chatRoomId } from './util';

export type FkeyValue = {
    fkey: string,
    userId: number
}

const getFkey = async () => {
    const response = await fetch(`https://chat.stackexchange.com/rooms/${chatRoomId}/sandbox`);
    const parser = new DOMParser();
    const dom = parser.parseFromString(await response.text(), 'text/html');
    const fkey = (dom.querySelector('input[name="fkey"]') as HTMLInputElement).value;
    const active_user = dom.querySelector('#active-user');
    console.log(active_user);
    const userId = Number.parseInt(
        [...(active_user?.classList ?? [])]
            .map(
                (i: string): string | undefined => (
                    /^user-(\d+)$/
                ).exec(i!)?.[1]
            )
            .find(i => i)!)

    return { fkey, userId };
}

const FkeyContext = createContext<FkeyValue | null>(null);

const FkeyProvider = ({ children }) => {
    const [fkey, setFkey] = useState<FkeyValue | null>(null);

    useEffect(
        () => {
            getFkey().then(
                key => setFkey(key)
            )
        },
        []
    )

    return <FkeyContext.Provider value={fkey}>
        {children}
    </FkeyContext.Provider>
}

export const useFkey = () => {
    const fkeyContext = useContext(FkeyContext);
    return fkeyContext;
}

export default FkeyProvider;
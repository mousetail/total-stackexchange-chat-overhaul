import React, {createContext, useState, useEffect, useContext} from 'react';
import { getFkey } from './util';

const FkeyContext = createContext<string | false>(false);

const FkeyProvider = ({children}) => {
    const [fkey, setFkey] = useState<string | false>(false);

    useEffect(
        ()=>{
            getFkey().then(
                key=>setFkey(key)
            )
        }
    )

    return <FkeyContext.Provider value={fkey}>
        {children}
    </FkeyContext.Provider>
}

export const useFkey = ()=>{
    const fkeyContext = useContext(FkeyContext);
    return fkeyContext;
}

export default FkeyProvider;
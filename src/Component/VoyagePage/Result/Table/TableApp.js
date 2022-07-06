import * as React from 'react';
import ColSelector from './ColSelector';
import Table from './Table';

export const ColContext = React.createContext({});

export default function() {
    const [cols, setCols] = React.useState(["id"]);

    return (
        <div>
            <ColContext.Provider value={{cols, setCols}}>
                <ColSelector/>
                <Table/>
            </ColContext.Provider>
        </div>
        
    )
}
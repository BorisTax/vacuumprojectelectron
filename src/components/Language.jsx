import React from 'react';
import useActions from '../customHooks/useActions';

export default function Language(){
        const appActions = useActions()
        return <div>
            <select className={"language"} onChange={e => {appActions.requestLanguage(e.target.value.toLowerCase())}}>
                <option>
                  {"RU"}     
                </option>
                <option>
                  {"UA"}     
                </option>
            </select>
        </div>

}

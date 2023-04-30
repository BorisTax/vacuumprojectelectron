import React from 'react';

const Spinner = ()=>{
        return <div className='modal-container  noselect'>
                    <div className={"lds-spinner"}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
}
export default Spinner;
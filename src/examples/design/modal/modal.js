import React, {useEffect} from 'react';
import './modal.css';

export default function Modal({isOpen, children, close, onRef}) {

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden": "visible";
    });

    return (<div className="blocker" ref={onRef} style={{visibility : isOpen ? "visible" : "hidden"}}>
            <div className="modal" style={{display: "inline-block"}}>
                {children}
                {close ? <a href="#!" onClick={close} className="close-modal ">Close</a> : null}
            </div>
        </div>);
}

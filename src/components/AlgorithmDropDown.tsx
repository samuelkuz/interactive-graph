import React, { useState, useRef } from "react";

import "./AlgorithmDropDown.scss";

interface InputProps {
    algorithmCallback: (srcId: number) => void;
    title: string
};

const AlgorithmDropDown: React.FC<InputProps> = ({algorithmCallback, title}) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    const startAlgorithmRef = useRef<HTMLInputElement>(null);

    const buildDropDown = () => {
        return (
            <div className="drop-down-container">
                <div className="input-container">
                    <div className="input-title">From:</div>
                    <input className="input-box" ref={startAlgorithmRef}></input>
                </div>
                <div className="drop-down-submit" onClick={() => handleStartAlgorithm()}>Start</div>
            </div>
        );
    };

    const handleStartAlgorithm = () => {
        if (startAlgorithmRef.current !== null && startAlgorithmRef.current.value.length > 0) {
            const startId: number = parseInt(startAlgorithmRef.current.value);
            startAlgorithmRef.current.value = "";
            algorithmCallback(startId);
        }
    };
    
    return (
        <div className="drop-down-button-container" onClick={() => setShowDropDown(!showDropDown)}>
            <div className="drop-down-title">{title}</div>
            {showDropDown &&
                buildDropDown()
            }
        </div>
    );
}

export default AlgorithmDropDown;

import React, { useRef } from "react";

import "./GraphAlgorithmButton.scss";

interface InputProps {
    algorithmCallback: (srcId: number) => void;
};

const GraphAlgorithmButton: React.FC<InputProps> = ({algorithmCallback}) => {

    const startAlgorithmRef = useRef<HTMLInputElement>(null);

    const handleStartAlgorithm = () => {
        if (startAlgorithmRef.current !== null && startAlgorithmRef.current.value.length > 0) {
            const startId: number = parseInt(startAlgorithmRef.current.value);
            startAlgorithmRef.current.value = "";
            algorithmCallback(startId);
        }
    };

    return (
        <div className="algorithm-button-container">
            <div className="algorithm-button-title">Dijkstra's:</div>
            <div className="algorithm-input-container">
                <div className="algorithm-input-title">From:</div>
                <input className="input-box" ref={startAlgorithmRef}></input>
            </div>
            <div className="algorithm-button-submit" onClick={() => handleStartAlgorithm()}>Start</div>
        </div>

    );
}

export default GraphAlgorithmButton;

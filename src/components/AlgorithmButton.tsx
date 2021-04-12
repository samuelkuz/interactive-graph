import React, { useRef } from "react";

import "./AlgorithmButton.scss";

interface InputProps {
    callBack: () => void;
    title: string
};

const AlgorithmButton: React.FC<InputProps> = ({callBack, title}) => {
    const handleCallback = () => {
        callBack();
    };

    return (
        <div className="algorithm-button-container" onClick={() => handleCallback}>
            <div className="algorithm-button-title">{title}</div>
        </div>

    );
}

export default AlgorithmButton;

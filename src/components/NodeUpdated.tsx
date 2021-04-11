import React, { useState, useRef } from "react";

import { NodeData, Point } from "../types/types";

import "./NodeUpdated.scss";

interface NodeProps {
    data: NodeData;
    color: string;
    editCallback: (offset: Point, id: number) => void;
};


const NodeUpdated: React.FC<NodeProps> = ({data, color, editCallback}) => {
    const circleRef = useRef<SVGCircleElement>(null);

    const handleShowEdit = () => {
        if (circleRef.current != null) {
            const location = circleRef.current.getBoundingClientRect();

            const offsetPoint = {
                x: location.left,
                y: location.top,
            };

            editCallback(offsetPoint, data.id);
        }
    }

    const tempStyle = {
        fill: color,
    };

    const calculateTextStyle = () => {
        let tempFontSize = "14px";
        if (parseInt(data.name) > 99) {
            tempFontSize = "10px";
        }
        if (parseInt(data.name) > 999) {
            tempFontSize = "8px";
        }

        return {
            fontSize: tempFontSize,
        }
    };

    const calculateDy = () => {
        let tempDy = 2;
        if (parseInt(data.name) > 99) {
            tempDy = 3;
        }
        if (parseInt(data.name) > 999) {
            tempDy = 4;
        }
        
        return tempDy;
    };

    return (
        <React.Fragment>
            <circle className="node-circle" ref={circleRef} cx={data.point.x} cy={data.point.y} r={data.size} style={tempStyle} onClick={() => handleShowEdit()}/>
            <text className="node-text" x={data.point.x} y={data.point.y} dy={data.size/calculateDy()} style={calculateTextStyle()} onClick={() => handleShowEdit()}>{data.name}</text>
        </React.Fragment>
    );
}

export default NodeUpdated;

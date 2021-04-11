import React from "react";

import { EdgeData, Point } from "../types/types";

import "./Edge.scss";

interface EdgeProps {
    data: EdgeData,
    color: string
};

const Edge: React.FC<EdgeProps> = ({data, color}) => {
    const tempStyle = {
        stroke: color,
        strokeWidth: "1.5",
    };

    const tempStyle2 = {
        stroke: color,
        strokeWidth: "1",
    };

    let test = {
        x: 0,
        y: 0
    };

    let test2 = {
        x: 0,
        y: 0
    };

    let test3 = {
        x: 0,
        y: 0
    };

    // Eventually draw arrow calculating angle pts
    const calculateArrow = () => {
        const deltaX = data.srcPoint.x - data.destPoint.x;
        const deltaY = data.srcPoint.y - data.destPoint.y;
        const theta = Math.atan2(deltaY, deltaX);
        const degrees = theta * (180/Math.PI);
  
        const testX = 11 * Math.cos(theta);
        const testY = 11 * Math.sin(theta);
        test.x = testX + data.destPoint.x;
        test.y = testY + data.destPoint.y;

        const theta2 = (degrees - 10) * (Math.PI / 180);
        const theta3 = (degrees + 10) * (Math.PI / 180);
        
        const testX2 = 15 * Math.cos(theta2);
        const testY2 = 15 * Math.sin(theta2);
        const testX3 = 15 * Math.cos(theta3);
        const testY3 = 15 * Math.sin(theta3);

        test2.x = testX2 + data.destPoint.x;
        test2.y = testY2 + data.destPoint.y;

        test3.x = testX3 + data.destPoint.x;
        test3.y = testY3 + data.destPoint.y;
    };

    calculateArrow();

    return (
        <React.Fragment>
           <line x1={data.srcPoint.x} y1={data.srcPoint.y} x2={test.x} y2={test.y} style={tempStyle} />
           <polygon points={`${test.x},${test.y} ${test2.x},${test2.y} ${test3.x},${test3.y}`} style={tempStyle2}/>
            {/* <polygon points="80,70 79,69 79,71" style={tempStyle} /> */}
        </React.Fragment>
    );
}

export default Edge;

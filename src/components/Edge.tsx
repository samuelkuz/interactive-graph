import React, { useRef } from "react";

import { EdgeData, Point } from "../types/types";

import "./Edge.scss";

interface EdgeProps {
    data: EdgeData,
    color: string,
    editCallback: (offset: Point, id: string) => void;
};

const Edge: React.FC<EdgeProps> = ({data, color, editCallback}) => {
    const lineRef = useRef<SVGLineElement>(null);

    const handleShowEdit = () => {
        if (lineRef.current != null) {
            const location = lineRef.current.getBoundingClientRect();

            const offsetPoint = {
                x: location.left,
                y: location.top,
            };
            const edgeId: string = `${data.srcId}:${data.destId}`;
            
            editCallback(offsetPoint, edgeId);
        }
    }
    
    const tempStyle = {
        stroke: color,
        strokeWidth: "1.5",
    };

    const tempStyle2 = {
        stroke: color,
        strokeWidth: "1",
    };

    const arrowCords = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        x3: 0,
        y3: 0,
    };

    const calculateArrow = () => {
        const deltaX = data.srcPoint.x - data.destPoint.x;
        const deltaY = data.srcPoint.y - data.destPoint.y;
        const theta = Math.atan2(deltaY, deltaX);
        const degrees = theta * (180/Math.PI);
  
        const testX = 11 * Math.cos(theta);
        const testY = 11 * Math.sin(theta);
        arrowCords.x1 = testX + data.destPoint.x;
        arrowCords.y1 = testY + data.destPoint.y;

        const theta2 = (degrees - 10) * (Math.PI / 180);
        const theta3 = (degrees + 10) * (Math.PI / 180);
        
        const testX2 = 15 * Math.cos(theta2);
        const testY2 = 15 * Math.sin(theta2);
        const testX3 = 15 * Math.cos(theta3);
        const testY3 = 15 * Math.sin(theta3);

        arrowCords.x2 = testX2 + data.destPoint.x;
        arrowCords.y2 = testY2 + data.destPoint.y;
        arrowCords.x3 = testX3 + data.destPoint.x;
        arrowCords.y3 = testY3 + data.destPoint.y;
    };

    calculateArrow();

    return (
        <React.Fragment>
           <line ref={lineRef} x1={data.srcPoint.x} y1={data.srcPoint.y} x2={arrowCords.x1} y2={arrowCords.y1} style={tempStyle} onClick={handleShowEdit}/>
           <polygon points={`${arrowCords.x1},${arrowCords.y1} ${arrowCords.x2},${arrowCords.y2} ${arrowCords.x3},${arrowCords.y3}`} style={tempStyle2} onClick={handleShowEdit}/>
        </React.Fragment>
    );
}

export default Edge;

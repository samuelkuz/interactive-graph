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

    // Eventually draw arrow calculating angle pts

    return (
        <React.Fragment>
           <line x1={data.srcPoint.x} y1={data.srcPoint.y} x2={data.destPoint.x} y2={data.destPoint.y} style={tempStyle} />
            {/* <polygon points="80,70 79,69 79,71" style={tempStyle} /> */}
        </React.Fragment>
    );
}

export default Edge;

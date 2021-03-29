import React from "react";

import { NodeData, Point } from "../types/types";

import "./Node.scss";

interface NodeProps {
    data: NodeData
};

const Node: React.FC<NodeProps> = ({data}) => {
    // const [children, setChildren] = useState([]);

    const nodeStyle = {
        borderRadius: data.size,
        height: data.size,
        width: data.size,
        left: data.point.x,
        top: data.point.y,
    };

    const tempStyle = {
        marginTop: Math.floor(data.size/2) - 8,
    }

    return (
        <div className="node-wrapper" style={nodeStyle}>
            {<div className="node-id" style={tempStyle}>{data.id}</div>}
        </div>
    );
}

export default Node;

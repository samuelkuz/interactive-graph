import React, { useState, useEffect, useRef } from "react";

import Node from "./Node";
import { NodeData, Point } from "../types/types";

import "./GraphMap.scss";

interface GraphMapProps {
    height: number,
    width: number,
};

const GraphMap: React.FC<GraphMapProps> = ({height, width}) => {
    const [nodeMap, setNodeMap] = useState(new Map<string, NodeData>());
    const [mapSize, setMapSize] = useState<number>(0);

    // const [edges, setEdges] = useState([{in: 1, out: 2}]);
    const [showAddNode, setShowAddNode] = useState<boolean>(false);
    const [viewPts, _setViewPts] = useState<Point>({x: 0, y: 0});

    const addRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("keydown", handleMovement);

        nodeMap.set("1", {id: "1", point: {x: 125, y:-125}, size: 50});
        nodeMap.set("2", {id: "2", point: {x: 0, y:0}, size: 50});
        setMapSize(2);

        return function cleanup() {
            window.removeEventListener("keydown", handleMovement);
        }
    }, []);

    const viewPtsRef = useRef(viewPts);

    const setViewPts = (data: Point) => {
        viewPtsRef.current = data;
        _setViewPts(data);
    }

    const handleMovement = (e: KeyboardEvent) => {
        const temp = { ...viewPtsRef.current };
        switch(e.code) {
            // Up
            case "ArrowUp":
                temp.y -= 10;
                setViewPts(temp);
                break;
            // Down
            case "ArrowDown":
                temp.y += 10;
                setViewPts(temp);
                break;
            // Right
            case "ArrowRight":
                temp.x += 10;
                setViewPts(temp);
                break;
            // Left
            case "ArrowLeft":
                temp.x -= 10;
                setViewPts(temp);
                break;
        }
    };

    const calculateViewPosition = (nodeData: NodeData) => {
        const midHeight = Math.floor(height/2);
        const midWidth = Math.floor(width/2);

        const viewPtX = viewPtsRef.current.x * -1;
        const viewPtY = viewPtsRef.current.y * -1;

        const actualX = nodeData.point.x + midWidth + viewPtX - Math.floor(nodeData.size / 2);
        const actualY = nodeData.point.y + midHeight + viewPtY - Math.floor(nodeData.size / 2);
        
        const tempData: NodeData = JSON.parse(JSON.stringify(nodeData));
        tempData.point.x = actualX;
        tempData.point.y = actualY;

        return tempData;
    };

    const calculateAddNodeStyle = () => {
        if (addRef.current) {
            const style = {
                left: addRef.current.getBoundingClientRect().x + 5,
                top: addRef.current.getBoundingClientRect().y - 30,
            };
    
            return style;
        }
        
        return {};
    }

    const calculateArrow = () => {

    };

    const mapStyle = {
        height: height,
        width: width,
    };

    const nodeObjs: JSX.Element[] = [];

    nodeMap.forEach((val: NodeData, key: string) => {
        // Eventually calculate if it should be rendered or not
        const tempData = calculateViewPosition(val);
        nodeObjs.push(<Node key={Math.random() * 10000} data={tempData}/>);
    });

    return (
        <div className="map-wrapper">
            <div className="map" style={mapStyle}>
                {mapSize > 0 && nodeObjs}
            </div>
            <div className="add-node" ref={addRef} onClick={() => setShowAddNode(!showAddNode)}>
                Add Node
            </div>
            {showAddNode &&
            <div className="add-node-popup" style={calculateAddNodeStyle()}>
                Test
            </div>
            }
        </div>
    );
};

export default GraphMap;

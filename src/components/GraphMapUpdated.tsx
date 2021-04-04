import React, { useState, useEffect, useRef, CSSProperties } from "react";

import Edge from "./Edge";
import NodeUpdated from "./NodeUpdated";
import { EdgeData, NodeData, Point } from "../types/types";

import "./GraphMapUpdated.scss";
import { stringify } from "node:querystring";

interface GraphMapProps {
    height: number,
    width: number,
};

const GraphMapUpdated: React.FC<GraphMapProps> = ({height, width}) => {
    const [addNodePoint, setAddNodePoint] = useState<Point>({x: 0, y: 0});
    const [nodeCounter, setNodeCounter] = useState<number>(0);
    const [editNodePoint, setEditNodePoint] = useState<Point>({x: 0, y: 0});
    const [edgeCounter, setEdgeCounter] = useState<number>(0);
    const [edgeMap, setEdgeMap] = useState<Map<string, EdgeData>>(new Map<string, EdgeData>());
    const [nodeMap, setNodeMap] = useState<Map<string, NodeData>>(new Map<string, NodeData>());
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [showAddNode, _setShowAddNode] = useState<boolean>(false);
    const [showEditNode, _setShowEditNode] = useState<boolean>(false);
    const [svgAddNodePoint, setSvgAddNodePoint] = useState<Point>({x: 0, y: 0});
    const [viewPt, _setViewPt] = useState<Point>({x: 0, y: 0});
    const [zoom, _setZoom] = useState<number>(150);

    useEffect(() => {
        window.addEventListener("keydown", handleMovement);
        window.addEventListener("click", handleClick);
        
        // nodeMap.set("1", {id: "1", point: {x: 50, y:50}, size: 10, edges:[]});
        // nodeMap.set("2", {id: "2", point: {x: 0, y:0}, size: 10, edges:[]});

        // const edgeKey = "2:1";
        // const inTemp = nodeMap.get("1");
        // const outTemp = nodeMap.get("2");
        // const inPoint: Point = (outTemp != undefined) ? outTemp.point: {x: 0, y: 0};
        // const outPoint: Point = (inTemp != undefined) ? inTemp.point: {x: 0, y: 0};

        // edgeMap.set(edgeKey, {srcId: "2", destId: "1", srcPoint: outPoint, destPoint: inPoint, weight: 0});
        // setEdgeCounter(1);
        // setNodeCounter(2);

        return function cleanup() {
            window.removeEventListener("keydown", handleMovement);
            window.removeEventListener("click", handleClick);
        }
    }, []);

    const addEdgeInputRef = useRef<HTMLInputElement>(null);
    const showEditNodeRef = useRef(showEditNode);
    const svgRef = useRef<SVGSVGElement>(null);
    const showAddNodeRef = useRef(showAddNode);
    const viewPtRef = useRef(viewPt);
    const zoomRef = useRef(zoom);

    const setShowAddNode = (data: boolean) => {
        showAddNodeRef.current = data;
        _setShowAddNode(data);
    };

    const setShowEditNode = (data: boolean) => {
        showEditNodeRef.current = data;
        _setShowEditNode(data);
    };

    const setViewPt = (data: Point) => {
        viewPtRef.current = data;
        _setViewPt(data);
    };

    const setZoom = (num: number) => {
        zoomRef.current = num;
        _setZoom(num);
    };

    const buildAddNode = () => {
        return (
        <div className="add-node-container" style={calculateAddNodeStyle()}>
            <div className="add-node-title">Add Node:</div>
            <div className="add-node-submit" onClick={() => handleAddNode()}>Create</div>
        </div>
        );
    };
    
    const buildEditNode = () => {
        return (
        <div className="edit-node-container" style={calculateEditNodeStyle()}>
            <div className="edit-node-title">Edit Node</div>
            <div className="add-edge-container">
                <div className="add-edge-title">Edge to:</div>
                <input className="input-box" ref={addEdgeInputRef}></input>
            </div>
            <div className="edit-node-submit" onClick={() => handleAddEdge()}>Add Edge</div>
            <div className="edit-node-submit" onClick={() => handleDeleteNode()}>Delete</div>
        </div>
        );
    };
    
    const buildEdges = () => {
        const edgeObjs: JSX.Element[] = [];

        edgeMap.forEach((val: EdgeData, key: string) => {
            // Eventually calculate if it should be rendered or not
            edgeObjs.push(<Edge key={Math.random() * 10000} data={val} color={"#000"}/>);
        });

        return edgeObjs;
    };

    const buildNodes = () => {
        const nodeObjs: JSX.Element[] = [];

        nodeMap.forEach((val: NodeData, key: string) => {
            // Eventually calculate if it should be rendered or not
            nodeObjs.push(<NodeUpdated key={Math.random() * 10000} data={val} color={"#919191"} editCallback={handleEditNode}/>);
        });

        return nodeObjs;
    };

    const calculateAddNodeStyle = () => {
        const style = {
            left: addNodePoint.x,
            top: addNodePoint.y - 25,
        };

        return style;
    };

    const calculateEditNodeStyle = () => {
        const style = {
            left: editNodePoint.x,
            top: editNodePoint.y + 25,
        };

        return style;  
    };

    const handleAddNode = () => {
        const nextId: number = nodeCounter + 1;
        const nextNodeId: string = `${nextId}`;

        const newNode: NodeData = {
            id: nextNodeId,
            point: {
                x: svgAddNodePoint.x,
                y: svgAddNodePoint.y
            },
            size: 10,
            edges: [],
        };

        nodeMap.set(nextNodeId, newNode);
        setNodeCounter(nextId);
        setShowAddNode(false);
    };

    const handleAddEdge = () => {
        if (addEdgeInputRef.current !== null && addEdgeInputRef.current.value.length > 0) {
            const srcId: string = selectedNode;
            const destId: string = addEdgeInputRef.current.value;
            const edgeKey: string = `${srcId}:${destId}`;

            if (!edgeMap.has(edgeKey) && !(srcId === destId)) {
                const srcNode = nodeMap.get(srcId);
                const destNode = nodeMap.get(destId);
                if (srcNode != undefined && destNode != undefined) {
                    const srcPoint: Point = srcNode.point;
                    const destPoint: Point = destNode.point;
                    const weight = Math.sqrt(Math.pow(srcPoint.x - destPoint.x, 2) + Math.pow(srcPoint.y - destPoint.y, 2));
                    const edgeData = {srcId: srcId, destId: destId, srcPoint: srcPoint, destPoint: destPoint, weight: weight};

                    edgeMap.set(edgeKey, edgeData);
                    setEdgeCounter(edgeCounter + 1);
                    setShowEditNode(false);
                }
            }
        }
    }

    const handleClick = (e: MouseEvent) => {
        if (svgRef.current !== null) {
            const svgPt = svgRef.current.createSVGPoint();
            svgPt.x = e.clientX;
            svgPt.y = e.clientY;
            const cursorPt = svgPt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

            // Show add node screen
            if (e.target instanceof SVGSVGElement) {
                if (showEditNodeRef.current) {
                    setShowEditNode(false);
                    return;
                }

                if (!showAddNodeRef.current ) {
                    const clickedPt = {
                        x: e.clientX,
                        y: e.clientY
                    }
    
                    const svgPt = {
                        x: cursorPt.x,
                        y: cursorPt.y
                    };

                    setSvgAddNodePoint(svgPt);
                    setAddNodePoint(clickedPt);
                    setShowAddNode(true);
                } else {
                    setShowAddNode(false);
                }
            }
        }
    };

    const handleDeleteNode = () => {
        const removeEdges = [];
        edgeMap.forEach((val: EdgeData, key: string) => {
            // Delete any edges including deleted node
            if (selectedNode === val.srcId || selectedNode === val.destId) {
                edgeMap.delete(key);
            }
        });

        nodeMap.delete(selectedNode);
        setShowEditNode(false);
    };

    const handleEditNode = (offset: Point, id: string) => {
        setShowAddNode(false);
        setSelectedNode(id);
        setEditNodePoint(offset);
        setShowEditNode(true);
    };

    const handleMovement = (e: KeyboardEvent) => {
        const temp = { ...viewPtRef.current };
        switch(e.code) {
            // Up
            case "ArrowUp":
                temp.y -= 10;
                setViewPt(temp);
                break;
            // Down
            case "ArrowDown":
                temp.y += 10;
                setViewPt(temp);
                break;
            // Right
            case "ArrowRight":
                temp.x += 10;
                setViewPt(temp);
                break;
            // Left
            case "ArrowLeft":
                temp.x -= 10;
                setViewPt(temp);
                break;
            case "KeyZ":
                setZoom(zoomRef.current - 20);
                break;
            case "KeyX":
                setZoom(zoomRef.current + 20);
                break;
        }
    };

    const mapStyle: CSSProperties = {
        height: height,
        width: width,
    };
    
    return (
        <div className="map-wrapper">
            <svg className="map" style={mapStyle} viewBox={`${viewPt.x} ${viewPt.y} ${zoom} ${zoom}`} ref={svgRef}>
                {buildEdges()}
                {buildNodes()}
            </svg>
            {showAddNode &&
                buildAddNode()
            }
            {showEditNode &&
                buildEditNode()
            }
        </div>
    );
};

export default GraphMapUpdated;

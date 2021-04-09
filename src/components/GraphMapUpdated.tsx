import React, { useState, useEffect, useRef, CSSProperties } from "react";

import Edge from "./Edge";
import NodeUpdated from "./NodeUpdated";
import { GraphAnimationData, EdgeData, NodeData, Point } from "../types/types";
import dijkstra from "../algorithms/Dijkstra";

import "./GraphMapUpdated.scss";

interface GraphMapProps {
    height: number,
    width: number,
};

const GraphMapUpdated: React.FC<GraphMapProps> = ({height, width}) => {
    const [addNodePoint, setAddNodePoint] = useState<Point>({x: 0, y: 0});
    const [animations, setAnimations] = useState<GraphAnimationData[]>([]);
    const [animationSpeed, setAnimationSpeed] = useState(200);
    const [nodeCounter, setNodeCounter] = useState<number>(0);
    const [editNodePoint, setEditNodePoint] = useState<Point>({x: 0, y: 0});
    const [edgeCounter, setEdgeCounter] = useState<number>(0);
    const [edgeMap, setEdgeMap] = useState<Map<string, EdgeData>>(new Map<string, EdgeData>());
    const [nodeMap, setNodeMap] = useState<Map<number, NodeData>>(new Map<number, NodeData>());
    const [selectedNode, setSelectedNode] = useState<number>(0);
    const [showAddNode, _setShowAddNode] = useState<boolean>(false);
    const [showEditNode, _setShowEditNode] = useState<boolean>(false);
    const [svgAddNodePoint, setSvgAddNodePoint] = useState<Point>({x: 0, y: 0});
    const [viewPt, _setViewPt] = useState<Point>({x: 0, y: 0});
    const [zoom, _setZoom] = useState<number>(150);

    // NodeMap exists
    // EdgeMap exists
    // Need to create djikstra function to handle this

    useEffect(() => {
        window.addEventListener("keydown", handleMovement);
        window.addEventListener("click", handleClick);

        nodeMap.set(1, {id: 1, color: "#919191", name: "1", point: {x: 10, y: 10}, size: 10});
        nodeMap.set(2, {id: 2, color: "#919191", name: "2", point: {x: 30, y: 30}, size: 10});
        nodeMap.set(3, {id: 3, color: "#919191", name: "3", point: {x: 60, y: 30}, size: 10});
        nodeMap.set(4, {id: 4, color: "#919191", name: "4", point: {x: 100, y: 40}, size: 10});
        nodeMap.set(5, {id: 5, color: "#919191", name: "5", point: {x: 40, y: 100}, size: 10});
        nodeMap.set(6, {id: 6, color: "#919191", name: "6", point: {x: 80, y: 75}, size: 10});
        nodeMap.set(7, {id: 7, color: "#919191", name: "7", point: {x: 90, y: 100}, size: 10});

        edgeMap.set("1:2", {destId: 2, destPoint: {x: 30, y: 30}, srcId: 1, srcPoint: {x: 10, y: 10}, weight: 28.284271247461902});
        edgeMap.set("2:3", {destId: 3, destPoint: {x: 60, y: 30}, srcId: 2, srcPoint: {x: 30, y: 30}, weight: 30});
        edgeMap.set("3:4", {destId: 2, destPoint: {x: 100, y: 40}, srcId: 3, srcPoint: {x: 60, y: 30}, weight: 41.23105625617661});
        edgeMap.set("4:6", {destId: 6, destPoint: {x: 80, y: 75}, srcId: 4, srcPoint: {x: 100, y: 40}, weight: 40.311288741492746});
        edgeMap.set("6:7", {destId: 7, destPoint: {x: 90, y: 100}, srcId: 6, srcPoint: {x: 80, y: 75},weight: 26.92582403567252});
        edgeMap.set("6:5", {destId: 5, destPoint: {x: 40, y: 100}, srcId: 4, srcPoint: {x: 80, y: 75}, weight: 47.16990566028302});

        setEdgeCounter(7);
        setNodeCounter(8);

        return function cleanup() {
            window.removeEventListener("keydown", handleMovement);
            window.removeEventListener("click", handleClick);
        }
    }, []);

    useEffect(() => {
        if (animations.length > 0) {
            const tempAnimations: GraphAnimationData[] = [ ...animations ];
            const tempAnimationData = tempAnimations.shift();
            if (tempAnimationData === undefined) return;
            const animation: GraphAnimationData = tempAnimationData;
            switch (animation.type) {
                case "color":
                    setTimeout(() => {
                        const node = nodeMap.get(animation.id);
                        if (node === undefined) return;
                        console.log(node);
                        node.color = animation.color;
                        setAnimations(tempAnimations);
                    }, animationSpeed);
                    break;
                case "name":
                    // setTimeout(() => {
                        // const barOneIdx = animation.barOneIdx;
                        // const barTwoIdx = animation.barTwoIdx;
                        // const tempBarsInfo = JSON.parse(JSON.stringify(barsInfo));
                        // const tempBars = [ ...bars ];
                        // [tempBarsInfo[barOneIdx], tempBarsInfo[barTwoIdx]] = [tempBarsInfo[barTwoIdx], tempBarsInfo[barOneIdx]];
                        // [tempBars[barOneIdx], tempBars[barTwoIdx]] = [tempBars[barTwoIdx], tempBars[barOneIdx]];
                        // setBars(tempBars);
                        // setBarsInfo(tempBarsInfo);
                        // setAnimations(tempAnimations);
                    // }, animationSpeed);
                    break;
            }
        }
    }, [animations]);

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

        nodeMap.forEach((val: NodeData, key: number) => {
            // Eventually calculate if it should be rendered or not
            nodeObjs.push(<NodeUpdated key={Math.random() * 10000} data={val} color={val.color} editCallback={handleEditNode}/>);
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
        const nextNodeName: string = `${nextId}`;

        const newNode: NodeData = {
            id: nextId,
            color: "#919191",
            name: nextNodeName,
            point: {
                x: svgAddNodePoint.x,
                y: svgAddNodePoint.y
            },
            size: 10,
        };

        nodeMap.set(nextId, newNode);
        setNodeCounter(nextId);
        setShowAddNode(false);
    };

    const handleAddEdge = () => {
        if (addEdgeInputRef.current !== null && addEdgeInputRef.current.value.length > 0) {
            const srcId: number = selectedNode;
            const destId: number = parseInt(addEdgeInputRef.current.value);
            const edgeKey: string = `${srcId}:${destId}`;

            if (!edgeMap.has(edgeKey) && !(srcId === destId)) {
                const srcNode = nodeMap.get(srcId);
                const destNode = nodeMap.get(destId);
                if (srcNode !== undefined && destNode !== undefined) {
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

    const handleEditNode = (offset: Point, id: number) => {
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

    // temporarily do not use
    const mapStyle: CSSProperties = {
        height: height,
        width: width,
    };

    const handleDijkstra = () => {
        const tempAnimations = dijkstra(selectedNode, nodeMap, edgeMap);
        // console.log(tempAnimations);
        setAnimations(tempAnimations);
    };
    
    return (
        <div className="map-wrapper">
            <svg className="map" viewBox={`${viewPt.x} ${viewPt.y} ${zoom} ${zoom}`} ref={svgRef}>
                {buildEdges()}
                {buildNodes()}
            </svg>
            {showAddNode &&
                buildAddNode()
            }
            {showEditNode &&
                buildEditNode()
            }
            <div className="test" onClick={handleDijkstra}>DJIKSTRA</div>
        </div>
    );
};

export default GraphMapUpdated;

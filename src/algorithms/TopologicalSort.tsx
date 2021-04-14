import { GraphAnimationData, EdgeData, NodeData} from "../types/types";

interface Node {
    id: number,
    inDegree: number,
    neighbors: Edge[]
}

interface Edge {
    dest: Node
};

const topologicalSort = (nodes: Map<number, NodeData>, edges: Map<string, EdgeData>): GraphAnimationData[] => {
    // Kahn's Algorithm
    const animations: GraphAnimationData[] = [];
    const graph: Map<number, Node> = new Map<number, Node>();
    const queue: Node[] = [];
    const sorted: Node[] = [];
    let nodeCount: number = 0;

    // Add nodes
    nodes.forEach((val: NodeData, key: number) => {
        nodeCount++;
        graph.set(
            key,
            {
                id: key,
                inDegree: 0,
                neighbors: []
            }
        );
    });

    edges.forEach((val: EdgeData, key: string) => {
        const src: number = val.srcId;
        const dest: number = val.destId;
        const srcNode: Node | undefined = graph.get(src);
        const destNode: Node | undefined = graph.get(dest);

        // Add edges
        if (srcNode !== undefined && destNode !== undefined) {
            destNode.inDegree++;
            srcNode.neighbors.push({
                dest: destNode
            });
        }
    });

    graph.forEach((node: Node, key: number) => {
        if (node.inDegree == 0) {
            queue.push(node);
            animations.push({
                id: node.id,
                type: "all",
                color: "#7c94e4",
                name: node.id.toString(),
            });
        }
    });

    while (queue.length > 0) {
        const currNode: Node | undefined = queue.pop();

        if (currNode !== undefined) {
            sorted.push(currNode);

            animations.push({
                id: currNode.id,
                type: "all",
                color: "#e4e4e4",
                name: sorted.length.toString(),
            });

            currNode.neighbors.forEach((e: Edge) => {
                const destNode: Node | undefined = graph.get(e.dest.id);
                if (destNode !== undefined) {
                    destNode.inDegree = destNode.inDegree - 1;
                    
                    if (destNode.inDegree == 0) {
                        animations.push({
                            id: destNode.id,
                            type: "all",
                            color: "#7c94e4",
                            name: destNode.id.toString(),
                        });
                        queue.push(destNode);
                    }
                }
            });
        }
    }

    if (sorted.length == nodeCount) console.log("ABLE TO BE BUILT");

    return animations;
}

export default topologicalSort;
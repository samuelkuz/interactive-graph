
import { GraphAnimationData, EdgeData, NodeData} from "../types/types";

interface Node {
    id: number,
    neighbors: Edge[]
}

interface Edge {
    dest: Node
};

const kosaraju = (nodes: Map<number, NodeData>, edges: Map<string, EdgeData>): GraphAnimationData[] => {
    // Kahn's Algorithm
    const animations: GraphAnimationData[] = [];
    const graph: Map<number, Node> = new Map<number, Node>();

    // Add nodes
    nodes.forEach((val: NodeData, key: number) => {
        graph.set(
            key,
            {
                id: key,
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
            srcNode.neighbors.push({
                dest: destNode
            });
        }
    });

    const stack: number[] = [];
    const visited: Set<number> = new Set<number>();

    graph.forEach((node: Node, key: number) => {
        if (!visited.has(key)) {
            fillOrder(node, visited, stack);
        }
    });

    const transpose: Map<number, Node> = getTranspose(nodes, edges);

    visited.clear();

    while (stack.length > 0) {
        const id = stack.pop();
        
        if (id !== undefined) {
            if (!visited.has(id)) {
                //DFSUtil(v, visited);
                console.log("");
            }    
        }
    }

    return animations;
}

const getTranspose = (nodes: Map<number, NodeData>, edges: Map<string, EdgeData>): Map<number, Node> => {
    const tempGraph: Map<number, Node> = new Map<number, Node>();

    nodes.forEach((val: NodeData, key: number) => {
        tempGraph.set(
            key,
            {
                id: key,
                neighbors: []
            }
        );
    });

    // Transpose the edges
    edges.forEach((val: EdgeData, key: string) => {
        const src: number = val.srcId;
        const dest: number = val.destId;
        const srcNode: Node | undefined = tempGraph.get(src);
        const destNode: Node | undefined = tempGraph.get(dest);

        // Add edges
        if (srcNode !== undefined && destNode !== undefined) {
            destNode.neighbors.push({
                dest: srcNode
            });
        }
    });

    return tempGraph;
};

const fillOrder = (n: Node, visited: Set<number>, stack: number[]): void => {
    visited.add(n.id);

    n.neighbors.forEach((e: Edge) => {
        const destNode = e.dest;
        if (!visited.has(destNode.id)) {
            fillOrder(destNode, visited, stack);
        }
    });

    stack.push(n.id);
};

export default kosaraju;
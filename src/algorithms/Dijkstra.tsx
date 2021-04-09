import { GraphAnimationData, EdgeData, NodeData} from "../types/types";

interface GraphNode {
    id: number,
    neighbors: Edge[]
}

interface Edge {
    dest: GraphNode,
    weight: number,
};

interface Distance {
    id: number,
    distance: number,
};

interface PriorityQueue {
    insert(item: Distance): void,
    peek(): Distance | null,
    pop(): Distance | null,
    size(): number,
    isEmpty(): boolean,
};

const priorityQueue = (): PriorityQueue => {
    let heap: Distance[] = [];

    const parent = (index: number) => Math.floor((index - 1) / 2);
    const left = (index: number) => 2 * index + 1;
    const right = (index: number) => 2 * index + 2;
    const hasLeft = (index: number) => left(index) < heap.length;
    const hasRight = (index: number) => right(index) < heap.length;

    const swap = (a: number, b: number) => {
        const temp = heap[a];
        heap[a] = heap[b];
        heap[b] = temp;  
    }

    return {
        insert: (item: Distance) => {
            heap.push(item);

            let i = heap.length - 1;

            while (i > 0) {
                const p = parent(i);

                if (heap[p].distance < heap[i].distance) break;
                swap(i, p);
                i = p;
            }
        },

        peek: () => {
            if (heap.length === 0) {
                return null
            } else {
                return heap[0];
            }
        },

        pop: () => {
            if (heap.length == 0) return null;

            swap(0, heap.length - 1);
            const item = heap.pop();

            let current = 0;
            while (hasLeft(current)) {
                let smallerChild = left(current);
                if (hasRight(current) && (heap[right(current)].distance < heap[left(current)].distance)) {
                    smallerChild = right(current);
                }

                if (heap[smallerChild].distance > heap[current].distance) break;

                swap(current, smallerChild);
                current = smallerChild;
            }

            return (item !== undefined) ? item: null;
        },

        size: () => {
            return heap.length;
        },

        isEmpty: () => {
            return (heap.length === 0); 
        }
    };
}

const dijkstra = (srcId: number, nodes: Map<number, NodeData>, edges: Map<string, EdgeData>): GraphAnimationData[] => {
    const animations: GraphAnimationData[] = [];
    const graphNodes: Map<number, GraphNode> = new Map<number, GraphNode>();
    const distMap: Map<number, number> = new Map<number, number>();
    const visited: Set<number> = new Set<number>();

    // Add nodes
    nodes.forEach((val: NodeData, key: number) => {
        graphNodes.set(
            key,
            {
                id: key,
                neighbors: []
            }
        );

        distMap.set(key, Number.POSITIVE_INFINITY);
    });

    edges.forEach((val: EdgeData, key: string) => {
        const temp: string[] = key.split(':');
        const src: number = parseInt(temp[0]);
        const dest: number = parseInt(temp[1]);

        const srcNode: GraphNode | undefined = graphNodes.get(src);
        const destNode: GraphNode | undefined = graphNodes.get(dest);

        // Add edges
        if (srcNode !== undefined && destNode !== undefined) { 
            srcNode.neighbors.push({
                dest: destNode,
                weight: val.weight,    
            });
        }
    });

    // console.log(graphNodes, distMap, visited);
    
    const prioQ = priorityQueue();

    distMap.set(srcId, 0);
    prioQ.insert({id: srcId, distance: 0});

    while (!prioQ.isEmpty()) {
        const temp: Distance | null = prioQ.pop();
        
        if (temp !== null) {
            visited.add(temp.id);
            animations.push({
                id: temp.id,
                type: "color",
                color: "#000",
                weight: temp.distance,
            });
            const currNode: GraphNode | undefined = graphNodes.get(temp.id);
            const currWeight: number | undefined = distMap.get(temp.id);

            if (currNode !== undefined && currWeight !== undefined) {
                currNode.neighbors.forEach((e: Edge) => {
                    const destId = e.dest.id;
                    if (!visited.has(destId)) {
                        const nextPossibleWeight: number = currWeight + e.weight;
                        // any to get rid of annoying undefined check
                        const oldLowestWeight: any = (distMap.has(destId)) ? distMap.get(destId) : Number.POSITIVE_INFINITY;

                        if (nextPossibleWeight < oldLowestWeight) {
                            distMap.set(destId, nextPossibleWeight);
                            prioQ.insert({
                                id: destId,
                                distance: nextPossibleWeight
                            });
                        }
                    }
                });
            }
        }
    }
    
    console.log(distMap);
    
    return animations;
};

export default dijkstra;
export interface Point {
    x: number,
    y: number,
};

export interface NodeData {
    id: string,
    point: Point,
    size: number,
    edges: string[],
};

export interface EdgeData {
    srcId: string,
    destId: string,
    srcPoint: Point,
    destPoint: Point,
    weight: number,
};
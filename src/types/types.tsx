export interface Point {
    x: number,
    y: number,
};

export interface NodeData {
    id: number,
    name: string,
    point: Point,
    size: number,
};

export interface EdgeData {
    srcId: number,
    destId: number,
    srcPoint: Point,
    destPoint: Point,
    weight: number,
};
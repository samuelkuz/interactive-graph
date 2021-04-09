export interface Point {
    x: number,
    y: number,
};

export interface NodeData {
    id: number,
    color: string,
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

export interface GraphAnimationData {
    id: number,
    type: string,
    color: string,
    weight: number,
}

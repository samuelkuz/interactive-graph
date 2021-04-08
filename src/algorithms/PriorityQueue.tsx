interface Node<T> {
    key: number,
    value: T
};

interface PriorityQueue<T> {
    insert(item: T, priority: number): void,
    peek(): T | null,
    pop(): T | null,
    size(): number,
    isEmpty(): boolean,
};

interface Comparator<T> {
    compare(a: T, b: T): number,
};

const priorityQueue = <T,>(compare: Comparator<T>): PriorityQueue<T> => {
    let heap: Node<T>[] = [];

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
        insert: (item: T, priority: number) => {
            heap.push({key: priority, value: item});

            let i = heap.length - 1;

            while (i > 0) {
                const p = parent(i);
                if (heap[p].key < heap[i].key) break;
                swap(i, p);
                // const temp = heap[i];
                // heap[i] = heap[p];
                // heap[p] = temp;
                i = p;
            }
        },

        peek: () => {
            if (heap.length === 0) {
                return null
            } else {
                return heap[0].value;
            }
        },

        pop: () => {
            if (heap.length == 0) return null;

            swap(0, heap.length - 1);
            const item = heap.pop();

            let current = 0;
            while (hasLeft(current)) {
                let smallerChild = left(current);
                if (hasRight(current) && (heap[right(current)].key < heap[left(current)].key)) {
                    smallerChild = right(current);
                }

                if (heap[smallerChild].key > heap[current].key) break;

                swap(current, smallerChild);
                current = smallerChild;
            }

            return (item !== undefined) ? item.value: null;
        },

        size: () => {
            return heap.length;
        },

        isEmpty: () => {
            return (heap.length === 0); 
        }
    };
}

export default priorityQueue;
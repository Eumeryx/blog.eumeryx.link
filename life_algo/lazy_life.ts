import { Life, Point } from "./common";

type ArraySize<T, N extends number> = T[] & { length: N }

type CellPoint = { state: boolean, point: Point }

/**
 * bits |     5      |4            0|
 *      |------------|--------------|
 * name | alive flag | neighbor sum |
 *      |------------|--------------|
 * mask |    0x10    |     0xf      |
 *      
 * 
 */
class Cell {
    inner: number

    constructor(inner: number) {
        this.inner = inner
    }

    get neighborCount(): number {
        return this.inner & 0xf
    }

    get state(): boolean {
        return this.inner > 0xf
    }

    set state(isAlive: boolean) {
        const state = isAlive ? 0x10 : 0x00

        this.inner = this.neighborCount | state
    }

    get nextState(): boolean {
        const count = this.neighborCount

        return count === 3 || (count === 2 && this.state)
    }

    /** 邻居状态改变 */
    neighborChange(neighbor: boolean) {
        if (neighbor) {
            this.inner += 1
        } else {
            this.inner -= 1
        }
    }
}

export class LazyLife {

    private universe: Uint8Array
    private possible = new Map<number, Point>()

    private width: number
    private height: number

    private max_x: number
    private max_y: number

    diffCellList: CellPoint[] = []

    constructor(width: number, height: number) {
        this.width = Math.trunc(width)
        this.height = Math.trunc(height)

        this.max_x = this.width - 1
        this.max_y = this.height - 1

        const length = this.width * this.height
        this.universe = new Uint8Array(length)
    }

    coord2Index({ x, y }: Point): number {
        return x + y * this.width
    }

    /**
     * 
     *  wn | xn | en
     * ----|----|----
     *  wy | xy | ey
     * ----|----|----
     *  ws | xs | es
     */
    neighborCoord({ x, y }: Point): ArraySize<Point, 8> {
        let n = y - 1
        let s = y + 1
        let w = x - 1
        let e = x + 1

        if (n === -1) n = this.max_y
        if (w === -1) w = this.max_x
        if (e === this.width) e = 0
        if (s === this.height) s = 0

        return [
            new Point(w, y),
            new Point(e, y),
            new Point(w, n),
            new Point(x, n),
            new Point(e, n),
            new Point(w, s),
            new Point(x, s),
            new Point(e, s),
        ]
    }

    neighborCountModify(coord: Point, state: boolean): void {
        for (const p of this.neighborCoord(coord)) {
            const idx = this.coord2Index(p)
            const cell = new Cell(this.universe[idx])

            cell.neighborChange(state)
            this.universe[idx] = cell.inner

            this.possible.set(idx, p)
        }
    }

    tick(): void {
        this.diffCellList = []
        const newPossible = new Map<number, Point>()

        for (const [index, point] of this.possible) {
            const cell = new Cell(this.universe[index])
            const { state, nextState } = cell

            if (nextState !== state) {
                cell.state = nextState
                this.universe[index] = cell.inner

                newPossible.set(index, point)
                this.diffCellList.push({ point, state: nextState })
            }
        }

        this.possible = newPossible

        for (const { point, state } of this.diffCellList) {
            this.neighborCountModify(point, state)
        }
    }

    setCall(coord: Point, state: boolean): void {
        const index = this.coord2Index(coord)

        const cell = new Cell(this.universe[index])

        if (cell.state !== state) {
            cell.state = state
            this.universe[index] = cell.inner

            this.possible.set(index, coord)
            this.neighborCountModify(coord, state)
        }
    }


    getCell(coord: Point): boolean {
        const index = this.coord2Index(coord)
        const cell = new Cell(this.universe[index])

        return cell.state
    }

    get cellIterable() {
        const that = this
        return function* () {
            for (let y = 0; y < that.height; y++) {
                for (let x = 0; x < that.width; x++) {
                    const point = new Point(x, y)
                    const idx = that.coord2Index(point)
                    const cell = new Cell(that.universe[idx])

                    yield { point, state: cell.state };
                }
            }
        }()
    }
}

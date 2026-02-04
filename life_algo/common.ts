
export abstract class Life<C> {

    abstract tick(): void

    abstract setCall(point: Point, cell: C): void

    abstract getCell(point: Point): C

    abstract aliveCellIter(): Iterable<C>
}

export class Range {
    top: number
    left: number
    right: number
    bottom: number

    constructor(left: number, top: number, right: number, bottom: number) {
        this.top = Math.trunc(top)
        this.left = Math.trunc(left)
        this.right = Math.trunc(right)
        this.bottom = Math.trunc(bottom)
    }

    static fromWHLT(width: number, height: number, left: number = 0, top: number = 0): Range {
        top = Math.trunc(top)
        left = Math.trunc(left)
        const right = left + Math.trunc(width)
        const bottom = top + Math.trunc(height)

        return new Range(left, top, right, bottom)
    }

    get leftTop(): Point {
        return new Point(this.left, this.top)
    }

    get shape(): Point {
        const width = this.right - this.left
        const height = this.bottom - this.top

        return new Point(width, height)
    }

    get size(): number {
        const shape = this.shape

        return shape.x * shape.y
    }
}

export class Point {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = Math.trunc(x)
        this.y = Math.trunc(y)
    }

    sub(rhs: Point): Point {
        const x = this.x - rhs.x
        const y = this.y - rhs.y

        return new Point(x, y)
    }
}

type Brand<K, T> = K & { __brand: T }

type Int = Brand<number, 'Int'>

export type IntLiteral<N> = N extends number ? `${N}` extends `${bigint}` ? N : never : never

export type IntLike<N> = IntLiteral<N> | Int

export type NInt<N> = N extends number ? `${N}` extends `-${bigint}` ? N : never : never

export type UInt<N> = N extends IntLiteral<N> ? N extends NInt<N> ? never : N : never

const x = <T>(n: NInt<T>) => n

x(-1)
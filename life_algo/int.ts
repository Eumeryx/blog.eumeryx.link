export type Brand<T, U, K extends symbol | string = '__brand'> = T & { [key in K]: U }

const __intBrand = Symbol()
type IntTag = Brand<number, 'this is an int', typeof __intBrand>

export type Int<N> = N extends number
    ? `${N}` extends `${bigint}`
    ? N
    : IntTag
    : IntTag

type GetHead<S extends string> = S extends `${infer Head}${infer _}` ? Head : never
type GetTail<S extends string> = S extends `${infer _}${infer Tail}` ? Tail : never
type GetTupleTail<S> = S extends [infer _, ...infer Tail] ? Tail : never

type CompareStringLength<L extends string, R extends string> =
    L extends ''
    ? R extends '' ? 'equal' : 'less'
    : R extends ''
    ? 'great'
    : CompareStringLength<GetTail<L>, GetTail<R>>

type CompareDigit<L extends number, R extends number, Tuple extends unknown[] = []> =
    L extends R
    ? 'equal'
    : Tuple['length'] extends L
    ? 'less'
    : Tuple['length'] extends R
    ? 'great'
    : CompareDigit<L, R, [unknown, ...Tuple]>

type ComparePlaceSingly<L extends number[], R extends number[]> =
    CompareDigit<L[1], R[1]> extends infer P
    ? P extends 'equal'
    ? ComparePlaceSingly<GetTupleTail<L>, GetTupleTail<R>>
    : P
    : never


type CompareSameLengthInteger<L extends number, R extends number> = 
    CompareDigit<GetHead<`${L}`>, GetHead<`${R}`>>

type CompareInteger<L extends number, R extends number> =
    CompareStringLength<`${L}`, `${R}`> extends infer P
    ? P extends 'equal'
    ? 
    : P
    : never

type kkkkkkklkkk = CompareDigit<8, 5>

type MaxSafeInteger = 9007199254740991

type Equal<L, R> = L extends R ? true : false 



type StringSplit<S extends string, T = ''> =
    S extends ''
    ? T
    : S extends `${infer Head}${infer Tail}`
    ? T extends ''
    ? StringSplit<Tail, Head>
    : StringSplit<Tail, T | Head>
    : never


type test = StringSplit<'jgkuftu你还'>
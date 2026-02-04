type Params = { x?: number, y?: number, rules?: string } & { [key in string]: string }

export interface Header {
    name?: string
    owner?: string
    comment?: string
    rule?: string
    params?: Params
}

export class VanillaCell {
    static Dead = false
    static Alive = true

    static fromRleChat(c: string) {
        if (c === 'b') return VanillaCell.Dead
        if (c === 'o') return VanillaCell.Alive
    }

    static toRleChat(c: boolean) {
        return c ? VanillaCell.Alive : VanillaCell.Dead
    }
}


export class RLE {
    static headerRE = /^#(?<tag>[NOC])\s*(?<content>.+)/

    static paramsRE = /^(?<key>\S+)\s*=\s*(?<value>\S+),?/

    static cellRE = /(?<count>\d*)(?<tag>[a-zA-Z$!])/g

    header: Header
    aliveCells: {x: number, y: number}[]

    constructor(aliveCells: {x: number, y: number}[], header: Header) {
        this.aliveCells = aliveCells
        this.header = header
    }

    static fromString(str: string): RLE {
        const header: Header = {}

        str = str.trimStart()
        let cap: RegExpExecArray | null = null

        while (cap = this.headerRE.exec(str)) {
            str = str.substring(cap[0].length).trimStart()

            const { tag, content } = cap.groups!

            switch (tag) {
                case 'N':
                    header.name = content
                    break
                case 'O':
                    header.owner = content
                    break
                case 'C':
                    if (header.comment) {
                        header.comment += `\n${content}`
                    } else {
                        header.comment = content
                    }
            }
        }

        while (cap = this.paramsRE.exec(str)) {
            str = str.substring(cap[0].length).trimStart()

            let { key, value } = cap.groups!
            header.params ??= {}

            if (key === 'x' || key === 'y') {
                header.params[key] = parseInt(value)
            } else {
                header.params[key] = value
            }
        }

        let [x, y] = [0, 0];
        const aliveCells: { x: number, y: number }[] = []

        loop: for (const { groups } of str.matchAll(this.cellRE)) {
            let count = parseInt(groups!.count) || 1

            switch (groups?.tag) {
                case '!':
                    break loop
                case '$':
                    x = 0
                    y += count
                    break
                case 'b':
                    x += count
                    break
                case 'o':
                    do {
                        aliveCells.push({ x, y })
                        x += 1
                    } while (--count)
                    break
                default:
                    continue
            }
        }

        return new RLE(aliveCells, header)
    }
}
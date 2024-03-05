interface Options {
    code: string
    name: string
    id: string
    displayName: string
}

type OptionSetsRecord = Record<string, {
    name: string
    id: string
    displayName: string
    options: Options[]
}>

export type { OptionSetsRecord, Options}
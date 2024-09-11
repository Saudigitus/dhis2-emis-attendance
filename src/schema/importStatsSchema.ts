import { atom } from "recoil"

export const ImportStatsSchema = atom<{ statsCount: { created: number, ignored: number, total: number, updated: number }, errorDetails: any[] }>({
    key: "import-stats",
    default: { statsCount: { created: 0, ignored: 0, total: 0, updated: 0 }, errorDetails: [] }
})

import type { Attendance } from "../../types/dataStore/DataStoreConfig";

export function getFilterLables(options: Attendance['statusOptions']) {
    let filter = ""

    options.map((option) => {
        filter += option.key.substring(0, 1).toUpperCase() + option.key.substring(1, option.key.length) + ","
    })


    return filter.substring(0, filter.length - 1)
}

export function getOptionCode(key: string, options: Attendance['statusOptions']) {
    for (let index = 0; index < options.length; index++) {
        if (options[index].key === key.substring(0, 1).toLocaleLowerCase() + key.substring(1, key.length))
            return options[index].code
    }
}
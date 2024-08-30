export const border = {
    top: { style: 'thin', color: { argb: '9B9B9B' }, },
    left: { style: 'thin', color: { argb: '9B9B9B' } },
    bottom: { style: 'thin', color: { argb: '9B9B9B' } },
    right: { style: 'thin', color: { argb: '9B9B9B' } },
}

export const fill = {
    type: 'pattern',
    pattern: 'solid',
}

export const alignment = {
    horizontal: 'center',
    vertical: 'middle'
}

export const lock = {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: true,
    formatColumns: false,
    formatRows: true,
    insertColumns: false,
    insertRows: false,  // Prevents inserting new rows
    deleteColumns: false,
    deleteRows: false,  // Prevents deleting rows
    sort: true,
    autoFilter: true,
    pivotTables: false,
    objects: false,
    scenarios: false
}

export const dataValidation = {
    type: 'list',
    allowBlank: true,
    showDropDown: true,
    showErrorMessage: true,
    errorTitle: 'Invalid Entry',
    error: 'Please select a value from the list.'
}
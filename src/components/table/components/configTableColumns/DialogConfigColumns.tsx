import React, { useState, useEffect } from 'react'
import i18n from '@dhis2/d2-i18n';
import { Button } from 'react-bootstrap';
import { type CustomAttributeProps } from '../../../../types/variables/AttributeColumns';
import DragDropList from '../../../dragDrop/DragDropList';
import { Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import { DialogSelectColumnsProps } from '../../../../types/table/ConfigColumnsTypes';

function DialogSelectColumns(props: DialogSelectColumnsProps) {
    const { open, onClose, headers = [], updateVariables, filteredHeaders } = props
    const [columnsList, setcolumnsList] = useState<CustomAttributeProps[]>([])

    useEffect(() => {
        if (filteredHeaders?.length == 0) setcolumnsList([])
    }, [filteredHeaders])

    function handleToggle(id: string) {
        const localColumns = columnsList?.length > 0 ? [...columnsList] : [...headers] as CustomAttributeProps[]

        if (id === 'all') {
            const all = localColumns?.filter(x => x.visible == false)?.length
            let copy: any[] = []

            if (all === 0)
                for (let i = 0; i < localColumns.length; i++)
                    copy[i] = { ...headers[i], visible: false }
            else
                for (let i = 0; i < localColumns.length; i++)
                    copy[i] = { ...headers[i], visible: true }

            setcolumnsList(copy)
        } else {
            const index = localColumns.findIndex(column => column.id === id);
            localColumns[index] = { ...localColumns[index], visible: !(localColumns[index].visible) };
            setcolumnsList(localColumns)
        }
    };

    const handleSave = () => {
        updateVariables(columnsList?.length > 0 ? columnsList : headers)

        onClose()
    };

    const handleUpdateListOrder = (sortedList: CustomAttributeProps[]) => {
        setcolumnsList(sortedList)
    };

    return (
        <>
            <Dialog
                open={!!open}
                onClose={onClose}
                fullWidth
            >
                <DialogTitle>{i18n.t('Columns to show in the table')}</DialogTitle>
                <DialogContent>
                    <DragDropList
                        listItems={columnsList?.length > 0 ? columnsList : headers}
                        handleUpdateListOrder={handleUpdateListOrder}
                        handleToggle={handleToggle}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={handleSave}>
                        {i18n.t('Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogSelectColumns

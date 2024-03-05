import React from 'react'
import i18n from '@dhis2/d2-i18n';
import { DndProvider } from 'react-dnd';
import DragDropListItem from './DragDropItems.js';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragDropListProps } from '../../types/dragDrop/DragDropTypes.js';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

function DragDropList(props: DragDropListProps) {
    const { listItems, handleToggle } = props;
    
    return (
        <DndProvider backend={HTML5Backend}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={12}>{i18n.t('Column')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listItems?.map((item, i) =>
                        <DragDropListItem
                            key={item.id}
                            id={item.id}
                            text={item.header}
                            handleToggle={handleToggle}
                            visible={item.visible}
                        />
                    )}
                </TableBody>
            </Table>
        </DndProvider>
    )
}

export default DragDropList

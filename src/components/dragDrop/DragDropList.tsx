import i18n from '@dhis2/d2-i18n';
import React from 'react'
import { DndProvider } from 'react-dnd';
import DragDropListItem from './DragDropItems.js';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragDropListProps } from '../../types/dragDrop/DragDropTypes.js';
import { Table, TableBody, TableHead } from '@material-ui/core';

function DragDropList(props: DragDropListProps) {
    const { listItems, handleToggle } = props;
    return (
        <DndProvider backend={HTML5Backend}>
            <Table>
                <TableHead>
                    <DragDropListItem
                        key={"all"}
                        id={"all"}
                        text={i18n.t('Column')}
                        handleToggle={handleToggle}
                        visible={listItems?.filter(x => x.visible == false)?.length == 0}
                    />
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

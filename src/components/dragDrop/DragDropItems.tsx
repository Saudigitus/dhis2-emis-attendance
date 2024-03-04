
import React from 'react'
import style from './dragdrop.module.css'
import { Checkbox, IconReorder24 } from '@dhis2/ui';
import TableCell from '@material-ui/core/TableCell';

interface DragDropItemsProps {
    id: string
    visible: boolean
    text: string
    classes?: {
        checkbox: string
    }
    handleToggle: (id: string) => void
}

function DragDropItems(props: DragDropItemsProps) {
    const { handleToggle, id, text } = props;
    return (
        <tr key={props.id} tabIndex={-1}>
            <TableCell component="th" scope="row">
                <Checkbox
                    checked={props.visible}
                    tabIndex={-1}
                    onChange={() => { handleToggle(id); }}
                    label={text}
                    valid dense />
            </TableCell>
            <TableCell>
                <span 
                    className={style.dragDrogItemRightCell}
                >
                    <IconReorder24 />
                </span>
            </TableCell>
        </tr>
    )
}

export default DragDropItems

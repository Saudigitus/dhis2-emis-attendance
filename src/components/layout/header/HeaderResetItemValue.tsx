import React from 'react'
import styles from "./mainHeader.module.css"
import CancelIcon from '@material-ui/icons/Cancel';

export default function HeaderResetItemValue(props: any): React.ReactElement {
    const { onReset } = props
    
    return (
        <div 
            onClick={onReset}
            className={styles.headerResetItemValue}
        >
            <CancelIcon />
        </div>
    )
}
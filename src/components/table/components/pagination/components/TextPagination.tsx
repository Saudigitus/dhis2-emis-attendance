import React from 'react'
import defaultClasses from '../../table.module.css';

export function TextPagination(props: any): React.ReactElement {
    const { text } = props;

    return (
        <span className={defaultClasses.textPagination}>
            {text}
        </span>
    )
}

import React from 'react'
import { IconButton } from '@material-ui/core';
import defaultClasses from '../../table.module.css';

export function IconButtonPagination(props: any): React.ReactElement {
    const {onPageChange, disabled, ariaLabel, icon } = props;

    return (
        <IconButton
            className={defaultClasses.paginationIconButton}
            onClick={onPageChange}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {icon}
        </IconButton>
    )
}

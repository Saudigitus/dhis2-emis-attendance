import React from 'react'
import Select from 'react-select';
import defaultClasses from '../table.module.css';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { disableNextPage } from '../../../../utils/table/pagination/pagination';
import { rowsPerPages } from '../../../../utils/constants/pagination/pagination';
import { TextPagination } from './components/TextPagination';
import { IconButtonPagination } from './components/IconButtonPagination';

interface PaginationProps {
    page: number
    rowsPerPage: number
    onPageChange: (page: number) => void
    onRowsPerPageChange: (rowsPerPage: number) => void
    loading: boolean
    totalPerPage: number
}

interface IconButtonPaginationProps {
    onPageChange: (page: number) => void
    ariaLabel: string
    disabled: boolean
    Icon: React.ReactNode
}

function textPagination(text: string): React.ReactElement {
    return (
        <span className={defaultClasses.textPagination}>
            {text}
        </span>
    )
}


function Pagination({ page, rowsPerPage, onPageChange, onRowsPerPageChange, loading, totalPerPage }: PaginationProps): React.ReactElement {
    return (
        <div
            className={defaultClasses.pagination}
        >
            <div />

            <div className={defaultClasses.rootPagination}>
                <TextPagination text="Rows per page"/>

                <Select
                    value={rowsPerPage}
                    clearValueText={false}
                    options={rowsPerPages}
                    clearable={false}
                    searchable={false}
                    onChange={onRowsPerPageChange}
                    className={defaultClasses.textPagination}
                    menuContainerStyle={{ top: 'auto', bottom: '100%' }}
                />
                <TextPagination text={`Page ${page}`}/>

                <IconButtonPagination
                    Icon={<KeyboardArrowLeft />}
                    ariaLabel='Previous Page'
                    disabled={page <= 1 || loading}
                    onPageChange={() => { onPageChange(page - 1); }}
                />

                <IconButtonPagination
                    Icon={<KeyboardArrowRight />}
                    ariaLabel='Next Page'
                    disabled={disableNextPage({ rowsPerPage, totalPerPage }) || loading}
                    onPageChange={() => { onPageChange(page + 1); }}
                />

            </div>
        </div>
    )
}

export default Pagination

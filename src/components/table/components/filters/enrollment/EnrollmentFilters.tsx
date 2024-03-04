import React from 'react'
import ContentFilter from './ContentFilter';
import style from './enrollmentFilter.module.css';
import { useHeader } from '../../../../../hooks/tableHeader/useHeader';

function EnrollmentFilters(): React.ReactElement {
    const { columns } = useHeader()
    
    return (
        <div className={style.enrollmentFilterContainer}>
            <ContentFilter headers={columns} />
        </div>
    )
}

export default EnrollmentFilters

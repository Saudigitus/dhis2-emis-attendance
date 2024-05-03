import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { SingleSelectProps } from '../../../../../types/form/singleSelectTypes'

function SingleSelect(props: SingleSelectProps) {
    const {
        options,
        selectedTerm,
        setSelectedTerm,
    } = props;


    return (
        <div>
            <SingleSelectField
                className="select"
                {...props}
                selected={selectedTerm || null}
                onChange={(e: any) => { setSelectedTerm(e.selected, options.find((x: any) => x.code === e.selected).code) }}
            >
                {options?.map((x: any) =>
                    <SingleSelectOption key={x.code} label={x.Component} value={x.code} />
                )}
            </SingleSelectField>
        </div>
    )
}

export default SingleSelect

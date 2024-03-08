import React from 'react'
import { Input } from "@dhis2/ui"
import classNames from 'classnames'
import style from "./search.module.css"
import { useRecoilState } from 'recoil'
import { OuQueryString } from '../../schema/headerSearchInputSchema'
import { SimpleSearchProps } from '../../types/simpleSearch/SimpleSearchTypes';

export default function SimpleSearch(props: SimpleSearchProps): React.ReactElement {
    const { children, placeholder, id } = props;
    const [stringQuery, setStringQuery] = useRecoilState(OuQueryString);

    const onChange = (e: { value: string, name: string }) => {
        setStringQuery(e.value);
    }

    
    return (
        <div className={classNames(style.SimpleSearchContainer, style[id])}>
            <div className={style.SimpleSearcInputContainer}>
                <Input placeholder={placeholder} onChange={onChange} value={stringQuery} initialFocus dense label="An input" name="input" />
            </div>
            <div className={style.ChildrenContentContainer}>{children}</div>
        </div>
    )
}

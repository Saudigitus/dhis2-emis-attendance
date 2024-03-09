import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { DataStoreState } from '../../schema/dataStoreSchema'

const useParams = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const add = (key: string, value: string) => {
        searchParams.set(key, value)
        setSearchParams(searchParams)
    }
    const remove = (key: string) => {
        searchParams.delete(key)
        setSearchParams(searchParams)
    }
    const useQuery = () => {
        return new URLSearchParams(searchParams)
    }

    const filterItemsParams: Record<string, any> = {};

    const filterItems = useRecoilValue(DataStoreState).find(data => data.key === useQuery().get('sectionType'))?.filters?.dataElements.map(filterItem => {
        filterItemsParams[filterItem.code] = useQuery().get(filterItem.code);
    });

    const urlParamiters = () => {
        return {
            school: useQuery().get('school'),
            schoolName: useQuery().get('schoolName'),
            academicYear: useQuery().get('academicYear'),
            sectionType: useQuery().get('sectionType'),
            ...filterItemsParams

        }
    }
    return { add, remove, useQuery, urlParamiters }
}
export { useParams }

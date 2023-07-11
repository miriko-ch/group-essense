import { useState } from 'react'
import { useSetState } from 'ahooks'
import _ from 'lodash'
import messageAPI from '@/pages/api/messageAPI'
import useTransformList from './useTransformList'

const useListData = (props) => {

    const fetchList = async (payload) => {
        const res = await fetch(
            messageAPI,
            {
                method: 'post',
                body: JSON.stringify(payload)
            }
        )
        const data = await res.json()
        return data
    }

    const transformList = useTransformList()

    const getListData = async (currentPage, pageSize) => {
        if (currentPage === undefined) currentPage = 1
        const data = await fetchList({ currentPage, pageSize })

        const { listData: messageList } = data
        const transedKeysList = transformList(messageList)

        const newPagination = _.omit(data, 'listData')

        return { list: transedKeysList, ...newPagination }
    }

    return [getListData]
}
export default useListData
import { useState } from 'react'
import { useSetState } from 'ahooks'
import _ from 'lodash'
import messageAPI from '@/pages/api/messageAPI'

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

    const transformList = messageList => {
        const toCamelCase = (value, key) => _.camelCase(key)
        const itemToCamelCase = item => _.mapKeys(item, toCamelCase)
        const transformMessageItem = item => {
            const newItem = itemToCamelCase(item)
            const { msgContent } = newItem
            const newMsgContent = msgContent?.map(itemToCamelCase)
            return { ...newItem, msgContent: newMsgContent }
        }
        const transedKeysList = messageList?.map(transformMessageItem)
        return transedKeysList
    }

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
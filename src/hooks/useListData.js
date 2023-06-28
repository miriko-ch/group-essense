import { useState } from 'react'
import { useSetState } from 'ahooks'
import _ from 'lodash'
import messageAPI from '@/pages/api/messageAPI'

const useListData = (props) => {

    const [list, setList] = useState([])
    const [pagination, setPagination] = useSetState({ hasNext: true })
    const [loading, setLoading] = useState(true)

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

    const getListData = async (payload) => {
        setLoading(true)
        const data = await fetchList(payload)

        const { listData: messageList } = data
        const transedKeysList = transformList(messageList)

        const newPagination = _.omit(data, 'listData')
        const newList = _.isEqual(newPagination, pagination) ? list : _.concat(list, transedKeysList)
        setList(newList)
        setPagination(newPagination)

        setLoading(false)
    }

    return [list, loading, pagination, getListData]
}
export default useListData
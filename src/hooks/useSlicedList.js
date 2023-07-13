import _ from 'lodash'
import messageSliceAPI from '@/pages/api/messageSliceAPI'
import useTransformList from './useTransformList'

const useListData = (props) => {

    const fetchList = async (payload) => {
        const res = await fetch(
            messageSliceAPI,
            {
                method: 'post',
                body: JSON.stringify(payload)
            }
        )
        const data = await res.json()
        return data
    }

    const transformList = useTransformList()

    const getListData = async (startIndex, stopIndex) => {

        const data = await fetchList({ startIndex, stopIndex })

        const { listData: messageList } = data
        const transedKeysList = transformList(messageList)

        const newPagination = _.omit(data, 'listData')

        return { list: transedKeysList, ...newPagination }
    }

    return [getListData]
}
export default useListData
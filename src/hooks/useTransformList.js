import _ from 'lodash'

const useTransformList = (props) => {

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
    
    return transformList
}

export default useTransformList
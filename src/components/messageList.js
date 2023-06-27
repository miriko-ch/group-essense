import _ from "lodash"
import { useMount } from "ahooks"
import { useState } from 'react'
import messageAPI from "@/pages/api/messageAPI"
import MessageItem from "./messageItem"
import { List, Skeleton } from "antd"

const list = () => {

    const [list, setList] = useState([])

    const fetchList = async () => {
        const res = await fetch(messageAPI)
        const posts = await res.json()
        return posts
    }
    useMount(async () => {
        const messageList = await fetchList()
        const transedKeysList = messageList?.map(item => {
            const newItem = _.mapKeys(item, (value, key) => _.camelCase(key))
            const { msgContent } = newItem
            const newMsgContent = msgContent?.map(content => _.mapKeys(content, (value, key) => _.camelCase(key)))
            return { ...newItem, msgContent: newMsgContent }
        })
        console.log(transedKeysList);
        setList(transedKeysList)
    })

    return list.map((message, index) => (_.toString(message)))


}
export default list
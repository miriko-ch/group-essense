import { useMount } from "ahooks"
import { useState } from 'react'
import messageAPI from "@/pages/api/messageAPI"
import EssenceMessageCard from './card'

const list = () => {

    const [list, setList] = useState([])

    const fetchList = async () => {
        const res = await fetch(messageAPI)
        const posts = await res.json()
        return posts
    }
    useMount(async () => {
        const messageList = await fetchList()
        console.log(messageList);
        setList(messageList)
    })

    return list.map((message, index) => (
        <EssenceMessageCard key={index} essenceMessage={message} />
    ))


}
export default list
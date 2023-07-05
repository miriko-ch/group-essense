import dayjs from 'dayjs';
import { Card, Avatar, Image } from "antd";
const { Meta } = Card

const labelItem = (props) => {
    const { item: message } = props

    const { senderTime } = message
    const sendAt = `${dayjs(senderTime).format('YYYY年M月D日 HH:mm:ss')}`

    const { addDigestNick, addDigestTime } = message
    const addedBy = `${addDigestNick} 设置于 ${dayjs(addDigestTime).format('YYYY年M月D日 HH:mm:ss')}`

    return <div className='labelItem'>
        <div>{sendAt}</div>
        <div>{addedBy}</div>
    </div>
}

export default labelItem
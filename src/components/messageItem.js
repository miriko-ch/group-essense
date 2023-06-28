import dayjs from 'dayjs';
import { List, Avatar, Image } from "antd";
const { Item } = List
const { Meta } = Item

const MessageItem = (props) => {
    const { item: message } = props

    const { msgContent } = message


    const { senderUin, senderNick, senderTime } = message
    const getAvatarSrc = id => `https://q.qlogo.cn/g?b=qq&nk=${id}&s=100`
    const sender = <Meta
        avatar={<Avatar src={getAvatarSrc(senderUin)} />}
        title={<div className='senderName'>{senderNick}</div>}
        description={dayjs.unix(senderTime).format('YYYY年M月D日 HH:mm')}
    />

    const contentRender = (content, index) => {
        const { msgType } = content
        const { text, imageUrl, imageThumbnailUrl } = content
        const displayContent = {
            1: text,
            3: <Image height='15vh' key={imageUrl} src={imageUrl} placeholder={<Image preview={false} src={imageThumbnailUrl} />} />
        }
        return displayContent[msgType] || ''
    }
    const content = <>{msgContent.map(contentRender)}</>

    const { addDigestNick, addDigestTime } = message
    const addedBy = `${dayjs.unix(addDigestTime).format('YYYY年M月D日 HH:mm')} 由 ${addDigestNick} 设置`
    const itemWrapper = component => <Item className='item' actions={[addedBy]}>{component}</Item>

    return itemWrapper(<>{sender}{content}</>)
}

export default MessageItem
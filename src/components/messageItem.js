import dayjs from 'dayjs';
import { Card, Avatar, Image, Divider } from "antd";
const { Meta } = Card

const MessageItem = (props) => {
    const { item: message } = props

    const { msgContent } = message


    const { senderAvatar, senderNick } = message
    const sender = <Meta
        avatar={<Avatar src={senderAvatar} />}
        description={senderNick}
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
    const content = <>{msgContent?.map(contentRender)}</>

    const itemWrapper = component => <Card className='messageItem'>{component}</Card>

    return itemWrapper(<>{sender}<Divider />{content}<Divider /></>)
}

export default MessageItem
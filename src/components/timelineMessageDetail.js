import dayjs from 'dayjs';
import { Card, Avatar, Divider, Typography } from "antd";
import useRenderContent from '@/hooks/useRenderContent'

const { Meta } = Card
const { Text } = Typography

const MessageItem = (props) => {

    const { item: message } = props

    const { senderAvatar } = message
    const avatar = <Avatar size={'large'} src={senderAvatar} />

    const getRender = useRenderContent()

    const { msgContent, senderNick } = message
    const sender = <Meta avatar={avatar} description={senderNick}></Meta>
    const detailStyle = { height: '50vh', overflowY: 'auto' }
    const content = <div style={detailStyle}>{msgContent?.map(getRender('detail'))}</div>
    const { addDigestNick, addDigestTime } = message
    const addedBy = <Text type="secondary">{`由 ${addDigestNick} 设置于 ${dayjs(addDigestTime).format('YYYY年M月D日 HH:mm:ss')}`}</Text>
    const detail = <Card bordered={false}>{sender}<Divider />{content}{addedBy}</Card>


    return detail
}

export default MessageItem
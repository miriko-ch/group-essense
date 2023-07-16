import dayjs from 'dayjs';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Avatar, Typography } from "antd";
import useRenderContent from '@/hooks/useRenderContent'
const { Paragraph } = Typography

const MessageItem = (props) => {
    const { item: message, style, setModalContent } = props

    const { senderAvatar } = message
    const avatar = <Avatar size={'large'} src={senderAvatar} />

    const getRender = useRenderContent()

    const { msgContent, senderNick, senderTime } = message
    const sendAt = `${dayjs(senderTime).format('YYYY年M月D日 HH:mm:ss')}`
    const previewSender = <Paragraph style={{ color: 'wheat' }} ellipsis={{ rows: 1 }}>{senderNick}</Paragraph>
    const previewProps = {
        onClick: () => setModalContent(message),
        style: { height: 90, color: 'white' },
        ellipsis: { rows: 4 },
    }
    const previewContent = <Paragraph {...previewProps}>{msgContent?.map(getRender('preview'))}</Paragraph>
    const preview = <>{previewSender}{previewContent}</>

    return <VerticalTimelineElement
        className='messageItem'
        contentStyle={{ background: 'grey', marginRight: '10px' }}
        contentArrowStyle={{ borderRight: '7px solid grey' }}
        date={sendAt}
        style={style}
        icon={avatar}>
        {preview}
    </VerticalTimelineElement>
}

export default MessageItem
import dayjs from 'dayjs';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Card, Avatar, Image, Divider, Typography, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons"
import { useState } from 'react';
import useRenderContent from '@/hooks/useRenderContent'
const { Meta } = Card
const { Paragraph, Text } = Typography

const MessageItem = (props) => {
    const [open, setModalOpen] = useState(false)

    const { item: message, style } = props

    const { senderAvatar } = message
    const avatar = <Avatar size={'large'} src={senderAvatar} />


    const getRender = useRenderContent()

    const { msgContent } = message

    const { senderNick } = message
    const { senderTime } = message
    const sendAt = `${dayjs(senderTime).format('YYYY年M月D日 HH:mm:ss')}`

    const previewSender = <Paragraph style={{ color: 'wheat' }} ellipsis={{ rows: 1 }}>{senderNick}</Paragraph>
    const previewProps = {
        onClick: () => setModalOpen(true),
        style: { height: 90, color: 'white' },
        ellipsis: { rows: 4 },
    }
    const previewContent = <Paragraph {...previewProps}>{msgContent?.map(getRender('preview'))}</Paragraph>
    const preview = <>{previewSender}{previewContent}</>

    const sender = <Meta avatar={avatar} description={senderNick}></Meta>
    const detailStyle = { height: '50vh', overflowY: 'auto' }
    const content = <div style={detailStyle}>{msgContent?.map(getRender('detail'))}</div>
    const { addDigestNick, addDigestTime } = message
    const addedBy = <Text type="secondary">{`由 ${addDigestNick} 设置于 ${dayjs(addDigestTime).format('YYYY年M月D日 HH:mm:ss')}`}</Text>
    const detail = <Card bordered={false}>{sender}<Divider />{content}{addedBy}</Card>
    const modalProps = {
        closeIcon: false,
        centered: true,
        onCancel: () => setModalOpen(false),
        destroyOnClose: true,
        footer: [<CloseOutlined key='closeOutlined' onClick={() => setModalOpen(false)} />]
    }
    const modal = <Modal open={open} {...modalProps}>{detail}</Modal>

    const card = <>{modal}{preview}</>

    return <VerticalTimelineElement
        className='messageItem'
        contentStyle={{ background: 'grey', marginRight: '10px' }}
        contentArrowStyle={{ borderRight: '7px solid grey' }}
        date={sendAt}
        style={style}
        icon={avatar}>
        {card}
    </VerticalTimelineElement>
}

export default MessageItem
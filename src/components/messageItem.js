import { Card, Avatar, Image, Divider, Typography, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons"
import { useState } from 'react';
const { Meta } = Card
const { Paragraph } = Typography

const MessageItem = (props) => {
    const [open, setModalOpen] = useState(false)

    const { item: message } = props

    const { senderAvatar } = message
    const avatar = <Avatar src={senderAvatar} />

    const render = type => (content, index) => {
        const { msgType } = content
        const { text, imageUrl, imageThumbnailUrl } = content
        const commonImageProps = {
            key: imageUrl,
            src: imageUrl,
            placeholder: <Image preview={false} src={imageThumbnailUrl} />
        }
        const displayContent = {
            1: text,
            3: <Image preview={type == 'detail'} {...commonImageProps} />
        }
        return displayContent[msgType] || ''
    }
    const getRender = (type) => render(type)

    const { msgContent } = message

    const { senderNick } = message
    const previewSenderNick = <Paragraph ellipsis={{ rows: 1, tooltip: true }}>{senderNick}</Paragraph>
    const previewSender = <Meta avatar={avatar} description={previewSenderNick} />
    const previewProps = {
        onClick: () => setModalOpen(true),
        style: { height: 90 },
        ellipsis: { rows: 4 }
    }
    const previewContent = <Paragraph {...previewProps}>{msgContent?.map(getRender('preview'))}</Paragraph>
    const preview = <>{previewSender}<Divider plain />{previewContent}</>

    const sender = <Meta avatar={avatar} description={senderNick}></Meta>
    const detailStyle = { height: '50vh', overflowY: 'auto' }
    const content = <div style={detailStyle}>{msgContent?.map(getRender('detail'))}</div>
    const detail = <Card bordered={false}>{sender}<Divider />{content}</Card>
    const modalProps = {
        closeIcon: false,
        centered: true,
        onCancel: () => setModalOpen(false),
        footer: [<CloseOutlined key='closeOutlined' onClick={() => setModalOpen(false)} />]
    }
    const modal = <Modal open={open} {...modalProps}>{detail}</Modal>


    return <Card className='messageItem' bodyStyle={{ padding: 16 }}>{modal}{preview}</Card>
}

export default MessageItem
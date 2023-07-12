import { Card, Avatar, Image, Divider, Typography, Modal } from "antd";
import { useState } from 'react';
const { Meta } = Card
const { Paragraph } = Typography

const MessageItem = (props) => {
    const [open, setModalOpen] = useState(false)

    const { item: message } = props

    const { senderAvatar } = message
    const avatar = <Avatar src={senderAvatar} />

    const getRender = (type) => {
        const render = (content, index) => {
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
        return render
    }

    const { msgContent } = message

    const { senderNick } = message
    const previewSenderNick = <Paragraph ellipsis={{ rows: 1, tooltip: true }}>{senderNick}</Paragraph>
    const previewSender = <Meta avatar={avatar} description={previewSenderNick} />
    const previewProps = {
        onClick: () => setModalOpen(true),
        style: { height: 70 },
        ellipsis: { rows: 3 }
    }
    const previewContent = <Paragraph {...previewProps}>{msgContent?.map(getRender('preview'))}</Paragraph>
    const preview = <>{previewSender}<Divider />{previewContent}</>

    const sender = <Meta avatar={avatar} description={senderNick}></Meta>
    const detailStyle = { height: '50vh', overflowY: 'auto' }
    const content = <div style={detailStyle}>{msgContent?.map(getRender('detail'))}</div>
    const detail = <Card bordered={false}>{sender}<Divider />{content}</Card>
    const modal = <Modal centered open={open} onCancel={e => setModalOpen(false)} footer={null} >{detail}</Modal>


    return <Card className='messageItem'>{modal}{preview}</Card>

}

export default MessageItem
import _ from 'lodash'
import { Image } from "antd";
const useRenderContent = (props) => {

    const renderer = type => (content, index) => {
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
    return renderer
}

export default useRenderContent
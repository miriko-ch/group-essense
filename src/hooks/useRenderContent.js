import _ from 'lodash'
import { Image } from "antd";
const useRenderContent = (props) => {

    const renderer = type => (content, index) => {
        const { type, text, imageUrl, imageThumbnailUrl } = content
        const commonImageProps = {
            key: imageUrl,
            src: imageUrl,
            placeholder: <Image preview={false} src={imageThumbnailUrl} />
        }
        const displayContent = {
            'text': text,
            'image': <Image preview={type == 'detail'} {...commonImageProps} />
        }
        return displayContent[type] || ''
    }
    return renderer
}

export default useRenderContent
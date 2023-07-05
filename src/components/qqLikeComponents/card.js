import styles from '@/styles/css/Card.module.css';
import Image from 'next/image';
import dayjs from 'dayjs';
import _ from 'lodash';


const EssenceMessageCard = ({ essenceMessage }) => {

  const message = _.mapKeys(essenceMessage, (value, key) => _.camelCase(key))

  const { senderUin, senderNick, senderTime } = message
  const getAvatarSrc = id => `https://q.qlogo.cn/g?b=qq&nk=${id}&s=100`
  const head = <div className={styles.top}>
    <Image alt=''
      className={styles.avatar}
      src={getAvatarSrc(senderUin)}
      width={32}
      height={32} />
    <div className={styles.senderInfo}>
      <div className={styles.sender}>{senderNick}</div>
      <div className={styles.senderTime}>
        {dayjs(senderTime).format('YYYY年M月D日 HH:mm')}
        发送
      </div>
    </div>
  </div>

  const { msgContent } = message
  const contentRender = (content, index) => {
    const { msg_type: msgType } = content
    const { text, image_url: imageUrl } = content
    const displayContent = {
      1: <div className={styles.textContent}>
        <p className={styles.text}>{text}</p>
      </div>,
      3: <div className={styles.imageContent}>
        <img alt='' className={styles.image} src={imageUrl} />
      </div>
    }
    return <div className={styles.contentItem} key={index}>
      {displayContent[msgType] || ''}
    </div>
  }
  const content = <div className={styles.contents}>{msgContent.map(contentRender)}</div>

  const { addDigestNick, addDigestTime } = message
  const foot = <div className={styles.footer}>
    <p className={styles.digestInfo}>
      <span className={styles.digest}>{dayjs(addDigestTime).format('YYYY年M月D日 HH:mm')} 由 {addDigestNick} 设置</span>
    </p>
  </div>

  return <div className={styles.card}>
    {head}
    {content}
    {foot}
  </div>

};

export default EssenceMessageCard;
import styles from '../styles/Card.module.css'
import Image from 'next/image';
import dayjs from 'dayjs';



const EssenceMessageCard = ({ essenceMessage }) => {
  console.log(essenceMessage);
  const {
    group_code,
    msg_seq,
    msg_random,
    sender_uin,
    sender_nick,
    sender_time,
    add_digest_uin,
    add_digest_nick,
    add_digest_time,
    msg_content,
  } = essenceMessage;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <Image className={styles.avatar} src={`https://q.qlogo.cn/g?b=qq&nk=${sender_uin}&s=100`} width={32} height={32} />
        <div className={styles.senderInfo}>
          <div className={styles.sender}>{sender_nick}</div>
          <div className={styles.senderTime}>{dayjs.unix(sender_time).format('YYYY年M月D日 HH:mm')} 发送</div>
        </div>
      </div>
      <div className={styles.contents}>
        {msg_content.map((content, index) => (
          <div className={styles.contentItem} key={index}>
            {content.msg_type === 1 && (
              <div className={styles.textContent}>
                <p className={styles.text}>{content.text}</p>
              </div>
            )}
            {content.msg_type === 3 && (
              <div className={styles.imageContent}>
                <img src={content.image_url} alt="Image" className={styles.image} />
              </div>
            )}
          </div>
        ))}
        </div>
        <div className={styles.footer}>
          <p className={styles.digestInfo}>
            <span className={styles.digest}>{dayjs.unix(add_digest_time).format('YYYY年M月D日 HH:mm')} 由 {add_digest_nick} 设置</span>
          </p>
        </div>
      </div>
  );
};

export default EssenceMessageCard;
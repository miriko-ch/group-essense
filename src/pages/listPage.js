import MessageList from "@/components/messageList"
import Image from 'next/image'
import { Divider } from 'antd';
const ListPage = () => {

  const title = <div className="title">海离喫茶店群精华合集</div>
  const vercelLogo = <Image
    src="/powered-by-vercel.svg"
    alt="Vercel Logo"
    width={150}
    height={50}
    priority
  />
  const poweredBy = <div className="poweredBy">
    <a href="https://vercel.com/?utm_source=miriko-ch&utm_campaign=oss"
      target="_blank"
      rel="noopener noreferrer">{vercelLogo}</a>
  </div>
  const header = <div className="header">{title}{poweredBy}</div>
  const content = <MessageList />

  return <div className="listPage">
    {header}
    {content}
  </div>
}

export default ListPage
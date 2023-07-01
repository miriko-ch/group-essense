import MesaageList from "@/components/messageList"
import Image from 'next/image'
import { Divider } from 'antd';
const ListPage = () => {

    const title = <div className="title">海离喫茶店群精华合集</div>
    const vercelLogo = <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
    />
    const poweredBy = <div className="poweredBy">
        <div>Powered By</div>
        <div>{vercelLogo}</div>
    </div>
    const header = <div className="header">{title}<Divider type='vertical' />{poweredBy}</div>
    const content = <MesaageList />

    return <div className="listPage">
        {header}
        {content}
    </div>
}

export default ListPage
import MesaageList from "@/components/messageList"
import { Typography } from 'antd';
const { Title } = Typography;

const ListPage = () => {
    return <div className="listPage">
        <Title>海离喫茶店群精华合集</Title>
        <MesaageList />
    </div>
}

export default ListPage
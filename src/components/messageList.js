import _ from "lodash"
import { useInfiniteScroll } from "ahooks"
import useListData from "@/hooks/useListData"
import { Timeline, Spin, Empty, FloatButton } from "antd"
import LabelItem from "./labelItem"
import MessageItem from "./messageItem"
import { useRef } from "react"

const list = () => {

    const [getList] = useListData()

    const ref = useRef(null)
    const { data, loading, loadMore, loadingMore, noMore } = useInfiniteScroll(
        d => getList(d?.nextPage, 10),
        { target: ref, isNoMore: d => d?.hasNext === false }
    )

    const renderLabelItem = item => <LabelItem item={item} key={item.id} />
    const renderMessageItem = (item) => <MessageItem item={item} key={item.id} />
    const renderTimelineItem = item => ({ label: renderLabelItem(item), children: renderMessageItem(item), })

    const list = _.get(data, 'list', [])
    const timeLineItemList = list?.map(renderTimelineItem)

    return <div ref={ref} className='list' >
        <FloatButton.BackTop target={() => ref?.current} />
        <Timeline mode="alternate" items={timeLineItemList} />
        <div className="status">
            {(loading || loadingMore) && <Spin size='large' />}
            {noMore && <Empty description={false} />}
        </div>
    </div>

}
export default list
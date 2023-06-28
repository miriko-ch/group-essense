import _ from "lodash"
import { useMount, useInfiniteScroll } from "ahooks"
import InfiniteScroll from 'react-infinite-scroll-component'
import useListData from "@/hooks/useListData"
import MessageItem from "./messageItem"
import { List, Skeleton, Divider } from "antd"
import { useRef, useState } from "react"

const list = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [listData, , pagination, getList] = useListData()
    const refreshList = () => getList({ currentPage, pageSize })
    useMount(refreshList)

    const { hasNext } = pagination
    const refreshNextPage = () => {
        if (!hasNext) return;
        setCurrentPage(currentPage + 1)
        refreshList()
    }

    const ref = useRef(null)
    const { data, loading, loadMore, loadingMore, noMore } = useInfiniteScroll(
        refreshNextPage,
        { target: ref, isNoMore: !hasNext }
    )

    const infiniteScrollWrapper = listComponent => <InfiniteScroll
        dataLength={_.size(listData)}
        next={refreshNextPage}
        hasMore={hasNext}
        height={'80vh'}
        loader={<Skeleton active avatar><MessageItem /></Skeleton>}
        endMessage={<Divider plain>到底了</Divider>}
        scrollableTarget='list'
    >
        {listComponent}
    </InfiniteScroll>

    const renderItem = (item) => <MessageItem item={item} />

    const messageList = <List
        dataSource={listData}
        itemLayout="vertical"
        bordered
        renderItem={renderItem}
    />
    return <div className="list">{infiniteScrollWrapper(messageList)}</div>

}
export default list
import _ from "lodash"
import { Skeleton } from "antd"
import { useSetState } from "ahooks"
import useSlicedList from "@/hooks/useSlicedList"
import useMonthlyCount from "@/hooks/useMonthlyCount"
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef } from "react"
import MessageItem from "./messageItem"


const list = () => {

    const [getListData] = useSlicedList()
    const [itemMap, setItemsMap] = useSetState({})
    const [countList] = useMonthlyCount()

    const loadMoreItems = _.debounce(async (startIndex, stopIndex) => {
        const { list } = await getListData(startIndex, stopIndex + 1)
        const mapIndexToItem = _.mapKeys(list, (value, key) => (Number(key) + startIndex))
        setItemsMap(mapIndexToItem)
        return { items: list }
    }, 500)

    const isItemLoaded = index => !_.isEmpty(itemMap[index]);

    const renderItem = ({ index, style }) => {
        const item = itemMap[index]
        const card = <MessageItem item={item} style={style} />
        const placeholder = <Skeleton ><MessageItem /> </Skeleton>
        return <div style={style}>
            {item ? card : placeholder}
        </div>
    }

    const infiniteLoaderRef = useRef(null);

    const listRef = useRef(null);
    const renderList = (props) => {
        const { onItemsRendered, ref, height, width } = props
        return <>
            <List
                className='virtualList'
                itemSize={220}
                height={height}
                width={width}
                itemCount={countList?.total || 0}
                onItemsRendered={onItemsRendered}
                ref={listRef}
            >
                {renderItem}
            </List>
        </>
    }
    const autoSizeWrappedList = (props) => <div className="timeJumpList">
        <AutoSizer>
            {(size) => renderList({ ...size, ...props })}
        </AutoSizer>
    </div>


    return <InfiniteLoader
        ref={infiniteLoaderRef}
        isItemLoaded={isItemLoaded}
        itemCount={countList?.total}
        loadMoreItems={loadMoreItems}
    >
        {autoSizeWrappedList}
    </InfiniteLoader>


}
export default list
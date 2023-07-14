import _ from "lodash"
import { Skeleton, Slider } from "antd"
import { useSetState } from "ahooks"
import useSlicedList from "@/hooks/useSlicedList"
import useMonthlyCount from "@/hooks/useMonthlyCount"
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef, useState } from "react"
import MessageItem from "./messageItem"


const list = () => {

    const [getListData] = useSlicedList()
    const [itemMap, setItemsMap] = useSetState({})
    const [countList] = useMonthlyCount()
    const [currentItem, setCurrentItem] = useState(0)

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
        const placeholder = <Skeleton active avatar><MessageItem /> </Skeleton>
        return <div style={style}>
            {item ? card : placeholder}
        </div>
    }

    const infiniteLoaderRef = useRef(null);

    const listRef = useRef(null);
    const jumpTo = (number) => {
        setCurrentItem(number)
        listRef?.current?.scrollToItem(number)
    }
    const renderList = (props) => <List
        {...props}
        itemSize={220}
        itemCount={countList?.total || 0}
        ref={listRef}>
        {renderItem}
    </List>

    const autoSizeWrappedList = (props) => <AutoSizer>
        {(size) => renderList({ ...size, ...props })}
    </AutoSizer>

    const infiniteLoadList = <InfiniteLoader
        ref={infiniteLoaderRef}
        isItemLoaded={isItemLoaded}
        itemCount={countList?.total}
        loadMoreItems={loadMoreItems}
    >
        {autoSizeWrappedList}
    </InfiniteLoader>

    const virtualList = <div className="virtualList">{infiniteLoadList}</div>

    const sliderProps = {
        vertical: true,
        reverse: true,
        marks: countList?.yearlyCountMap,
        min: 0,
        max: countList?.total,
        onChange: jumpTo,
        value: currentItem,
    }
    const formatter = (value) => _(countList?.monthlyIncreaseList).findLast(({ count }) => count <= value)?.month;
    const slider = <div className="slider"><Slider {...sliderProps} tooltip={{ formatter }} /></div>



    return <div className="timeJumpList">
        {virtualList}
        {slider}
    </div>


}
export default list
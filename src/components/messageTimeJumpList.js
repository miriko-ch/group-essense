import _ from "lodash"
import { VerticalTimeline } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Skeleton, Slider } from "antd"
import { useSetState, useDebounceEffect, useDebounce } from "ahooks"
import useSlicedList from "@/hooks/useSlicedList"
import useMonthlyCount from "@/hooks/useMonthlyCount"
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef, useState } from "react"
import TimelineItem from "./timelineItem";


const list = () => {

    const [getListData] = useSlicedList()
    const [sliderVisible, setSliderVisible] = useState(false)
    const [itemMap, setItemsMap] = useSetState({})
    const [countList] = useMonthlyCount()
    const [currentItem, setCurrentItem] = useState(0)
    const [currentLoadRange, setCurrentLoadRange] = useState([])

    const loadMoreItems = _.debounce(async (startIndex, stopIndex) => {
        const range = _.range(startIndex, stopIndex + 1)
        setCurrentLoadRange(range)
        if (!_.includes(range, currentItem)) { setCurrentItem(startIndex) }

        const { list } = await getListData(startIndex, stopIndex + 1)
        const mapIndexToItem = _.mapKeys(list, (value, key) => (Number(key) + startIndex))
        setItemsMap(mapIndexToItem)
        return { items: list }
    }, 500)

    const isItemLoaded = index => !_.isEmpty(itemMap[index])

    const renderItem = ({ index, style }) => {
        const item = itemMap[index]
        const card = <TimelineItem item={item} style={style} />
        const placeholder = <Skeleton style={style} active avatar><TimelineItem /> </Skeleton>
        return item ? card : placeholder

    }

    const infiniteLoaderRef = useRef(null);

    const listRef = useRef(null);
    const jumpTo = () => {
        if (_.includes(currentLoadRange, currentItem)) return
        listRef?.current?.scrollToItem(currentItem)
    }
    useDebounceEffect(jumpTo, [currentItem])

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

    const virtualList = <VerticalTimeline className="virtualList" animate={false}>
        {infiniteLoadList}
    </VerticalTimeline>

    const sliderProps = {
        vertical: true,
        reverse: true,
        marks: countList?.yearlyCountMap,
        min: 0,
        max: countList?.total,
        onChange: setCurrentItem,
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
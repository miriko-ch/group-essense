import _ from "lodash"
import { VerticalTimeline } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Skeleton, Slider, FloatButton, Drawer, Modal } from "antd"
import { FieldTimeOutlined, ArrowRightOutlined, CloseOutlined } from "@ant-design/icons"
import { useSetState, useDebounceEffect } from "ahooks"
import useSlicedList from "@/hooks/useSlicedList"
import useMonthlyCount from "@/hooks/useMonthlyCount"
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef, useState } from "react"
import TimelineItem from "./timelineItem";
import TimelineMessageDetail from "./timelineMessageDetail";


const list = () => {

    const [getListData] = useSlicedList()
    const [sliderVisible, setSliderVisible] = useState(false)
    const [modalContent, setModalContent] = useState(false)
    const modalVisible = !_.isEmpty(modalContent)
    const [itemMap, setItemsMap] = useSetState({})
    const [countList] = useMonthlyCount()
    const [currentItem, setCurrentItem] = useState(0)
    const [currentLoadRange, setCurrentLoadRange] = useState([])

    const loadMoreItems = _.debounce(async (startIndex, stopIndex) => {
        const range = _.range(startIndex, stopIndex + 1)
        setCurrentLoadRange(range)
        if (!_.includes(range, currentItem)) { setCurrentItem(startIndex) }
        const isLoaded = _.every(range, index => itemMap[index])
        if (isLoaded) return

        const { list } = await getListData(startIndex, stopIndex + 1)
        const mapIndexToItem = _.mapKeys(list, (value, key) => (Number(key) + startIndex))
        setItemsMap(mapIndexToItem)
        return { items: list }
    }, 500)

    const isItemLoaded = index => false

    const renderItem = ({ index, style }) => {
        const item = itemMap[index]
        const card = <TimelineItem setModalContent={setModalContent} item={item} style={style} />
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

    const virtualList = <VerticalTimeline className="virtualList" animate={false} layout='1-column-left'>
        {infiniteLoadList}
    </VerticalTimeline>

    const sliderProps = {
        className: 'slider',
        vertical: true,
        reverse: true,
        marks: countList?.yearlyCountMap,
        min: 0,
        max: countList?.total,
        onChange: setCurrentItem,
        value: currentItem,
    }
    const formatter = (value) => _(countList?.monthlyIncreaseList).findLast(({ count }) => count <= value)?.month;
    const slider = <Slider {...sliderProps} tooltip={{ formatter }} />

    const onOpenDrwer = () => setSliderVisible(true)
    const closeDrawer = () => setSliderVisible(false)
    const drawer = <Drawer
        destroyOnClose={true}
        closeIcon={false}
        width={'15vw'}
        maskStyle={{ background: 'transparent' }}
        bodyStyle={{ overflow: 'hidden', padding: '24px 0px' }}
        open={sliderVisible}
        footer={<ArrowRightOutlined key='closeOutlined' onClick={closeDrawer} />}
        onClose={closeDrawer}>
        {slider}
    </Drawer>

    const modalProps = {
        closeIcon: false,
        centered: true,
        onCancel: () => setModalContent({}),
        destroyOnClose: true,
        footer: [<CloseOutlined key='closeOutlined' onClick={() => setModalContent({})} />]
    }
    const detail = <TimelineMessageDetail item={modalContent} />
    const modal = <Modal open={modalVisible} {...modalProps}>{detail}</Modal>



    return <div className="timeJumpList">
        {virtualList}
        {drawer}
        {modal}
        <FloatButton onClick={onOpenDrwer} icon={<FieldTimeOutlined />} />
    </div>


}
export default list
import { useState } from 'react'
import { useMount } from 'ahooks'
import _ from 'lodash'
import countAPI from '@/pages/api/countAPI'

const useListData = (props) => {

    const [monthlyCount, setMonthlyCountList] = useState([])
    const [yearlyCount, setYearlyCountList] = useState([])
    const [monthlyIncreaseList, setMonthlyIncreaseList] = useState([])
    const [yearlyIncreaseList, setYearlyIncreaseList] = useState([])
    const [monthlyCountMap, setMonthlyCountMap] = useState({})
    const [yearlyCountMap, setYearlyCountMap] = useState({})
    const [total, setTotal] = useState(0)

    const fetchCount = async (payload) => {
        const res = await fetch(
            countAPI,
            {
                method: 'post',
                body: JSON.stringify(payload)
            }
        )
        const data = await res.json()
        return data
    }

    const calcuateCount = list => {
        const monthlyCounts = list
        setMonthlyCountList(monthlyCounts)

        const getYear = ({ month }) => _(month).split('-').first()
        const sumCounts = months => _(months).sumBy('count')
        const yearlyCounts = _(monthlyCounts)
            .groupBy(getYear)
            .mapValues(sumCounts)
            .map((count, year) => ({ count, year }))
            .sortBy('year')
            .reverse()
            .value()
        setYearlyCountList(yearlyCounts)

        const totalCount = sumCounts(monthlyCounts)
        setTotal(totalCount)

        const increaseListReducer = (result, item) => [...result, { ...item, count: (_.last(result)?.count || 0) + item?.count }]
        const backToStartIndex = (originList) => ((item) => ({ ...item, count: item.count - _.first(originList)?.count }))
        const getIncreaseList = (counts) => _(counts).reduce(increaseListReducer, []).map(backToStartIndex(counts))
        const countMapReducer = (result, item) => ({ ...result, [item.count]: (item.month || item.year) })

        const monthlyIncreaseList = getIncreaseList(monthlyCounts)
        setMonthlyIncreaseList(monthlyIncreaseList)
        const yearlyIncreaseList = getIncreaseList(yearlyCounts)
        setYearlyIncreaseList(yearlyIncreaseList)

        const monthlyCountMap = _(monthlyIncreaseList).reduce(countMapReducer, {})
        setMonthlyCountMap(monthlyCountMap)
        const yearMonthCountMap = _(yearlyIncreaseList).reduce(countMapReducer, {})
        setYearlyCountMap(yearMonthCountMap)
    }

    const refreshCount = async (payload) => {
        const data = await fetchCount(payload)
        const list = _.get(data, 'data')
        calcuateCount(list)
    }
    useMount(refreshCount)

    return [{ monthlyCount, yearlyCount, total, monthlyIncreaseList, monthlyCountMap, yearlyIncreaseList, yearlyCountMap }, refreshCount]
}
export default useListData
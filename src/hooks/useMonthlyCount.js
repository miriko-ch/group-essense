import { useState } from 'react'
import { useMount } from 'ahooks'
import _ from 'lodash'
import countAPI from '@/pages/api/countAPI'

const useListData = (props) => {

    const [monthlyCount, setMonthlyCountList] = useState([])
    const [yearlyCount, setYearlyCountList] = useState([])
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
    const refreshCount = async (payload) => {
        const data = await fetchCount(payload)
        const list = _.get(data, 'data')
        setMonthlyCountList(list)
        const getYear = ({ month }) => _(month).split('-').first()
        const sumCounts = months => _(months).sumBy('count')
        const yearlyCounts = _(list)
            .groupBy(getYear)
            .mapValues(sumCounts)
            .map((count, year) => ({ count, year }))
            .sortBy('year')
            .reverse()
            .value()
        setYearlyCountList(yearlyCounts)
        setTotal(sumCounts(list))

    }
    useMount(refreshCount)

    return [{ monthlyCount, yearlyCount, total }, refreshCount]
}
export default useListData
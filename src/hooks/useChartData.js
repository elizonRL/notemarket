import { useState, useEffect } from 'react'

export const useChartData = (products) => {
  const getBarColor = (index) => {
    const chartColors = [
      '#ef4444', // red-500
      '#3b82f6', // blue-500
      '#10b981', // green-500
      '#f59e0b', // yellow-500
      '#8b5cf6', // purple-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
      '#f97316' // orange-500
    ]
    return chartColors[index % chartColors.length]
  }
  const [dataChart, setDataChart] = useState([])
  useEffect(() => {
    if (products.length === 0) {
      setDataChart([])
      return
    }
    const data = products.map((productItem, index) => ({
      label: productItem.name + ' $' + productItem.total,
      value: productItem.percentage,
      color: getBarColor(index)
    }))
    setDataChart(data)
  }, [products])
  return [dataChart]
}

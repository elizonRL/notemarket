import { pieArcLabelClasses, pieArcClasses, pieClasses, PieChart } from '@mui/x-charts/PieChart'
const ChartComponent = ({ dataChart }) => {
  return (
    <>
      <div className='w-full max-w-sm sm:max-w-md lg:max-w-lg'>
        <PieChart
          series={[{
            colors: [],
            data: dataChart,
            arcLabel: (item) => `${item.value.toFixed(1)}%`,
            arcLabelMinAngle: 10,
            cornerRadius: 5,
            arcLabelRadius: '70%',
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
          }]}
          width={320}
          height={320}
          className='w-full h-auto'
          margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 0,
              markerWidth: 12,
              markerHeight: 12
            }
          }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: 16,
              fontWeight: 'bold',
              fill: '#ffffff',
              textShadow: '0 0 3px rgba(0,0,0,0.3)'
            },
            [`.${pieClasses.series}[data-series="outer"] .${pieArcClasses.root}`]: {
              opacity: 0.6
            }
          }}
        />
      </div>
    </>
  )
}

export default ChartComponent

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
export const BarChartComponent = ({ data, dataKey1, dataKey2,height, width, nameKeyX, fill1, fill2, layout, barSize, legendPayload }) => {
  const formattedData = data.map(item => ({
    ...item,
    [nameKeyX]: item[nameKeyX]  
  }));

  return (
    <BarChart
      layout={layout}
      width={width}
      height={height}
      data={formattedData}
      margin={{
        top: 5, right: 20, left: -10, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type='category' dataKey={nameKeyX} angle={-45} fontSize={8} dy={20}/> 
      <YAxis fontSize={12} />
      <Tooltip />
      <Legend wrapperStyle={{ paddingTop: '20px' }} payload={legendPayload || []} />

      <Bar dataKey={dataKey1} fill={fill1}  barSize={barSize}/>
      {dataKey2 && <Bar dataKey={dataKey2} fill={fill2}  barSize={barSize} />}
    </BarChart>
  );
};

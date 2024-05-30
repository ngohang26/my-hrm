import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const LineChartComponent = ({ data, dataKey1, dataKey2, nameKey, stroke1, stroke2, activeDot }) => (
  <LineChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5, right: 10, left: -30, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={nameKey} angle={-45} fontSize={8} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey={dataKey1} stroke={stroke1} activeDot={activeDot} />
    <Line type="monotone" dataKey={dataKey2} stroke={stroke2} activeDot={activeDot} />
  </LineChart>
);
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// export const LineChartComponent = ({ data, dataKey, nameKey, stroke, activeDot }) => (
//   <LineChart
//     width={500}
//     height={300}
//     data={data}
//     margin={{
//       top: 5, right: 30, left: 20, bottom: 5,
//     }}
//   >
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis dataKey={nameKey} angle={-45} fontSize={8} />
//     <YAxis />
//     <Tooltip />
//     <Legend />
//     <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={activeDot} />
//   </LineChart>
// );
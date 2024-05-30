import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const PieChartComponent = ({ data, dataKey, nameKey, colors, cx, cy, paddingAngle, innerRadius, outerRadius, fill }) => (
  <PieChart width={200} height={280} margin={{
    top: 5, bottom: 5,
  }}>
    <Pie
      dataKey={dataKey}
      nameKey={nameKey}
      isAnimationActive={false}
      data={data}
      cx={cx}
      cy={cy}
      paddingAngle={paddingAngle}
      outerRadius={outerRadius}
      innerRadius={innerRadius}
      fill={fill}
    >
      {
        data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
      }
    </Pie>
    <Legend wrapperStyle={{
      fontSize: '10px',

    }} />
    <Tooltip />
  </PieChart>
);

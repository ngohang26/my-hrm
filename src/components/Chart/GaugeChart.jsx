import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export const GaugeChart = ({ value }) => {
  const settings = {
    width: 80,
    height: 80,
    value: value,
  };

  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 20,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#52b202',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    />
  );
};

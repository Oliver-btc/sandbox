'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CumulativeDataPoint } from './mockQRCodeLocations';

interface ProjectionChartProps {
  data: CumulativeDataPoint[];
  today: string;
}

interface CustomTodayLabelProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

interface CustomLabelProps {
  x: number;
  y: number;
  title: string;
  onInfoClick: () => void;
  showTooltip: boolean;
  tooltipText: string;
}

const CustomTodayLabel: React.FC<CustomTodayLabelProps> = ({ x, y, payload }) => {
    const boxWidth = 24;
    const boxHeight = 60;
    const cornerRadius = 4;
  
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Background rounded rectangle */}
        <rect
          x={-boxWidth / 2}
          y={-boxHeight / 2}
          width={boxWidth}
          height={boxHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="rgba(0, 0, 0, 0.7)"
          stroke="orange"
          strokeWidth="2"
        />
        {/* Rotated Text */}
        <text
          transform={`rotate(270) translate(0, 0)`}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          Today
        </text>
      </g>
    );
  };

const CustomLabel: React.FC<CustomLabelProps> = ({ x, y, title, onInfoClick, showTooltip, tooltipText }) => {
  const textRef = useRef<SVGTextElement>(null);
  const [iconX, setIconX] = useState(x + 70);

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setIconX(x + bbox.width / 2 + 15); // 15px gap between text and icon
    }
  }, [x, title]);

  return (
    <g>
      <text
        ref={textRef}
        x={x}
        y={y}
        fill="#FFFFFF"
        fontSize={16}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {title}
      </text>
      <g onClick={onInfoClick} style={{ cursor: 'pointer' }} transform={`translate(${iconX}, ${y})`}>
        <circle cx="0" cy="0" r="8" fill="transparent" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="0" y="0" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
          i
        </text>
      </g>
      {showTooltip && (
        <g>
          <rect x={iconX + 15} y={y - 25} width={200} height={50} fill="rgba(0, 0, 0, 0.7)" rx={5} ry={5} />
          <text x={iconX + 25} y={y} fill="#fff" fontSize={12}>
            <tspan x={iconX + 25} dy="0">{tooltipText.split('\n')[0]}</tspan>
            <tspan x={iconX + 25} dy="1.2em">{tooltipText.split('\n')[1] || ''}</tspan>
          </text>
        </g>
      )}
    </g>
  );
};

const formatXAxisDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, today }) => {
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [showHistoricalTooltip, setShowHistoricalTooltip] = useState(false);
  const [showFutureTooltip, setShowFutureTooltip] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const todayIndex = data.findIndex(item => item.date === today);
  const daysUntilLastClaim = data.length - todayIndex - 1;

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setChartDimensions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const margin = { top: 50, right: 30, left: 20, bottom: 5 };
  const todayPosition = (todayIndex / data.length) * chartDimensions.width;

  return (
    <div ref={chartRef} style={{ position: 'relative', width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxisDate}
          />
          <YAxis />
          <Tooltip labelFormatter={formatXAxisDate} />
          <Legend />
          <defs>
            <linearGradient id="activeColorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${todayIndex / (data.length - 1)}`} stopColor="#F7931A" stopOpacity={0.8} />
              <stop offset={`${todayIndex / (data.length - 1)}`} stopColor="#F7931A" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="claimedColorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset={`${todayIndex / (data.length - 1)}`} stopColor="#00C49F" stopOpacity={0.8} />
              <stop offset={`${todayIndex / (data.length - 1)}`} stopColor="#00C49F" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="Active" stackId="1" stroke="#F7931A" fill="url(#activeColorGradient)" />
          <Area type="monotone" dataKey="Claimed" stackId="1" stroke="#00C49F" fill="url(#claimedColorGradient)" />
          <ReferenceLine 
            x={today} 
            stroke="Orange" 
            strokeWidth={2}
            label={({ viewBox }) => (
              <CustomTodayLabel
                x={viewBox.x}
                y={viewBox.y + viewBox.height / 2}  // Position in the middle of the chart height
                payload={{ value: today }}
              />
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
      <svg 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'auto'
        }}
      >
        <CustomLabel
          x={todayPosition / 2}
          y={margin.top / 2}
          title="Historical Data"
          onInfoClick={() => setShowHistoricalTooltip(!showHistoricalTooltip)}
          showTooltip={showHistoricalTooltip}
          tooltipText="Actual QR code claims\nand activations"
        />
        <CustomLabel
          x={todayPosition + (chartDimensions.width - todayPosition) / 2}
          y={margin.top / 2}
          title="Future Projections"
          onInfoClick={() => setShowFutureTooltip(!showFutureTooltip)}
          showTooltip={showFutureTooltip}
          tooltipText={`Est. ${daysUntilLastClaim} days\nuntil last claim`}
        />
      </svg>
    </div>
  );
};

export default ProjectionChart;
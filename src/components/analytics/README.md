# Analytics Components

A comprehensive collection of responsive, reusable chart and analytics components built with React, Chart.js, and Ant Design.

## Components

### 1. StatCard
Display KPI metrics with trend indicators.

```tsx
<StatCard
  title="Total Revenue"
  value={125000}
  change={12.5}
  trend="up"
  icon={<DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
  bgColor="#f6ffed"
/>
```

**Props:**
- `title`: string - Card title
- `value`: string | number - Main metric value
- `change`: number - Percentage change
- `trend`: 'up' | 'down' - Trend direction
- `icon`: ReactNode - Icon to display
- `bgColor?`: string - Background color for icon container

### 2. LineChartCard
Line chart with multiple datasets.

```tsx
<LineChartCard
  title="Sales Trend"
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  datasets={[
    {
      label: 'Product A',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.1)',
    },
  ]}
  yAxisLabel="Sales ($)"
  xAxisLabel="Month"
/>
```

**Props:**
- `title`: string
- `labels`: string[]
- `datasets`: Array<{ label, data, borderColor, backgroundColor }>
- `yAxisLabel?`: string
- `xAxisLabel?`: string
- `extra?`: ReactNode - Additional elements in header

### 3. AreaChartCard
Area chart with filled regions, supports stacking.

```tsx
<AreaChartCard
  title="Revenue by Product"
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  datasets={[
    {
      label: 'Product A',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.3)',
    },
  ]}
  stacked={true}
/>
```

**Props:**
- Same as LineChartCard, plus:
- `stacked?`: boolean - Enable stacked mode

### 4. BarChartCard
Bar chart with horizontal or vertical orientation.

```tsx
<BarChartCard
  title="Sales by Region"
  labels={['North', 'South', 'East', 'West']}
  data={[950, 1200, 450, 1050]}
  colors={['#1890ff', '#52c41a', '#faad14', '#f5222d']}
  dataLabel="Sales"
  horizontal={true}
/>
```

**Props:**
- `title`: string
- `labels`: string[]
- `data`: number[]
- `colors`: string[]
- `dataLabel?`: string - Label for tooltip
- `horizontal?`: boolean - Horizontal bars

### 5. DoughnutChartCard
Doughnut chart with center text and legend.

```tsx
<DoughnutChartCard
  title="Market Share"
  labels={['Product A', 'Product B', 'Product C']}
  data={[45, 35, 20]}
  colors={['#1890ff', '#52c41a', '#faad14']}
  centerText={{
    line1: 'Total: 1000',
    line2: '+15% vs last month',
  }}
/>
```

**Props:**
- `title`: string
- `labels`: string[]
- `data`: number[]
- `colors`: string[]
- `centerText?`: { line1: string, line2: string }

### 6. GaugeChartCard
Semi-circular gauge chart for progress/percentage display.

```tsx
<GaugeChartCard
  title="System Performance"
  value={85}
  maxValue={100}
  label="Performance Score"
  color="#52c41a" // Optional, auto-colors based on percentage
/>
```

**Props:**
- `title`: string
- `value`: number - Current value
- `maxValue?`: number - Maximum value (default: 100)
- `label?`: string - Label below percentage
- `color?`: string - Custom color (auto-colors if not provided)
- `backgroundColor?`: string - Background color
- `showDatePicker?`: boolean
- `showMoreMenu?`: boolean

**Auto-coloring:**
- 80%+ → Green (#52c41a)
- 60-79% → Yellow (#faad14)
- 40-59% → Orange (#ff7a45)
- <40% → Red (#ff4d4f)

### 7. RadarChartCard
Radar/spider chart for multi-dimensional data.

```tsx
<RadarChartCard
  title="Performance Metrics"
  labels={['Speed', 'Quality', 'Efficiency', 'Innovation', 'Reliability']}
  datasets={[
    {
      label: 'Team A',
      data: [85, 90, 75, 80, 95],
      backgroundColor: 'rgba(24, 144, 255, 0.2)',
      borderColor: '#1890ff',
    },
  ]}
/>
```

**Props:**
- `title`: string
- `labels`: string[]
- `datasets`: Array<{ label, data, backgroundColor, borderColor }>
- `extra?`: ReactNode

### 8. ChartCard
Base wrapper component for custom charts.

```tsx
<ChartCard 
  title="Custom Chart" 
  height="400px"
  showDatePicker={true}
  showMoreMenu={true}
>
  {/* Your custom chart */}
</ChartCard>
```

**Props:**
- `title`: string
- `children`: ReactNode
- `showDatePicker?`: boolean
- `showMoreMenu?`: boolean
- `height?`: string
- `extra?`: ReactNode

## Responsive Design

All components are fully responsive with:
- Flexible layouts that adapt to container width
- Responsive font sizes using clamp()
- Mobile-friendly touch interactions
- Automatic label rotation on small screens
- Optimized legend placement
- Max width constraints for readability

## Customization

### Colors
All components accept color props. Use consistent color palettes:
```tsx
const colors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  purple: '#722ed1',
  cyan: '#13c2c2',
};
```

### Tooltips
All charts include enhanced tooltips with:
- Dark background
- Custom formatting
- Percentage calculations (where applicable)
- Responsive positioning

### Interactions
- Hover effects on all interactive elements
- Smooth transitions
- Click handlers for drill-down
- Touch-optimized for mobile

## Best Practices

1. **Data Loading**: Always show loading states
```tsx
const { data, isLoading } = useQuery(...);
if (isLoading) return <Skeleton />;
return <LineChartCard {...data} />;
```

2. **Error Handling**: Gracefully handle missing data
```tsx
if (!data) return <Empty description="No data available" />;
```

3. **Performance**: Memoize chart data
```tsx
const chartData = useMemo(() => ({
  labels: data.labels,
  datasets: data.datasets,
}), [data]);
```

4. **Accessibility**: Add ARIA labels
```tsx
<div role="img" aria-label="Sales chart showing upward trend">
  <LineChartCard {...props} />
</div>
```

## Examples

See `src/hsmodules/Analytics/AppointmentAnalytics/` for complete implementation examples.

## Dependencies

- react-chartjs-2
- chart.js
- antd
- @ant-design/icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

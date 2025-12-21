# Dashboard Layout System

A modern, consistent, and responsive dashboard layout system for HealthStack Frontend.

## 🎯 Overview

The Dashboard Layout System provides a set of reusable components that make it easy to create beautiful, responsive dashboards with consistent styling across the entire application.

## 📦 Components

### DashboardWrapper

Main wrapper component for all dashboard pages.

```tsx
import { DashboardWrapper } from '@/components/layout';

<DashboardWrapper
  title="Dashboard Title"
  subtitle="Optional subtitle"
  extra={<Button>Action</Button>}
>
  {/* Your content */}
</DashboardWrapper>
```

**Props:**
- `title` (string, optional): Main heading
- `subtitle` (string, optional): Descriptive text below title
- `extra` (ReactNode, optional): Actions/buttons in header
- `className` (string, optional): Additional CSS class

---

### StatCard

Display key metrics and statistics.

```tsx
import { StatCard } from '@/components/layout';
import { UserOutlined } from '@ant-design/icons';

<StatCard
  title="Total Users"
  value={1234}
  icon={<UserOutlined />}
  color="#1890ff"
  trend={{ value: 12, isPositive: true }}
/>
```

**Props:**
- `title` (string): Card title
- `value` (number | string): Main value to display
- `icon` (ReactNode, optional): Icon component
- `color` (string, optional): Primary color (default: #1890ff)
- `loading` (boolean, optional): Show loading state
- `prefix` (ReactNode, optional): Content before value
- `suffix` (ReactNode, optional): Content after value
- `trend` (object, optional): Show trend indicator
  - `value` (number): Percentage change
  - `isPositive` (boolean): Up or down trend

---

### GridLayout

Responsive grid system for organizing content.

```tsx
import { GridLayout, GridCol } from '@/components/layout';
import { Col } from 'antd';

<GridLayout gutter={[16, 16]}>
  <Col {...GridCol.Quarter}>
    <StatCard />
  </Col>
  <Col {...GridCol.Half}>
    <ContentCard />
  </Col>
</GridLayout>
```

**Available Grid Columns:**
- `GridCol.Full` - 100% width
- `GridCol.Half` - 50% width on desktop, 100% on mobile
- `GridCol.Third` - 33% width on desktop
- `GridCol.Quarter` - 25% width on desktop, 50% on tablet
- `GridCol.TwoThirds` - 66% width on desktop
- `GridCol.ThreeQuarters` - 75% width on desktop

---

### Section

Organize content into logical sections with optional title.

```tsx
import { Section } from '@/components/layout';

<Section 
  title="Section Title"
  extra={<Button>Action</Button>}
  spacing="24px"
>
  {/* Content */}
</Section>
```

**Props:**
- `title` (string, optional): Section heading
- `extra` (ReactNode, optional): Actions in section header
- `spacing` (string, optional): Bottom margin (default: 24px)

---

### ContentCard

Card component for wrapping content.

```tsx
import { ContentCard } from '@/components/layout';

<ContentCard title="Card Title">
  {/* Your content */}
</ContentCard>
```

All Ant Design Card props are supported.

---

### EmptyState

Show empty state with optional action.

```tsx
import { EmptyState } from '@/components/layout';
import { FileOutlined, PlusOutlined } from '@ant-design/icons';

<EmptyState
  icon={<FileOutlined />}
  title="No data found"
  description="Get started by adding your first item"
  action={
    <Button type="primary" icon={<PlusOutlined />}>
      Add Item
    </Button>
  }
/>
```

**Props:**
- `icon` (ReactNode, optional): Icon to display
- `title` (string): Empty state title
- `description` (string, optional): Additional text
- `action` (ReactNode, optional): Call-to-action button

---

## 🚀 Quick Start

### Basic Dashboard

```tsx
import React from 'react';
import { 
  DashboardWrapper, 
  StatCard, 
  GridLayout, 
  GridCol,
  Section,
  ContentCard 
} from '@/components/layout';
import { Col } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';

const MyDashboard = () => {
  return (
    <DashboardWrapper title="My Dashboard">
      {/* Stats Row */}
      <GridLayout gutter={[16, 16]}>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Total Users"
            value={1234}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col {...GridCol.Quarter}>
          <StatCard
            title="Revenue"
            value="₦2.5M"
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
      </GridLayout>

      {/* Content Section */}
      <Section title="Details">
        <ContentCard>
          <p>Your content here</p>
        </ContentCard>
      </Section>
    </DashboardWrapper>
  );
};

export default MyDashboard;
```

### Two-Column Layout

```tsx
<DashboardWrapper title="Two Column Layout">
  <GridLayout gutter={[16, 16]}>
    <Col {...GridCol.TwoThirds}>
      <ContentCard title="Main Content">
        {/* Main content (66% width) */}
      </ContentCard>
    </Col>
    <Col {...GridCol.Third}>
      <ContentCard title="Sidebar">
        {/* Sidebar content (33% width) */}
      </ContentCard>
    </Col>
  </GridLayout>
</DashboardWrapper>
```

### With Loading State

```tsx
<GridLayout>
  <Col {...GridCol.Quarter}>
    <StatCard
      title="Loading..."
      value={0}
      icon={<UserOutlined />}
      loading={true}
    />
  </Col>
</GridLayout>
```

---

## 🎨 Styling

All components follow Ant Design's design system and integrate seamlessly with the application theme.

### Custom Styling

```tsx
// Using className
<DashboardWrapper className="custom-dashboard">
  ...
</DashboardWrapper>

// Using styled-components
import styled from 'styled-components';

const CustomWrapper = styled(DashboardWrapper)`
  /* Your custom styles */
`;
```

### Color Palette

Recommended colors for StatCard:
- **Primary Blue**: `#1890ff`
- **Success Green**: `#52c41a`
- **Warning Orange**: `#faad14`
- **Error Red**: `#ff4d4f`
- **Purple**: `#722ed1`
- **Cyan**: `#13c2c2`

---

## 📱 Responsive Behavior

All components are fully responsive:

- **Desktop (≥1200px)**: Full grid layout
- **Tablet (768px-1199px)**: Adjusted columns
- **Mobile (<768px)**: Single column, stacked layout

Custom responsive layouts:

```tsx
<Col xs={24} sm={12} md={8} lg={6}>
  {/* Custom breakpoints */}
</Col>
```

---

## ♿ Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

---

## 📚 Examples

See `DashboardWrapper.example.tsx` for comprehensive usage examples.

See `MigrationGuide.tsx` for converting existing dashboards.

---

## 🔧 Advanced Usage

### Custom Grid Columns

```tsx
<Col xs={24} sm={12} md={8} lg={6} xl={4}>
  <StatCard ... />
</Col>
```

### Multiple Sections

```tsx
<DashboardWrapper title="Complex Dashboard">
  <Section title="Overview" spacing="32px">
    {/* Stats grid */}
  </Section>
  
  <Section title="Analytics" spacing="32px">
    {/* Charts */}
  </Section>
  
  <Section title="Recent Activity">
    {/* Table */}
  </Section>
</DashboardWrapper>
```

### Nested Layouts

```tsx
<GridLayout>
  <Col {...GridCol.Half}>
    <ContentCard>
      <GridLayout gutter={[8, 8]}>
        <Col span={12}>{/* Nested grid */}</Col>
        <Col span={12}>{/* Nested grid */}</Col>
      </GridLayout>
    </ContentCard>
  </Col>
</GridLayout>
```

---

## 🐛 Troubleshooting

### Issue: Components not showing

Make sure to import from the correct path:

```tsx
import { DashboardWrapper } from '@/components/layout';
// OR
import { DashboardWrapper } from '../../components/layout';
```

### Issue: Grid not responsive

Ensure you're using GridCol presets or proper Ant Design Col props:

```tsx
<Col {...GridCol.Quarter}> // ✅ Correct
<Col span={6}> // ❌ Not responsive
```

### Issue: Spacing inconsistent

Use the `spacing` prop on Section components:

```tsx
<Section spacing="32px"> // Custom spacing
<Section> // Default 24px
```

---

## 🤝 Contributing

When adding new dashboard pages:

1. Always use `DashboardWrapper` as the root component
2. Use `StatCard` for metrics
3. Use `GridLayout` and `GridCol` for layouts
4. Use `Section` to organize content
5. Use `ContentCard` for wrapping content
6. Follow the existing patterns in examples

---

## 📝 License

Part of HealthStack Frontend - Internal Use Only

---

## 💡 Tips

1. **Keep it simple**: Start with basic layout, add complexity as needed
2. **Be consistent**: Use the same patterns across similar dashboards
3. **Think mobile-first**: Test on different screen sizes
4. **Use semantic sections**: Group related content together
5. **Leverage empty states**: Guide users when there's no data
6. **Add loading states**: Always handle async data properly
7. **Use meaningful colors**: Colors should convey meaning
8. **Keep titles short**: Be concise in headings and labels

---

For questions or issues, contact the frontend team.

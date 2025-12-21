import { Collapse } from 'antd';
import React from 'react';

interface AccordionProps {
  title?: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode | undefined;
  sx?: any;
  style?: React.CSSProperties;
}

const AccordionBox: React.FC<AccordionProps> = ({
  title,
  defaultExpanded = false,
  children,
  sx,
  style,
}) => {
  const defaultStyle: React.CSSProperties = {
    margin: '10px 0',
    border: '0.6px solid #ebebeb',
    background: '#fafafa',
  };

  const mergedStyle = sx ? sx : { ...defaultStyle, ...style };

  const items = [
    {
      key: '1',
      label: <h5 style={{ margin: 0 }}>{title}</h5>,
      children: children,
    },
  ];

  return (
    <Collapse
      items={items}
      defaultActiveKey={defaultExpanded ? ['1'] : []}
      style={mergedStyle}
      bordered={false}
    />
  );
};

export default AccordionBox;

import React from 'react';
import { Button } from 'antd';
import Spinner from '../spinner';

// interface componentProps {
// 	text?: string;
// 	onClick?: () => void;
// 	variant?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
// 	size?: 'small' | 'middle' | 'large';
// 	color?: string; // For backward compatibility
// 	danger?: boolean;
// 	customStyles?: React.CSSProperties;
// 	sx?: any; // For backward compatibility
// 	style?: React.CSSProperties;
// 	MuiIcon?: React.ReactElement; // For backward compatibility
// 	icon?: React.ReactNode;
// 	children?: React.ReactNode;
// 	disabled?: boolean;
// 	loading?: boolean;
// 	type?: 'button' | 'submit' | 'reset';
// }

const mapVariantToType = (variant) => {
  const variantMap = {
    contained: 'primary',
    outlined: 'default',
    text: 'text',
  };
  return variantMap[variant] || variant || 'primary';
};

const mapColorToDanger = (color) => {
  return color === 'error' || color === 'danger';
};

const mapSize = (size) => {
  if (size === 'small') return 'small';
  if (size === 'medium') return 'middle';
  if (size === 'large') return 'large';
  return 'middle';
};

const GlobalCustomButton = ({
  text,
  onClick,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  customStyles,
  MuiIcon,
  icon,
  disabled = false,
  children,
  sx,
  style,
  type,
  loading = false,
  danger,
  ...props
}) => {
  const buttonType = mapVariantToType(variant);
  const buttonSize = mapSize(size);
  const isDanger = danger || mapColorToDanger(color);
  const buttonIcon = icon || MuiIcon;

  const mergedStyle = {
    textTransform: 'capitalize',
    ...customStyles,
    ...sx,
    ...style,
  };

  if (text) {
    return (
      <Button
        type={buttonType}
        size={buttonSize}
        danger={isDanger}
        htmlType={type}
        onClick={onClick}
        style={mergedStyle}
        disabled={disabled}
        loading={loading}
        icon={buttonIcon}
        {...props}
      >
        {text}
      </Button>
    );
  }

  return (
    <Button
      type={buttonType}
      size={buttonSize}
      danger={isDanger}
      htmlType={type}
      onClick={onClick}
      style={mergedStyle}
      disabled={disabled}
      loading={loading}
      icon={buttonIcon}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </Button>
  );
};

export default GlobalCustomButton;

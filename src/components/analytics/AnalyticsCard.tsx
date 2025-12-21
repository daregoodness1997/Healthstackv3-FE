import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  subtitle?: string;
  icon?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  color = 'primary',
  subtitle,
  icon,
}) => {
  const getColorValue = (colorName: string) => {
    const colors: Record<string, string> = {
      primary: '#1976d2',
      secondary: '#9c27b0',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#ed6c02',
      info: '#0288d1',
    };
    return colors[colorName] || colors.primary;
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: `4px solid ${getColorValue(color)}`,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 1, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                color: getColorValue(color),
                opacity: 0.7,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

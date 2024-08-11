// TooltipInfo.js
import React from 'react';
import { Tooltip, Typography, Box } from '@mui/material';

const RolloverTooltip = ({ content, children }) => {
  return (
    <Tooltip
      title={
        <Box sx={{ maxWidth: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {content.title}
          </Typography>
          <Typography variant="body2">{content.description}</Typography>
        </Box>
      }
      arrow
    >
      {children}
    </Tooltip>
  );
};

export default RolloverTooltip;


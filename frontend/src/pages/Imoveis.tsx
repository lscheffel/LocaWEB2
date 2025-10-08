import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Imoveis: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">Imóveis</Typography>
        <Typography>Gerenciamento de imóveis</Typography>
      </Paper>
    </Box>
  );
};

export default Imoveis;
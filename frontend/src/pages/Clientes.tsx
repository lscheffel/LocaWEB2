import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Clientes: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">Clientes</Typography>
        <Typography>Gerenciamento de clientes</Typography>
      </Paper>
    </Box>
  );
};

export default Clientes;
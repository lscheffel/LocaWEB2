import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Locacoes: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">Locações</Typography>
        <Typography>Gerenciamento de contratos de locação</Typography>
      </Paper>
    </Box>
  );
};

export default Locacoes;
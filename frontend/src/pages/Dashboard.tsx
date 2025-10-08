import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Typography>Visão geral do sistema imobiliário</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
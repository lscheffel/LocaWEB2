import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const LocacoesCharts: React.FC = () => {
  const { locacoes } = useSelector((state: RootState) => state.locacoes);

  // Status distribution
  const statusData = [
    { label: 'Ativa', value: locacoes.filter(l => l.status === 'ativa').length },
    { label: 'Finalizada', value: locacoes.filter(l => l.status === 'finalizada').length },
    { label: 'Cancelada', value: locacoes.filter(l => l.status === 'cancelada').length },
  ];

  // Tipo distribution
  const tipoData = [
    { label: 'Anual', value: locacoes.filter(l => l.tipo === 'anual').length },
    { label: 'Sazonal', value: locacoes.filter(l => l.tipo === 'sazonal').length },
  ];

  // Monthly revenue (simplified - assuming current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = locacoes
    .filter(l => {
      const startDate = new Date(l.data_inicio);
      return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
    })
    .reduce((sum, l) => sum + l.valor_mensal, 0);

  const revenueData = [
    { month: 'Atual', revenue: monthlyRevenue },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Relatórios de Locações
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Status das Locações
            </Typography>
            <PieChart
              series={[
                {
                  data: statusData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Locações
            </Typography>
            <PieChart
              series={[
                {
                  data: tipoData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Receita Mensal
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: revenueData.map(d => d.month) }]}
              series={[{ data: revenueData.map(d => d.revenue) }]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocacoesCharts;
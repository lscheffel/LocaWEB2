import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import LocacoesDataGrid from '../components/locacoes/LocacoesDataGrid';
import LocacaoForm from '../components/locacoes/LocacaoForm';
import LocacoesCalendar from '../components/locacoes/LocacoesCalendar';
import LocacoesCharts from '../components/locacoes/LocacoesCharts';
import { Locacao } from '../store/slices/locacoesSlice';

const Locacoes: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocacao, setEditingLocacao] = useState<Locacao | undefined>();
  const { locacoes } = useSelector((state: RootState) => state.locacoes);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreate = () => {
    setEditingLocacao(undefined);
    setFormOpen(true);
  };

  const handleEdit = (id: number) => {
    const locacao = locacoes.find(l => l.id === id);
    setEditingLocacao(locacao);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingLocacao(undefined);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2
        }}>
          <Typography variant="h4" component="h1">
            Locações
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            fullWidth={{ xs: true, sm: false }}
            aria-label="Criar nova locação"
          >
            Nova Locação
          </Button>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="locacoes tabs">
            <Tab label="Lista" />
            <Tab label="Calendário" />
            <Tab label="Relatórios" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && <LocacoesDataGrid onEdit={handleEdit} />}
            {tabValue === 1 && <LocacoesCalendar />}
            {tabValue === 2 && <LocacoesCharts />}
          </Box>
        </Paper>

        <LocacaoForm
          open={formOpen}
          onClose={handleFormClose}
          locacao={editingLocacao}
        />
      </Box>
    </Container>
  );
};

export default Locacoes;
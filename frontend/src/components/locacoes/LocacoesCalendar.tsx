import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography, Paper, Chip } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

dayjs.extend(isBetween);

const LocacoesCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const { locacoes } = useSelector((state: RootState) => state.locacoes);

  // Get locacoes for the selected date
  const locacoesForDate = locacoes.filter((locacao) => {
    const startDate = dayjs(locacao.data_inicio);
    const endDate = locacao.data_fim ? dayjs(locacao.data_fim) : null;
    const currentDate = selectedDate;

    if (!currentDate) return false;

    if (endDate) {
      return currentDate.isBetween(startDate, endDate, 'day', '[]');
    } else {
      return currentDate.isSame(startDate, 'day') || currentDate.isAfter(startDate, 'day');
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Calendário de Locações
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box>
            <DateCalendar
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Locações para {selectedDate?.format('DD/MM/YYYY')}:
            </Typography>
            {locacoesForDate.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {locacoesForDate.map((locacao) => (
                  <Box key={locacao.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`ID: ${locacao.id}`}
                      size="small"
                      color="primary"
                    />
                    <Typography variant="body2">
                      Cliente {locacao.cliente_id} - Imóvel {locacao.imovel_id}
                    </Typography>
                    <Chip
                      label={locacao.status}
                      size="small"
                      color={locacao.status === 'ativa' ? 'success' : 'default'}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma locação para esta data.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default LocacoesCalendar;
import React, { useEffect } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchLocacoes, deleteLocacao } from '../../store/slices/locacoesSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Chip, Box } from '@mui/material';

interface LocacoesDataGridProps {
  onEdit: (id: number) => void;
}

const LocacoesDataGrid: React.FC<LocacoesDataGridProps> = ({ onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { locacoes, loading } = useSelector((state: RootState) => state.locacoes);

  useEffect(() => {
    dispatch(fetchLocacoes());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta locação?')) {
      dispatch(deleteLocacao(id));
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cliente_id', headerName: 'Cliente ID', width: 100 },
    { field: 'imovel_id', headerName: 'Imóvel ID', width: 100 },
    {
      field: 'data_inicio',
      headerName: 'Data Início',
      width: 120,
    },
    {
      field: 'data_fim',
      headerName: 'Data Fim',
      width: 120,
    },
    {
      field: 'valor_mensal',
      headerName: 'Valor Mensal',
      width: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'ativa' ? 'success' : params.value === 'finalizada' ? 'default' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'anual' ? 'primary' : 'secondary'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEdit(params.id as number)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Excluir"
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
      <DataGrid
        rows={locacoes}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        aria-label="Tabela de locações"
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: '2px solid #1976d2',
          },
        }}
      />
    </Box>
  );
};

export default LocacoesDataGrid;
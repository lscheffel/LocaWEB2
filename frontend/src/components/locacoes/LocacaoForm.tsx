import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createLocacao, updateLocacao } from '../../store/slices/locacoesSlice';
import { Locacao } from '../../store/slices/locacoesSlice';

interface LocacaoFormProps {
  open: boolean;
  onClose: () => void;
  locacao?: Locacao;
}

const validationSchema = Yup.object({
  cliente_id: Yup.number().required('Cliente é obrigatório'),
  imovel_id: Yup.number().required('Imóvel é obrigatório'),
  data_inicio: Yup.date().required('Data de início é obrigatória'),
  data_fim: Yup.date().nullable(),
  valor_mensal: Yup.number().positive('Valor deve ser positivo').required('Valor mensal é obrigatório'),
  status: Yup.string().oneOf(['ativa', 'finalizada', 'cancelada']).required('Status é obrigatório'),
  tipo: Yup.string().oneOf(['anual', 'sazonal']).required('Tipo é obrigatório'),
});

const LocacaoForm: React.FC<LocacaoFormProps> = ({ open, onClose, locacao }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = !!locacao;

  const initialValues = {
    cliente_id: locacao?.cliente_id || '',
    imovel_id: locacao?.imovel_id || '',
    data_inicio: locacao?.data_inicio ? dayjs(locacao.data_inicio) : dayjs(),
    data_fim: locacao?.data_fim ? dayjs(locacao.data_fim) : null,
    valor_mensal: locacao?.valor_mensal || '',
    status: locacao?.status || 'ativa',
    tipo: locacao?.tipo || 'anual',
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      data_inicio: values.data_inicio.format('YYYY-MM-DD'),
      data_fim: values.data_fim ? values.data_fim.format('YYYY-MM-DD') : null,
    };

    if (isEditing && locacao) {
      dispatch(updateLocacao({ id: locacao.id, locacao: formattedValues }));
    } else {
      dispatch(createLocacao(formattedValues));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Locação' : 'Nova Locação'}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form id="locacao-form">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                  <Field
                    as={TextField}
                    name="cliente_id"
                    label="ID do Cliente"
                    type="number"
                    fullWidth
                    error={touched.cliente_id && !!errors.cliente_id}
                    helperText={touched.cliente_id && errors.cliente_id}
                  />

                  <Field
                    as={TextField}
                    name="imovel_id"
                    label="ID do Imóvel"
                    type="number"
                    fullWidth
                    error={touched.imovel_id && !!errors.imovel_id}
                    helperText={touched.imovel_id && errors.imovel_id}
                  />

                  <DatePicker
                    label="Data de Início"
                    value={values.data_inicio}
                    onChange={(value) => setFieldValue('data_inicio', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: touched.data_inicio && !!errors.data_inicio,
                        helperText: touched.data_inicio && errors.data_inicio,
                      },
                    }}
                  />

                  <DatePicker
                    label="Data de Fim (opcional)"
                    value={values.data_fim}
                    onChange={(value) => setFieldValue('data_fim', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: touched.data_fim && !!errors.data_fim,
                        helperText: touched.data_fim && errors.data_fim,
                      },
                    }}
                  />

                  <Field
                    as={TextField}
                    name="valor_mensal"
                    label="Valor Mensal"
                    type="number"
                    fullWidth
                    error={touched.valor_mensal && !!errors.valor_mensal}
                    helperText={touched.valor_mensal && errors.valor_mensal}
                  />

                  <Field
                    as={TextField}
                    name="status"
                    label="Status"
                    select
                    fullWidth
                    error={touched.status && !!errors.status}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="ativa">Ativa</MenuItem>
                    <MenuItem value="finalizada">Finalizada</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </Field>

                  <Field
                    as={TextField}
                    name="tipo"
                    label="Tipo"
                    select
                    fullWidth
                    error={touched.tipo && !!errors.tipo}
                    helperText={touched.tipo && errors.tipo}
                  >
                    <MenuItem value="anual">Anual</MenuItem>
                    <MenuItem value="sazonal">Sazonal</MenuItem>
                  </Field>
                </Box>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          form="locacao-form"
        >
          {isEditing ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocacaoForm;
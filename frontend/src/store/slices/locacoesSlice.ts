import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { locacoesApi } from '../../api/locacoesApi';

export interface Locacao {
  id: number;
  cliente_id: number;
  imovel_id: number;
  data_inicio: string;
  data_fim?: string;
  valor_mensal: number;
  status: string;
  tipo: string;
  created_at: string;
}

interface LocacoesState {
  locacoes: Locacao[];
  loading: boolean;
  error: string | null;
}

const initialState: LocacoesState = {
  locacoes: [],
  loading: false,
  error: null,
};

export const fetchLocacoes = createAsyncThunk(
  'locacoes/fetchLocacoes',
  async () => {
    return await locacoesApi.getAll();
  }
);

export const createLocacao = createAsyncThunk(
  'locacoes/createLocacao',
  async (locacao: Omit<Locacao, 'id' | 'created_at'>) => {
    return await locacoesApi.create(locacao);
  }
);

export const updateLocacao = createAsyncThunk(
  'locacoes/updateLocacao',
  async ({ id, locacao }: { id: number; locacao: Partial<Locacao> }) => {
    return await locacoesApi.update(id, locacao);
  }
);

export const deleteLocacao = createAsyncThunk(
  'locacoes/deleteLocacao',
  async (id: number) => {
    await locacoesApi.delete(id);
    return id;
  }
);

const locacoesSlice = createSlice({
  name: 'locacoes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocacoes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocacoes.fulfilled, (state, action: PayloadAction<Locacao[]>) => {
        state.loading = false;
        state.locacoes = action.payload;
      })
      .addCase(fetchLocacoes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locacoes';
      })
      .addCase(createLocacao.fulfilled, (state, action: PayloadAction<Locacao>) => {
        state.locacoes.push(action.payload);
      })
      .addCase(updateLocacao.fulfilled, (state, action: PayloadAction<Locacao>) => {
        const index = state.locacoes.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.locacoes[index] = action.payload;
        }
      })
      .addCase(deleteLocacao.fulfilled, (state, action: PayloadAction<number>) => {
        state.locacoes = state.locacoes.filter(l => l.id !== action.payload);
      });
  },
});

export default locacoesSlice.reducer;
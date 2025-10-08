import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lightTheme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Locacoes from './pages/Locacoes';
import Clientes from './pages/Clientes';
import Imoveis from './pages/Imoveis';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/locacoes" element={<Locacoes />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/imoveis" element={<Imoveis />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

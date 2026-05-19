import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { MobileShell } from '../components/layout/MobileShell';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LivrosPage } from '../pages/LivrosPage';
import { UsuariosPage } from '../pages/UsuariosPage';
import { EmprestimosPage } from '../pages/EmprestimosPage';
import { MultasPage } from '../pages/MultasPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

       <Route element={<RequireAuth />}>
        <Route path="/" element={<MobileShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="livros" element={<LivrosPage />} />
          <Route path="emprestimos" element={<EmprestimosPage />} />
          <Route path="multas" element={<MultasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
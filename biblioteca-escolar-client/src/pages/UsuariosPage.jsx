import { useEffect, useState } from 'react';
import { UsuarioLista } from '../components/usuarios/UsuarioLista';
import * as usuarioService from '../services/usuarioService';

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await usuarioService.listarUsuarios();
        if (!cancel) setUsuarios(data);
      } catch (e) {
        if (!cancel) setErro(e.response?.data?.erro || e.message);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Equipe</h2>
        <p>Alunos e administradores cadastrados</p>
      </div>
      {erro && (
        <p className="alert alert--error" role="alert">
          {erro}
        </p>
      )}
      <UsuarioLista usuarios={usuarios} />
    </div>
  );
}
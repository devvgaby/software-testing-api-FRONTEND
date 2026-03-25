import { useEffect, useState } from 'react';
import { MultaLista } from '../components/multas/MultaLista';
import { useAuth } from '../context/AuthContext';
import * as multaService from '../services/multaService';

export function MultasPage() {
  const { isAdmin } = useAuth();
  const [multas, setMultas] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    setErro('');
    try {
      const data = await multaService.listarMultas();
      setMultas(data);
    } catch (e) {
      setErro(e.response?.data?.erro || e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handlePago = async (id) => {
    setErro('');
    try {
      await multaService.marcarMultaPaga(id);
      await carregar();
    } catch (e) {
      setErro(e.response?.data?.erro || e.message);
    }
  };

  return (
    <div className="stack">
      <div className="page-intro">
        <h2>Multas</h2>
        <p>Atraso na devolução (valores pela API)</p>
      </div>
      {erro && (
        <p className="alert alert--error" role="alert">
          {erro}
        </p>
      )}
      <MultaLista multas={multas} isAdmin={isAdmin} onMarcarPago={handlePago} />
    </div>
  );
}
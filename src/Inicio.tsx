import { useEffect, useState } from 'react';

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  quantidade: number;
}

function Inicio() {
  const [doces, setDoces] = useState<Doce[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscarDoces = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/doces");
        if (resposta.ok) {
          const dados = await resposta.json();
          setDoces(dados);
        } else {
          const erro = await resposta.json();
          setMensagem(erro.mensagem || "Erro ao buscar doces.");
        }
      } catch (err) {
        setMensagem("Erro na conexão com o backend.");
      }
    };
    buscarDoces();
  }, []);

  return (
    <div className="container-listagem">
      <h2>Doces Cadastrados</h2>
      {mensagem && <p>{mensagem}</p>}
      {doces.map(doce => (
        <div key={doce.id} className="doce-container">
          <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
          <div>💰 R$ {Number(doce.preco).toFixed(2)}</div>
          <div>📦 Quantidade em estoque: {doce.quantidade}</div>
        </div>
      ))}
    </div>
  );
}

export default Inicio;

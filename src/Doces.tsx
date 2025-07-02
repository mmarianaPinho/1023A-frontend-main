import { useEffect, useState } from "react";
import './style.css';

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  emEstoque: number;
}

function Doces() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [preco, setPreco] = useState("");
  const [emEstoque, setEmEstoque] = useState("1");
  const [mensagem, setMensagem] = useState("");
  const [doces, setDoces] = useState<Doce[]>([]);

  useEffect(() => {
    const buscaDoces = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/doces");
        if (resposta.ok) {
          const dados = await resposta.json();
          setDoces(dados);
        } else {
          const erro = await resposta.json();
          setMensagem(erro.mensagem || "Erro ao buscar doces.");
        }
      } catch {
        setMensagem("Erro na conexão com o backend.");
      }
    };
    buscaDoces();
  }, []);

  async function trataCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/doces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          tipo,
          preco: parseFloat(preco),
          emEstoque: parseInt(emEstoque),
        }),
      });

      if (response.ok) {
        const resultado = await response.json();
        setMensagem(resultado.mensagem || "Doce cadastrado com sucesso!");
        setNome("");
        setTipo("");
        setPreco("");
        setEmEstoque("1");

        const docesAtualizados = await fetch("http://localhost:8000/doces");
        const dados = await docesAtualizados.json();
        setDoces(dados);
      } else {
        const erro = await response.json();
        setMensagem(erro.mensagem || "Erro ao cadastrar doce.");
      }
    } catch {
      setMensagem("Erro na comunicação com o backend.");
    }
  }

  return (
    <>
      <header>
        <div className="logo-titulo">
          <img src="SUA_IMAGEM_AQUI" alt="Logo" className="logo" />
          <h1>Cadastro de Doces</h1>
        </div>
        <nav>
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/pedidos">Pedidos</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}
        <div className="container-cadastro">
          <form onSubmit={trataCadastro}>
            <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Tipo (ex: Bolo, Brigadeiro)" value={tipo} onChange={e => setTipo(e.target.value)} required />
            <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
            
            <label>
              Em estoque:
              <select value={emEstoque} onChange={e => setEmEstoque(e.target.value)}>
                <option value="1">Sim</option>
                <option value="0">Não</option>
              </select>
            </label>

            <input type="submit" value="Adicionar Doce" />
          </form>
        </div>

        <div className="container-listagem">
          {doces.map(doce => (
            <div key={doce.id} className="doce-container">
              <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
              <div>💰 R$ {doce.preco.toFixed(2)}</div>
              <div>Em estoque: {doce.emEstoque === 1 ? "✅" : "❌"}</div>
            </div>
          ))}
        </div>
      </main>

      <footer></footer>
    </>
  );
}

export default Doces;

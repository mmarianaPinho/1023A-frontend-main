import { useEffect, useState } from "react";
import './style.css';

interface Cliente {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    cpf: string;
}

function Clientes() {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [cpf, setCpf] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        const buscaClientes = async () => {
            try {
                const resposta = await fetch("http://localhost:8000/clientes");
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setClientes(dados);
                } else {
                    const erro = await resposta.json();
                    setMensagem(erro.mensagem || "Erro ao buscar clientes.");
                }
            } catch {
                setMensagem("Erro na conexão com o backend.");
            }
        };
        buscaClientes();
    }, []);

    async function trataCadastro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    telefone,
                    endereco,
                    cpf,
                }),
            });

            if (response.ok) {
                const resultado = await response.json();
                setMensagem(resultado.mensagem || "Cliente cadastrado com sucesso!");
                // Limpa os campos
                setNome("");
                setTelefone("");
                setEndereco("");
                setCpf("");
                // Atualiza a lista de clientes
                const clientesAtualizados = await fetch("http://localhost:8000/clientes");
                const dados = await clientesAtualizados.json();
                setClientes(dados);
            } else {
                const erro = await response.json();
                setMensagem(erro.mensagem || "Erro ao cadastrar cliente.");
            }
        } catch {
            setMensagem("Erro na comunicação com o backend.");
        }
    }

    return (
        <>
            <header>
                <h1>👤 Cadastro de Clientes</h1>
                <nav>
                    <ul>
                        <li><a href="/">Início</a></li>
                        <li><a href="/clientes">Clientes</a></li>
                        <li><a href="/pedidos">Pedidos</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                {mensagem && (
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                )}

                <div className="container-cadastro">
                    <form onSubmit={trataCadastro}>
                        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
                        <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
                        <input type="text" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} required />
                        <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required />
                        <input type="submit" value="Adicionar Cliente" />
                    </form>
                </div>

                <div className="container-listagem">
                    {clientes.map(cliente => (
                        <div key={cliente.id} className="cliente-container">
                            <div><strong>{cliente.nome}</strong></div>
                            <div>Telefone: {cliente.telefone}</div>
                            <div>Endereço: {cliente.endereco}</div>
                            <div>CPF: {cliente.cpf}</div>
                        </div>
                    ))}
                </div>
            </main>

            <footer></footer>
        </>
    );
}

export default Clientes;
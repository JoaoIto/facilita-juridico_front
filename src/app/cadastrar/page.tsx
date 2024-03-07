"use client"

import { useState } from 'react';
import { ApiUtils } from "@/app/utils/api/apiMethods";
import { tokenService } from "@/app/utils/cookies/tokenStorage";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function CadastroCliente() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [coordenadaX, setCoordenadaX] = useState('');
    const [coordenadaY, setCoordenadaY] = useState('');
    const [mensagem, setMensagem] = useState('');
    const router = useRouter();

    const handleCadastroCliente = async () => {
        try {
            const token = tokenService.get(); // Obtém o token de autenticação
            const endpoint = 'http://localhost:8080/clientes/cadastrar'; // Endpoint para cadastrar um novo cliente

            const novoCliente = {
                nome,
                email,
                telefone,
                coordenada_x: coordenadaX,
                coordenada_y: coordenadaY
            };

            console.log('Cadastrando cliente:', novoCliente);

            const response = await ApiUtils.post(endpoint, novoCliente, token);

            console.log('Resposta do cadastro:', response);

            setMensagem('Cliente cadastrado com sucesso!');
            // Redirecionar para a página inicial após 2 segundos
            setTimeout(() => {
                router.push('/');
            }, 2000);

            // Limpar os campos após o cadastro
            setNome('');
            setEmail('');
            setTelefone('');
            setCoordenadaX('');
            setCoordenadaY('');

        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            setMensagem('Erro ao cadastrar cliente. Por favor, tente novamente.');
        }
    };

    function routerInicial(){
        setTimeout(() => {
            router.push('/');
        }, 2000);
    }

    return (
        <div className={`h-screen w-screen flex flex-col items-center justify-center`}>
            <Button className="right-20 bg-blue-900 m-2" variant="contained" color="primary" onClick={routerInicial}>Voltar</Button>
            <h1 className={`text-center my-2 text-3xl font-medium text-start`}>Cadastro de Cliente</h1>
            <div className={`flex flex-col w-full p-2 items-center justify-center gap-2`}>
                <div className={`flex flex-col`}>
                    <label htmlFor="nome">Nome: </label>
                    <input
                        id={`nome`}
                        className={`p-2 rounded border-4 border-solid border-slate-800`}
                        placeholder={`Nome`}
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>
                <div className={`flex flex-col`}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id={"email"}
                        className={`p-2 rounded border-4 border-solid border-slate-800`}
                        placeholder={`Email`}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={`flex flex-col`}>
                    <label htmlFor="telefone">Telefone: </label>
                    <input
                        id={"telefone"}
                        className={`p-2 rounded border-4 border-solid border-slate-800`}
                        placeholder={`Telefone`}
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                </div>
                <div className={`flex flex-col`}>
                    <label htmlFor="coordenada_x">Coordenada X: </label>
                    <input
                        id={"coordenada_x"}
                        className={`p-2 rounded border-4 border-solid border-slate-800`}
                        placeholder={`Coordenada X`}
                        type="text"
                        value={coordenadaX}
                        onChange={(e) => setCoordenadaX(e.target.value)}
                    />
                </div>
                <div className={`flex flex-col`}>
                    <label htmlFor="coordenada_y">Coordenada Y: </label>
                    <input
                        id={"coordenada_y"}
                        className={`p-2 rounded border-4 border-solid border-slate-800`}
                        placeholder={`Coordenada Y`}
                        type="text"
                        value={coordenadaY}
                        onChange={(e) => setCoordenadaY(e.target.value)}
                    />
                </div>
                <Button className="self-center bg-blue-900 m-2" type="submit" variant="contained" color="primary" onClick={handleCadastroCliente}>
                    Cadastrar Cliente
                </Button>
                {mensagem && <p>{mensagem}</p>}
            </div>
        </div>
    );
}

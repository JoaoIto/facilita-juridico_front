"use client"

import { useEffect, useState } from 'react';
import { ApiUtils } from "@/app/utils/api/apiMethods";
import { tokenService } from "@/app/utils/cookies/tokenStorage";
import Button from "@mui/material/Button";
import * as React from "react";

export default function Home() {
    const [clientes, setClientes] = useState<ICliente[]>([]); // Define o estado para armazenar os clientes
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroTelefone, setFiltroTelefone] = useState('');

    const fetchClientes = async (endpoint: string) => {
        try {
            const token = tokenService.get(); // Obtém o token de autenticação
            console.log('Buscando clientes...');
            const fetchedData = await ApiUtils.get<{ message: string, rows: ICliente[] }>(endpoint, token); // Faz a solicitação para obter clientes
            console.log('Clientes encontrados:', fetchedData);

            if (fetchedData && fetchedData.rows) { // Verifica se fetchedData e fetchedData.clientes são definidos
                setClientes(fetchedData.rows); // Atualiza o estado com os clientes obtidos
            }
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            // Trate o erro conforme necessário
        }
    }

    useEffect(() => {
        fetchClientes('http://localhost:8080/clientes'); // Chama a função para buscar todos os clientes quando o componente é montado
    }, []);

    const handleFetchFiltros = () => {
        const endpoint = 'http://localhost:8080/clientes/filtro'; // Endpoint para obter clientes filtrados

        // Adiciona parâmetros de filtro à URL, se houver valores nos campos de filtro
        if (filtroNome || filtroEmail || filtroTelefone) {
            let query = '?';
            if (filtroNome) query += `nome=${filtroNome}&`;
            if (filtroEmail) query += `email=${filtroEmail}&`;
            if (filtroTelefone) query += `telefone=${filtroTelefone}&`;
            fetchClientes(endpoint + query);
        } else {
            fetchClientes(endpoint);
        }
    };

    const handleLimparFiltros = () => {
        setFiltroNome('');
        setFiltroEmail('');
        setFiltroTelefone('');
        window.location.reload();
    };

    return (
        <div className={`h-screen w-screen flex flex-col items-center justify-center`}>
            <h1 className={`text-center my-2 text-3xl font-medium text-start`}>Gerência de usuários</h1>
            <h2 className={`text-2xl text-white`}>Clientes</h2>
            <div className={`flex flex-col`}>
                <div className={`flex w-full p-2 items-center justify-center gap-2`}>
                    <div className={`flex flex-col`}>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            id={`nome`}
                            className={`p-2 rounded border-4 border-solid border-slate-800`}
                            placeholder={`Filtre pelo nome: `}
                            type="text"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                    <div className={`flex flex-col`}>
                        <label htmlFor="email">Email: </label>
                        <input
                            id={"email"}
                            className={`p-2 rounded border-4 border-solid border-slate-800`}
                            placeholder={`Filtre pelo email: `}
                            type="text"
                            value={filtroEmail}
                            onChange={(e) => setFiltroEmail(e.target.value)}
                        />
                    </div>
                    <div className={`flex flex-col`}>
                        <label htmlFor="telefone">Telefone: </label>
                        <input
                            id={"telefone"}
                            className={`p-2 rounded border-4 border-solid border-slate-800`}
                            placeholder={`Filtre pelo telefone: `}
                            type="text"
                            value={filtroTelefone}
                            onChange={(e) => setFiltroTelefone(e.target.value)}
                        />
                    </div>
                </div>
                <div className={`flex justify-end`}>
                    <Button className="self-end bg-blue-900 m-2" type="submit" variant="contained" color="primary" onClick={handleLimparFiltros}>
                        Limpar filtros
                    </Button>
                    <Button className="self-end bg-blue-900 m-2" type="submit" variant="contained" color="primary" onClick={handleFetchFiltros}>
                        Filtrar
                    </Button>
                </div>
            </div>
            <table className="border-collapse border border-gray-500">
                <thead>
                <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-500 px-4 py-2">ID</th>
                    <th className="border border-gray-500 px-4 py-2">Nome</th>
                    <th className="border border-gray-500 px-4 py-2">Email</th>
                    <th className="border border-gray-500 px-4 py-2">Telefone</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr className="bg-gray-200" key={cliente.id}>
                        <td className="border border-gray-500 px-4 py-2">{cliente.id}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.nome}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.email}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.telefone}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

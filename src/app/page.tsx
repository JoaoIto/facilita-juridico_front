"use client"

import {useEffect, useRef, useState} from 'react';
import {ApiUtils} from "@/app/utils/api/apiMethods";
import {tokenService} from "@/app/utils/cookies/tokenStorage";
import Button from "@mui/material/Button";
import * as React from "react";
import {useRouter} from "next/navigation";
import 'leaflet/dist/leaflet.css';
import Map from "@/app/components/Map/Map";
import {Modal} from "./components/Modal/Modal";
export default function Home() {
    const router = useRouter();
    const [clientes, setClientes] = useState<ICliente[]>([]); // Define o estado para armazenar os clientes
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
    const [filtroTelefone, setFiltroTelefone] = useState('');
    const [filtroCoordenadaX, setFiltroCoordenadaX] = useState('');
    const [filtroCoordenadaY, setFiltroCoordenadaY] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ordemRota, setOrdemRota] = useState<number[]>([]);

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
        let query = '';
        if (filtroNome || filtroEmail || filtroTelefone || filtroCoordenadaX || filtroCoordenadaY) {
            query += '?';
            if (filtroNome) query += `nome=${filtroNome}&`;
            if (filtroEmail) query += `email=${filtroEmail}&`;
            if (filtroTelefone) query += `telefone=${filtroTelefone}&`;
            if (filtroCoordenadaX) query += `coordenada_x=${filtroCoordenadaX}&`;
            if (filtroCoordenadaY) query += `coordenada_y=${filtroCoordenadaY}&`;
            fetchClientes(endpoint + query);
        } else {
            fetchClientes(endpoint);
        }
    };

    const fetchRota = async () => {
        try {
            const token = tokenService.get();
            const fetchedData = await ApiUtils.get<{ message: string, rota: number[] }>('http://localhost:8080/clientes/rota', token);
            console.log(fetchedData);

            if (fetchedData && fetchedData.rota) {
                setOrdemRota(fetchedData.rota); // Armazenar a ordem dos pontos da rota
                setMostrarModal(true); // Mostrar o modal quando a rota for recebida
            }
        } catch (error) {
            console.error('Erro ao calcular rota:', error);
        }
    };

    const handleLimparFiltros = () => {
        setFiltroNome('');
        setFiltroEmail('');
        setFiltroTelefone('');
        setFiltroCoordenadaX('');
        setFiltroCoordenadaY('');
        window.location.reload();
    };

    function routerCadastrar() {
        router.push('/cadastrar');
    }

    return (
        <div className={`h-full w-full flex flex-col items-center justify-center p-2`}>
            <h1 className={`text-center my-2 text-3xl font-medium text-start`}>Gerência de usuários</h1>
            <h2 className={`text-2xl text-white`}>Clientes</h2>
            <div className={`flex flex-col`}>
                <div className={`flex flex-col w-full p-2 items-center justify-center gap-2`}>
                    <div className={`flex gap-2`}>
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
                    <div className={`flex gap-2`}>
                        <div className={`flex flex-col`}>
                            <label htmlFor="coordenada_x">Coordenada X: </label>
                            <input
                                id={"coordenada_x"}
                                className={`p-2 rounded border-4 border-solid border-slate-800`}
                                placeholder={`Filtre pela coordenada X: `}
                                type="text"
                                value={filtroCoordenadaX}
                                onChange={(e) => setFiltroCoordenadaX(e.target.value)}
                            />
                        </div>
                        <div className={`flex flex-col`}>
                            <label htmlFor="coordenada_y">Coordenada Y: </label>
                            <input
                                id={"coordenada_y"}
                                className={`p-2 rounded border-4 border-solid border-slate-800`}
                                placeholder={`Filtre pela coordenada Y: `}
                                type="text"
                                value={filtroCoordenadaY}
                                onChange={(e) => setFiltroCoordenadaY(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className={`flex justify-evenly my-2`}>
                    <Button className="self-start bg-blue-600 m-2" type="submit" variant="contained" color="primary"
                            onClick={routerCadastrar}>
                        Cadastrar
                    </Button>
                    <Button
                        className="self-end bg-blue-900 m-2"
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={fetchRota}
                    >
                        Calcular Rota
                    </Button>
                    <Button className="self-end bg-blue-900 m-2" type="submit" variant="contained" color="primary"
                            onClick={handleLimparFiltros}>
                        Limpar filtros
                    </Button>
                    <Button className="self-end bg-blue-900 m-2" type="submit" variant="contained" color="primary"
                            onClick={handleFetchFiltros}>
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
                    <th className="border border-gray-500 px-4 py-2">Coordenada X:</th>
                    <th className="border border-gray-500 px-4 py-2">Coordenada Y:</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map(cliente => (
                    <tr className="bg-gray-200" key={cliente.id}>
                        <td className="border border-gray-500 px-4 py-2">{cliente.id}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.nome}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.email}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.telefone}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.coordenada_x}</td>
                        <td className="border border-gray-500 px-4 py-2">{cliente.coordenada_y}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2 className={`text-center my-2 text-3xl font-medium text-start`}>Rota de clientes</h2>
            <div className={`h-80 w-full border-2 border-slate-700 my-4`}>
                <Map clientes={clientes}/>
            </div>
            <Modal isOpen={mostrarModal} setModalOpen={() => setMostrarModal(!mostrarModal)}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">Ordem da rota:</h2>
                    <ul>
                        <ul>
                            {ordemRota.map((rota, index) => (
                                <li key={index} className="mb-1">
                                    {rota === 0 ? "Empresa -> " : `Cliente: ${rota}`}
                                </li>
                            ))}
                        </ul>

                    </ul>
                </div>
            </Modal>
        </div>
    );

}

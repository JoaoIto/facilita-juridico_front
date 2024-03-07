import { useEffect } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../../../../public/pin-do-mapa.png';

export const Map = ({ clientes }: { clientes: ICliente[] }) => {
    useEffect(() => {
        if (clientes.length === 0) return; // Verifica se há clientes disponíveis

        // Convertendo as coordenadas dos clientes para o formato correto
        const coordenadasClientes: LatLngExpression[] = clientes.map(cliente => [cliente.coordenada_y, cliente.coordenada_x]);

        // Define o ícone personalizado do marcador
        const customIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/5737/5737612.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });
        // Criando o mapa e adicionando os marcadores para cada cliente
        const map = L.map('map').setView([-10.2425, -48.3558], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        coordenadasClientes.forEach((coordenadas, index) => {
            L.marker(coordenadas, { icon: customIcon }).addTo(map)
                .bindPopup(`Cliente ${index + 1}: ${clientes[index].nome}`);
        });

        // Limpar quando o componente é desmontado
        return () => {
            map.remove();
        };
    }, [clientes]);

    return (
        <div className={`flex items-center justify-center h-full`}>
            <div id="map" className={`w-full h-full`}></div>
        </div>
    );
};

export default Map;
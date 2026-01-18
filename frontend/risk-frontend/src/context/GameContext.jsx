import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import axios from 'axios';

const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame debe usarse dentro de un GameProvider");
    return context;
};

export const GameProvider = ({ children }) => {
    const [game, setGame] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [myPlayerId, setMyPlayerId] = useState(localStorage.getItem("myPlayerId"));

    const [placements, setPlacements] = useState({});

    const [attackSelection, setAttackSelection] = useState({ 
        sourceId: null, 
        targetId: null 
    });
    const clearAttackSelection = () => setAttackSelection({ sourceId: null, targetId: null });

    const [loadingSession, setLoadingSession] = useState(false);

    const connectionRef = useRef(null);

    const API_URL = "http://localhost:5282";
    const HUB_URL = "http://localhost:5282/riskhub/";

    useEffect(() => {
        const restoreSession = async () => {
            const savedGameId = localStorage.getItem("currentGameId");
            const savedPlayerId = localStorage.getItem("myPlayerId");

            if (savedGameId && savedPlayerId) {
                console.log("🔄 Intentando recuperar sesión de partida:", savedGameId);
                try {
                    const response = await axios.get(`${API_URL}/game/get/${savedGameId}`);
                    const gameData = response.data;
                    console.log(response.data)

                    if (gameData) {
                        setGame(gameData);
                        setMyPlayerId(savedPlayerId);

                        await connectToSignalR(savedGameId);
                    }
                } catch (error) {
                    console.error("❌ No se pudo recuperar la sesión (quizás la partida terminó):", error);
                    localStorage.removeItem("currentGameId");
                    localStorage.removeItem("myPlayerId");
                }
            }
            setLoadingSession(false);
        };

        restoreSession();
    }, []);

    const connectToSignalR = async (gameId) => {
        if (connectionRef.current) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}?gameId=${gameId}`)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        newConnection.on("ReceiveGame", (updatedGame) => {
            console.log("🔄 Actualización recibida:", updatedGame);
            setGame(updatedGame);
        });

        newConnection.on("HighstormAlert", (updatedGame, msg) => {
            console.log(`⚡ ${msg}`);
            setGame(updatedGame);
        });

        try {
            await newConnection.start();
            console.log("🟢 Conectado a SignalR");
            setIsConnected(true);
            connectionRef.current = newConnection;
        } catch (error) {
            console.error("🔴 Error conexión:", error);
        }
    };

    const connectToGame = async (gameId) => {
        localStorage.setItem("currentGameId", gameId);
        await connectToSignalR(gameId);
    };

    const leaveGame = async () => {
        localStorage.removeItem("currentGameId");
        localStorage.removeItem("myPlayerId");

        if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
        }

        setIsConnected(false);
        setGame(null);
    };

    const mapData = React.useMemo(() => {
        if (!game) return [];

        return game.princedoms.map(princedom => {
            const owner = game.players.find(player => player.id === princedom.playerID);

            const color = owner ? owner.color : "#d3d3d3";
            const ownerName = owner ? owner.name : "Neutral";
            const isMine = owner ? owner.id === myPlayerId : false;

            return {
                ...princedom,
                displayColor: color,
                ownerName: ownerName,
                troopsAdded: 0,
                isMine: isMine
            };
        });

    }, [game, myPlayerId]);

    const neighborList = [
        { "Id": 1, "Name": "Sadeas", "Frontiers": [2, 4] },
        { "Id": 2, "Name": "Aladar", "Frontiers": [1, 3, 4, 5, 6] },
        { "Id": 3, "Name": "Roion", "Frontiers": [2, 6] },
        { "Id": 4, "Name": "Vamah", "Frontiers": [1, 2, 5] },
        { "Id": 5, "Name": "Ruthar", "Frontiers": [2, 4, 6, 7, 8] },
        { "Id": 6, "Name": "Kholinar", "Frontiers": [2, 3, 5, 8, 11, 12] },
        { "Id": 7, "Name": "Hatham", "Frontiers": [5, 8, 9, 10] },
        { "Id": 8, "Name": "Thanadal", "Frontiers": [5, 6, 7, 10] },
        { "Id": 9, "Name": "Bethab", "Frontiers": [7, 10, 11] },
        { "Id": 10, "Name": "Sebarial", "Frontiers": [7, 8, 9, 11] },
        { "Id": 11, "Name": "Crownlands", "Frontiers": [6, 9, 10, 12] },
        { "Id": 12, "Name": "Shattered Plains", "Frontiers": [6, 11] }
    ];

    const isNeighbor = (sourceGuid, targetGuid) => {
        if (!sourceGuid || !targetGuid) return false;

        const sourceTerritory = mapData.find(t => t.id === sourceGuid);
        const targetTerritory = mapData.find(t => t.id === targetGuid);

        if (!sourceTerritory || !targetTerritory) return false;

        const sourceConfig = neighborList.find(c => c.Id === sourceTerritory.blueprintID);

        if (!sourceConfig) {
            console.error("Config not found for blueprintID:", sourceTerritory.blueprintID);
            return false;
        }

        return sourceConfig.Frontiers.includes(targetTerritory.blueprintID);
    };


    const sendPlacements = async () => {
        const placementsList = Object.entries(placements).map(([id, amount]) => ({
            princedomID: id,
            troops: amount
        }));

        try {
            const res = await axios.post(`${API_URL}/game/placeTroops/${myPlayerId}`,
                placementsList
            ).then(
                setPlacements({})
            );
        } catch (error) {
            alert("Error creando partida: " + error.message);
        }
    };


    const isMyTurn = game?.currentPlayerID === myPlayerId;

    const getMyPlayer = () => game?.players.find(p => p.id === myPlayerId);

    const myPlayer = game?.players.find(p => p.id === myPlayerId);

    const myAvailableTroops = myPlayer ? myPlayer.availableTroops : 0;



    const value = {
        game,
        isConnected,
        myPlayerId,
        isMyTurn,
        mapData,
        availableTroops: myAvailableTroops,
        placements,
        neighborList,
        attackSelection,
        isNeighbor,
        setMyPlayerId,
        setPlacements,
        getMyPlayer,
        connectToGame,
        leaveGame,
        setGame,
        sendPlacements,
        setAttackSelection,
        clearAttackSelection
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
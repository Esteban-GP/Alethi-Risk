import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";

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
    
    const connectionRef = useRef(null);

    const HUB_URL = "http://localhost:5282/riskhub"; 

    const connectToGame = async (gameId) => {
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

            await newConnection.invoke("GetGame", gameId);
        } catch (error) {
            console.error("🔴 Error conexión:", error);
        }
    };

    const leaveGame = async () => {
        if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
            setIsConnected(false);
            setGame(null);
        }
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
                isMine: isMine
            };
        });

    }, [game, myPlayerId]);


    const isMyTurn = game?.currentPlayerID === myPlayerId;
    
    const getMyPlayer = () => game?.players.find(p => p.id === myPlayerId);


    const value = {
        game,
        isConnected,
        myPlayerId,
        isMyTurn,
        mapData,
        getMyPlayer,
        connectToGame,
        leaveGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
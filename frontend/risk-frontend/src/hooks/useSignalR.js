import { useState, useEffect, useRef }from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalR = (gameId) => {
    const connectionRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [game, setGame] = useState(null);

    const SIGNAL_R_HUB_URL = "http://localhost:5282/riskhub";


    const requestGame = () => {
            connectionRef.current.invoke("RequestGame", gameId)
                .catch(err => {
                    console.error("Error invoking GetGame:", err);
                });
        };


    useEffect(() => {
        if (!gameId) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${SIGNAL_R_HUB_URL}?gameId=${gameId}`, { withCredentials: true })
            //.configureLogging(signalR.LogLevel.None)
            .withAutomaticReconnect()
            .build();

        connectionRef.current = newConnection;


        newConnection.start().then(() => {
            setIsConnected(true);

            console.log("gameId in useSignalR:", gameId);


            newConnection.invoke("GetGame", gameId);
        })

        newConnection.on("ReceiveGame",(game) => {
            setGame(game)
            console.log(game)
        })

        newConnection.on("Error",(error) => {
            console.log(error)
        })

        

    }
    , [gameId]);

    return { isConnected, connectionRef, game, requestGame };
}

export default useSignalR;
import { useEffect } from "react";
import useSignalR from "../hooks/useSignalR"

function Game() {
    const gameId = "42e9814c-122e-4d70-b850-3b902969f324"; // Replace with actual gameId logic
    

    const { isConnected,
        connectionRef,
        game,
        requestGame,
    } = useSignalR(gameId);



    return (
        <>
            <div>Game Component</div>
            {game && (
                <div>
                    <h2>Round: {game.currentRound}</h2>
                    <p>State: {game.gameState}</p>
                    <p>Next Highstorm: {game.nextHighstorm}</p>
                    <p>Player: {id}</p>
                </div>
            )}
        </>
    )
}

export default Game
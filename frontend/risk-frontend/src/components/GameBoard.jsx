import axios from "axios";
import { useGame } from "../context/GameContext";
import PlayerInfo from "./PlayerInfo";
import GameMap from "./GameMap";
import AttackModal from "./AttackModal";

import { GiCrossedSwords, GiCrenulatedShield, GiBattleGear } from "react-icons/gi";
import { ImArrowUp } from "react-icons/im";

function GameBoard() {
    const { game, leaveGame, sendPlacements, mapData, attackSelection, sendAttack, finishAttack, troopsMoving, sendMove, finishMoving } = useGame();
    const API_URL = "http://localhost:5282";
    const playerID = localStorage.getItem("myPlayerId")

    const sourceTerritory = mapData.find(t => t.id === attackSelection.sourceId);
    const targetTerritory = mapData.find(t => t.id === attackSelection.targetId);

    const leaveLobby = async () => {
        try {
            console.log(playerID)
            leaveGame()
            await axios.post(`${API_URL}/game/leaveLobby/${playerID}`)
        } catch (error) {
            alert("Error creando partida: " + error.message);
        }
    }

    const handleStart = async () => {
        try {
            await axios.post(`${API_URL}/game/start/${game.id}`)
        } catch (error) {
            alert("Error empezando partida: " + error.message);
        }
    }

    if (!game) return <div>No game loaded</div>;

    return (
        <div className="grid grid-cols-8">
            <div className="col-span-2 flex flex-col">
                {game.players.map((player) => (
                    <div key={player.id}>
                        <PlayerInfo player={player} currentPlayerId={game.currentPlayerID}></PlayerInfo>
                    </div>
                ))}
                {game.gameState == "WAITING" && (
                    <div className="h-full border-8 border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2 bg-radial from-neutral-800 to-neutral-900"></div>
                )
                }
                {game.gameState == "PLACING" && (
                    <div className="h-full border-8 flex flex-col justify-center space-y-10 items-center border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2 bg-radial from-neutral-800 to-neutral-900">
                        <div className="text-white text-2xl font-bold">
                            PLACING
                        </div>
                        <div className="text-white text-xl font-bold normal-case text-center mx-15">
                            Select the Princedoms in which you want to place your troops and the amount of them
                        </div>
                        {playerID == game.currentPlayerID && (
                            <button className="btn-legendary" onClick={() => sendPlacements()}>
                                Place troops
                            </button>
                        )}

                    </div>
                )}
                {game.gameState == "ATTACKING" && (
                    <div className="h-full border-8 flex flex-col justify-center space-y-10 items-center border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2 bg-radial from-neutral-800 to-neutral-900">
                        <div className="text-white text-2xl font-bold">
                            ATTACKING
                        </div>
                        <div className="text-white text-xl font-bold normal-case text-center mx-15">
                            First select the attacking Princedom and then the objective
                        </div>
                        {sourceTerritory && (
                            <div className="text-white transition">
                                <div className="grid grid-cols-[4.5rem_1fr] text-2xl">
                                    <div className="flex justify-center items-center section-wood py-3 w-18">
                                        {sourceTerritory && (<GiCrossedSwords />)}
                                    </div>
                                    <div className="flex justify-center items-center text-center section-wood py-3 px-3">
                                        {sourceTerritory?.name}
                                    </div>
                                    <div className="flex justify-center items-center section-wood py-3 w-18">
                                        {targetTerritory && (<GiCrenulatedShield />)}
                                    </div>
                                    <div className="flex justify-center items-center text-center section-wood py-3 px-3">
                                        {targetTerritory?.name}
                                    </div>
                                </div>
                            </div>)}

                        {playerID == game.currentPlayerID && (
                            <div className="flex flex-col space-y-4">
                                {sourceTerritory ?
                                    (
                                        <button className="btn-legendary transition" onClick={() => sendAttack()}>
                                            ATTACK
                                        </button>
                                    ) : (
                                        <button className="btn-leg-gray ">
                                            ATTACK
                                        </button>
                                    )
                                }
                                <button className="btn-leg-green transition" onClick={() => finishAttack()}>
                                    FINISH ATTACK
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {game.gameState == "MOVING" && (
                    <div className="h-full border-8 flex flex-col justify-center space-y-10 items-center border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2 bg-radial from-neutral-800 to-neutral-900">
                        <div className="text-white text-2xl font-bold">
                            MOVING
                        </div>
                        <div className="text-white text-xl font-bold normal-case text-center mx-15">
                            Select two of your princedoms to move troops between them
                        </div>
                        {sourceTerritory && (
                            <div className="text-white transition">
                                <div className="grid grid-cols-[4.5rem_1fr] text-2xl">
                                    <div className="flex justify-center items-center section-wood py-3 w-18">
                                        {sourceTerritory && (<ImArrowUp className="rotate-180 text-red-400"/>)}
                                    </div>
                                    <div className="flex justify-center items-center text-center section-wood py-3 px-3">
                                        {sourceTerritory?.name}
                                    </div>
                                    <div className="flex justify-center items-center section-wood py-3 w-18">
                                        {targetTerritory && (<ImArrowUp className="text-green-500" />)}
                                    </div>
                                    <div className="flex justify-center items-center text-center section-wood py-3 px-3">
                                        {targetTerritory?.name}
                                    </div>
                                    <div className="flex justify-center items-center section-wood py-3 w-18">
                                        {targetTerritory && (<GiBattleGear />)}
                                    </div>
                                    <div className="flex justify-center items-center text-center section-wood py-3 px-3">
                                        {troopsMoving}
                                    </div>
                                </div>
                            </div>)}

                        {playerID == game.currentPlayerID && (
                            <div className="flex flex-col space-y-4">
                                {sourceTerritory ?
                                    (
                                        <button className="btn-legendary transition" onClick={() => {sendMove()}}>
                                            MOVE
                                        </button>
                                    ) : (
                                        <button className="btn-leg-gray ">
                                            MOVE
                                        </button>
                                    )
                                }
                                <button className="btn-leg-green transition" onClick={() => {finishMoving()}}>
                                    FINISH MOVING
                                </button>
                            </div>
                        )}

                    </div>
                )}
                {game.gameState == "FINISHED" && (
                    <div className="h-full border-8 border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2 bg-radial from-neutral-800 to-neutral-900">

                    </div>
                )}
            </div>
            <div className="col-span-6">
                {game.gameState == "WAITING" &&
                    (
                        <div className="h-full bg-[url('/src/assets/roshar.png')]  bg-center cursor-default overflow-visible">
                            <div className="backdrop-blur-xs min-h-screen flex flex-col items-center justify-center">
                                <div className="text-yellow-400 text-4xl w-140 text-center drop-shadow-xl drop-shadow-black">
                                    The game will begin soon...
                                </div>
                                <div className="flex mt-30 space-x-6">
                                    <button className="btn-legendary " onClick={() => leaveLobby()}>Leave Lobby</button>
                                    {playerID == game.currentPlayerID && (
                                        <div>
                                            {game.players.length > 1 ?
                                                (
                                                    <button className="btn-leg-green" onClick={() => handleStart()}>Start game</button>
                                                ) : (
                                                    <button className="btn-leg-gray disabled">Start game</button>
                                                )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )
                }
                {game.gameState != "WAITING" &&
                    (
                        <div className="min-h-screen">
                            <GameMap></GameMap>
                        </div>
                    )
                }
            </div>
            <AttackModal></AttackModal>
        </div>
    );
}

export default GameBoard;
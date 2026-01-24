import { useGame } from "../context/GameContext";
import { GiCrossedSwords, GiCrenulatedShield, } from "react-icons/gi";
import { IoThunderstormSharp } from "react-icons/io5";


function ActionModal() {
    const { game, leaveGame, sendPlacements, mapData, attackSelection, sendAttack, finishAttack, troopsMoving, sendMove, finishMoving, leaveCurrentGame } = useGame();
    const playerID = localStorage.getItem("myPlayerId")

    const sourceTerritory = mapData.find(t => t.id === attackSelection.sourceId);
    const targetTerritory = mapData.find(t => t.id === attackSelection.targetId);

    return (
        <div>
            <div className="fixed bottom-10 right-10 z-60 items-center flex flex-col">
                {game.gameState == "WAITING" && (
                    <div className="h-full"></div>
                )
                }
                {game.gameState == "PLACING" && (
                    <div className="h-40 flex flex-col justify-end space-y-3 items-center">
                        <div className="text-black text-2xl font-bold bg-white/60 px-4 py-2 rounded-full">
                            PLACING
                        </div>
                        <div className="text-white text-xl font-bold normal-case text-center mx-15">
                        </div>
                        {playerID == game.currentPlayerID && (
                            <button className="btn-legendary" onClick={() => sendPlacements()}>
                                Place troops
                            </button>
                        )}

                    </div>
                )}
                {game.gameState == "ATTACKING" && (
                    <div className="h-80 flex flex-col justify-end space-y-3 items-center">
                        {sourceTerritory && (
                            <div className="text-white transition">
                                <div className="grid grid-cols-[4.5rem_1fr] text-2xl bg-radial from-gray-800 to-gray-950">
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
                        <div className="text-black text-2xl font-bold bg-white/60 px-4 py-2 rounded-full">
                            ATTACKING
                        </div>
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
                    <div className="h-40 flex flex-col justify-end space-y-3 items-center">
                        <div className="text-black text-2xl font-bold bg-white/60 px-4 py-2 rounded-full">
                            MOVING
                        </div>
                        {playerID == game.currentPlayerID && (
                            <div className="flex flex-col space-y-4">
                                <button className="btn-leg-green transition" onClick={() => { finishMoving() }}>
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

                {game.gameState != "WAITING" && game.gameState != "FINISHED" &&
                    (
                        <div className="bg-radial from-gray-900 rounded-full mt-5 w-20 flex items-center justify-center text-center text-white text-2xl p-1">
                            <IoThunderstormSharp className="text-2xl mr-2"/>{game.nextHighstorm}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ActionModal;
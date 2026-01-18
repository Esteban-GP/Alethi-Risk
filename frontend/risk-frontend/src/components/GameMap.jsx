import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { GiPiercingSword } from "react-icons/gi";

function GameMap() {
    const { 
        mapData, 
        myPlayerId, 
        availableTroops, 
        placements, 
        setPlacements, 
        game,
        isNeighbor,
        setAttackSelection,
        attackSelection
    } = useGame();

    const [attackSourceId, setAttackSourceId] = useState(null);
    const [attackObjectiveId, setAttackObjectiveId] = useState(null);


    const troopsUsedInDraft = Object.values(placements).reduce((a, b) => a + b, 0);
    const troopsRemaining = availableTroops - troopsUsedInDraft;

    const deductTroops = (territoryId) => {
        if (!placements[territoryId] || placements[territoryId] <= 0) return;

        setPlacements(prev => {
            const copy = { ...prev };
            copy[territoryId] -= 1;
            if (copy[territoryId] === 0) delete copy[territoryId];
            return copy;
        });
    };

    const addTroops = (territoryId) => {
        if (troopsRemaining <= 0) return;

        setPlacements(prev => ({
            ...prev,
            [territoryId]: (prev[territoryId] || 0) + 1
        }));
    };


    const handleAttackClick = (princedom) => {
        const isMine = princedom.playerID === myPlayerId;
        
        if (!attackSourceId) {
            if (isMine && princedom.troops > 1) {
                setAttackSourceId(princedom.id);
            }
            return;
        }

        if (princedom.id === attackSourceId) {
            setAttackSourceId(null);
            return;
        }

        if (isMine && princedom.troops > 1) {
            setAttackSourceId(princedom.id);
            return; 
        }


        if (!isMine && isNeighbor(attackSourceId, princedom.id)) {
            setAttackSelection({ sourceId: attackSourceId, targetId: princedom.id })

            // AQUI HAY QUE ENVIAR TODO
            console.log(attackSelection)

            setAttackSourceId(null)
            setAttackObjectiveId(null)
        }
    };

    return (
        <div className="min-h-screen p-10 bg-radial from-neutral-800 to-neutral-900 text-white grid grid-cols-4 gap-6 select-none">
            {mapData.map((princedom) => {
                const isMine = princedom.playerID === myPlayerId;
                const isMyTurn = game.currentPlayerID === myPlayerId;
                
                let visualClass = "h-40 w-full rounded-lg transition-all duration-300 relative border-2 border-transparent ";
                let clickHandler = null;

                if (game.gameState === "ATTACKING" && isMyTurn) {
                    
                    if (!attackSourceId) {
                        if (isMine && princedom.troops > 1) {
                            visualClass += "hover:scale-105 hover:border-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]";
                            clickHandler = () => handleAttackClick(princedom);
                        } else {
                            visualClass += "opacity-50 grayscale-[0.5] cursor-default";
                        }
                    } 
                    else {
                        const isSource = princedom.id === attackSourceId;
                        const isTargetable = !isMine && isNeighbor(attackSourceId, princedom.id);

                        if (isSource) {
                            visualClass += "scale-110 border-yellow-400 z-10 shadow-[0_0_20px_rgba(250,204,21,0.8)] cursor-pointer";
                            clickHandler = () => handleAttackClick(princedom);
                        } else if (isTargetable) {
                            visualClass += "animate-pulse border-red-500 scale-105 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.6)]";
                            clickHandler = () => handleAttackClick(princedom);
                        } else {
                            visualClass += "opacity-20 blur-[1px] cursor-default";
                        }
                    }
                }


                return (
                    <div 
                        key={princedom.id} 
                        className={visualClass}
                        style={{ backgroundColor: 
                            game.gameState === "ATTACKING" && attackSourceId && !isMine && !isNeighbor(attackSourceId, princedom.id) 
                            ? '#333' : princedom.displayColor }}
                        onClick={clickHandler}
                    >
                         <div className="backdrop-saturate-50 bg-black/20 size-full flex flex-col p-2">
                            <div className="font-bold text-shadow-sm">{princedom.name}</div>
                            
                            <div className="grow flex items-center justify-center text-4xl font-black drop-shadow-md">
                                {princedom.troops}
                            </div>

                            <div className="text-xs opacity-70">{princedom.blueprintID}</div>


                            {game.gameState === "PLACING" && isMine && isMyTurn && (
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 bg-black/60 p-1 rounded">
                                    <button className="bg-red-500 w-6 rounded" onClick={(e) => { e.stopPropagation(); deductTroops(princedom.id); }}>-</button>
                                    <span>{placements[princedom.id] || 0}</span>
                                    <button className="bg-green-500 w-6 rounded" onClick={(e) => { e.stopPropagation(); addTroops(princedom.id); }}>+</button>
                                </div>
                            )}
                        </div>

                        {game.gameState === "ATTACKING" && princedom.id === attackSourceId && (
                            <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
                                <GiPiercingSword className="rotate-90"/>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default GameMap;
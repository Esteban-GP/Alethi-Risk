import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { GiPiercingSword, GiTowerFlag, GiBattleGear } from "react-icons/gi";
import AmountModal from "./AmountModal";
import { TERRITORY_PATHS } from "../assets/MapData";
import mapBg from "../assets/map.png"

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

    const [openModal, setOpenModal] = useState(false)

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
            setAttackSourceId(null)
        }
    };

    const handleMoveClick = (princedom) => {
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

        if (isMine && isNeighbor(attackSourceId, princedom.id)) {
            setAttackSelection({ sourceId: attackSourceId, targetId: princedom.id })
            setOpenModal(true)
        }
    };

    return (
        <div className=" w-full h-screen flex items-center justify-center select-none overflow-hidden"
            style={{
                backgroundImage: `url(${mapBg})`,
                backgroundSize: "110% 120%",
                backgroundPosition: "-170px"
            }}>
            <div className="size-full backdrop-brightness-75 flex items-center justify-center">
            <svg
                viewBox="0 0 4961 3060"
                className="w-full h-full max-w-7xl drop-shadow-2xl scale-110 -mt-20 ml-30"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {mapData.map((princedom) => {
                    const shapeData = TERRITORY_PATHS[princedom.blueprintID];
                    if (!shapeData) return null;

                    const isMine = princedom.playerID === myPlayerId;
                    const isMyTurn = game.currentPlayerID === myPlayerId;

                    let fill = princedom.displayColor;
                    let stroke = "#222";
                    let strokeWidth = 6;
                    let opacity = 1;
                    let filter = "saturate(0.8) contrast(0.8)";
                    let cursor = "pointer";
                    let animation = "";

                    let visualClass = "h-40 w-full rounded-lg transition-all duration-300 relative border-2 border-transparent";
                    let clickHandler = null;

                    if (game.gameState === "ATTACKING" && isMyTurn) {

                        if (!attackSourceId) {
                            if (isMine && princedom.troops > 1) {
                                visualClass += "hover:scale-130 hover:border-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]";
                                clickHandler = () => handleAttackClick(princedom);
                                stroke = "white";
                                strokeWidth = 4;
                            } else {
                                visualClass += "opacity-50 grayscale-[0.5] cursor-default";
                                opacity = 0.5;
                                cursor = "default";
                            }
                        }
                        else {
                            const isSource = princedom.id === attackSourceId;
                            const isTargetable = !isMine && isNeighbor(attackSourceId, princedom.id);

                            if (isSource) {
                                visualClass += "scale-130 border-yellow-400 z-10 shadow-[0_0_20px_rgba(250,204,21,0.8)] cursor-pointer";
                                clickHandler = () => handleAttackClick(princedom);
                                stroke = "#FACC15";
                                strokeWidth = 6;
                                filter = "url(#glow)";
                            } else if (isTargetable) {
                                visualClass += "animate-pulse border-red-500 scale-105 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.6)]";
                                clickHandler = () => handleAttackClick(princedom);
                                stroke = "#EF4444";
                                strokeWidth = 4;
                                animation = "animate-pulse";
                            } else {
                                visualClass += "opacity-20 blur-[1px] cursor-default";
                                opacity = 0.2;
                                cursor = "not-allowed";
                            }
                        }
                    }

                    if (game.gameState === "MOVING" && isMyTurn) {

                        if (!attackSourceId) {
                            if (isMine && princedom.troops > 1) {
                                visualClass += "hover:scale-130 hover:border-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]";
                                clickHandler = () => handleMoveClick(princedom);
                                stroke = "white";
                                strokeWidth = 4;
                            } else {
                                visualClass += "opacity-50 grayscale-[0.5] cursor-default";
                                opacity = 0.5;
                                cursor = "default";
                            }
                        }
                        else {
                            const isSource = princedom.id === attackSourceId;
                            const isTargetable = isMine && isNeighbor(attackSourceId, princedom.id);

                            if (isSource) {
                                visualClass += "scale-110 border-yellow-400 z-10 shadow-[0_0_20px_rgba(250,204,21,0.8)] cursor-pointer";
                                clickHandler = () => handleMoveClick(princedom);
                                stroke = "#FACC15";
                                strokeWidth = 6;
                                filter = "url(#glow)";
                            } else if (isTargetable) {
                                visualClass += "animate-pulse border-red-500 scale-105 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.6)]";
                                clickHandler = () => handleMoveClick(princedom);
                                stroke = "#EF4444";
                                strokeWidth = 4;
                                animation = "animate-pulse";
                            } else {
                                visualClass += "opacity-20 blur-[1px] cursor-default";
                                opacity = 0.2;
                                cursor = "not-allowed";
                            }
                        }
                    }

                    return (
                        <g
                            key={princedom.id}
                            onClick={clickHandler}
                            style={{ cursor: cursor, transition: "all 0.3s ease" }}
                            className={`${animation} hover:brightness-110`}
                        >
                            <path
                                d={shapeData.path}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                fillOpacity={opacity}
                                filter={filter}
                            />

                            <text
                                x={shapeData.textX}
                                y={shapeData.textY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="pointer-events-none fill-white font-bold drop-shadow-md select-none"
                                style={{ fontSize: "110px", opacity: opacity < 0.4 ? 0.3 : 1 }}
                            >
                                {princedom.troops}
                            </text>


                            <text
                                x={shapeData.textX}
                                y={shapeData.textY + 100}
                                textAnchor="middle"
                                className="pointer-events-none fill-white/80 text-xs select-none"
                                style={{ fontSize: "50px", opacity: opacity < 0.4 ? 0 : 1 }}
                            >
                                {princedom.name}
                            </text>
                            {game.gameState === "PLACING" && isMine && isMyTurn && (
                                <foreignObject
                                    x={shapeData.textX - 180}
                                    y={shapeData.textY - 200}
                                    width="360"
                                    height="95"
                                    className="overflow-visible"
                                >
                                    <div className="flex justify-center items-center space-x-4 bg-white/60 py-3 rounded-full">
                                        <button
                                            className="bg-red-600 hover:bg-red-500 text-white rounded-full w-24 h-24 text-6xl shadow-lg border-4 border-black"
                                            onClick={(e) => { e.stopPropagation(); deductTroops(princedom.id); }}
                                        >
                                            -
                                        </button>
                                        <span className="text-6xl font-black drop-shadow-md w-24 text-center text-black">
                                            {placements[princedom.id] || 0}
                                        </span>
                                        <button
                                            className="bg-green-600 hover:bg-green-500 text-white rounded-full w-24 h-24 text-6xl shadow-lg border-4 border-black"
                                            onClick={(e) => { e.stopPropagation(); addTroops(princedom.id); }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </foreignObject>
                            )}


                            {game.gameState === "ATTACKING" && attackSelection.sourceId === princedom.id && (
                                <text x={shapeData.textX} y={shapeData.textY - 30} fontSize="30" textAnchor="middle">
                                    🗡️
                                </text>
                            )}
                        </g>
                    );
                    /** 
                    return (
                        <div
                            key={princedom.id}
                            className={visualClass}
                            style={{
                                backgroundColor:
                                    game.gameState === "ATTACKING" && attackSourceId && !isMine && !isNeighbor(attackSourceId, princedom.id)
                                        ? '#333' : princedom.displayColor
                            }}
                            onClick={clickHandler}
                        >
                            <div className="backdrop-saturate-50 bg-black/20 size-full flex flex-col p-2">
                                <div className="font-bold text-shadow-sm">{princedom.name}</div>

                                <div className="grow flex items-center justify-center text-4xl font-black drop-shadow-md noto">
                                    <GiBattleGear className="mr-2" /> {princedom.troops}
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
                                    <GiPiercingSword className="rotate-90" />
                                </div>
                            )}
                        </div>
                    );*/
                })}
            </svg>
            </div>
            <AmountModal openModal={openModal} setOpenModal={setOpenModal} princedomID={attackSourceId} setAttackSourceId={setAttackSourceId}></AmountModal>
        </div>
    );
}

export default GameMap;
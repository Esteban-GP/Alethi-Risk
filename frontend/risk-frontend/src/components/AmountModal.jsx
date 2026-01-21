import { useGame } from "../context/GameContext";
import { useEffect } from "react";

function AmountModal({ openModal, setOpenModal, princedomID, setAttackSourceId }) {
    if (!openModal) return null

    const { troopsMoving, setTroopsMoving, mapData, sendMove } = useGame()
    
    const sourceTerritory = mapData.find(t => t.id === princedomID);
    const maxMoveable = (sourceTerritory?.troops || 0) - 1;

    useEffect(() => {
        if (openModal) {
            setTroopsMoving(maxMoveable > 0 ? 1 : 0);
        }
    }, [openModal, sourceTerritory]);

    const handleIncrement = () => {
        if (troopsMoving < maxMoveable) {
            setTroopsMoving(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (troopsMoving > 1) {
            setTroopsMoving(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-radial text-white from-gray-800 to-gray-950 border-4 section-wood p-8 max-w-md w-full text-center shadow-2xl relative flex flex-col items-center space-y-6">
                <div className="text-2xl">Move troops from {sourceTerritory?.name}</div>
                <div className="flex justify-center space-x-6 p-1 rounded text-3xl items-center">
                    <button className="bg-red-500 w-10 h-10 rounded" onClick={handleDecrement} disabled={troopsMoving <= 1}>-</button>
                    <span className="text-6xl">{troopsMoving}</span>
                    <button className="bg-green-500 w-10 h-10 rounded" onClick={handleIncrement} disabled={troopsMoving >= maxMoveable}>+</button>
                </div>

                <button className="btn-legendary w-50 py-1" onClick={() => {setOpenModal(false), setAttackSourceId(null), sendMove()}}>Continue</button>
            </div>
        </div>
    );
}

export default AmountModal;
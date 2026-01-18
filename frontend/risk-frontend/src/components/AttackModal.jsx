import { useGame } from "../context/GameContext";
import { LuDice1, LuDice2, LuDice3, LuDice4, LuDice5, LuDice6 } from "react-icons/lu";
import { GiTowerFlag, GiDragonShield } from "react-icons/gi";


function AttackModal() {
    const { battleReport, clearBattleReport, mapData } = useGame();

    const sourceTerritory = mapData.find(t => t.id === battleReport?.attackingPrincedomId);
    const targetTerritory = mapData.find(t => t.id === battleReport?.defendingPrincedomId);

    const dieIcons = {
        1: LuDice1,
        2: LuDice2,
        3: LuDice3,
        4: LuDice4,
        5: LuDice5,
        6: LuDice6,
    }

    if (!battleReport) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-radial from-gray-800 to-gray-950 border-4 section-wood p-8 max-w-2xl w-full text-center shadow-2xl relative">

                <h2 className="text-3xl font-cinzel text-white mb-6">Attack</h2>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col items-center w-1/3">
                        <div className="text-blue-400 font-bold text-xl mb-2">{sourceTerritory?.name}</div>
                        <div className="flex gap-2">
                            {battleReport.attackerDice?.map((die, i) => {
                                const DieIcon = dieIcons[die];

                                return (
                                    <div key={i} className="w-12 h-12 bg-red-600 text-white font-bold text-2xl flex items-center justify-center rounded border-2 border-red-400 shadow-lg">
                                        {DieIcon && <DieIcon className="text-3xl" />}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-2 text-red-500 font-bold">-{battleReport.attackerLost} Tropas</div>
                    </div>

                    <div className="text-4xl text-gray-500 font-black">VS</div>

                    <div className="flex flex-col items-center w-1/3">
                        <div className="text-green-400 font-bold text-xl mb-2">{targetTerritory?.name}</div>
                        <div className="flex gap-2">
                            {battleReport.defenderDice?.map((die, i) => {
                                const DieIcon = dieIcons[die];

                                return (
                                    <div key={i} className="w-12 h-12 bg-white text-black font-bold text-2xl flex items-center justify-center rounded border-2 border-gray-400 shadow-lg">
                                        {DieIcon && <DieIcon className="text-3xl" />}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-2 text-red-500 font-bold">-{battleReport.defenderLost} Tropas</div>
                    </div>
                </div>

                <div className="text-2xl font-bold mb-6">
                    {battleReport.conquered
                        ? (
                            <div className="text-green-600 flex flex-col items-center"><GiTowerFlag className="text-6xl mb-3"/><div>Territorio conquistado</div></div>
                        )
                        : (
                            <div className="text-red-500 flex flex-col items-center"><GiDragonShield className="text-6xl mb-3"/><div>El territorio se mantiene en pie</div></div>
                        )}
                </div>

                <button
                    onClick={() => clearBattleReport()}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-bold text-lg transition-colors"
                >
                    CONTINUAR
                </button>
            </div>
        </div>
    );
}

export default AttackModal;
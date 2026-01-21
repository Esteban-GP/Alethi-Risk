import { useGame } from "../context/GameContext";
import { PiCaretLeftFill } from "react-icons/pi";
import { GiBattleGear } from "react-icons/gi";

function PlayerInfo({ player, currentPlayerId, marginTop }) {
    const { placements, myPlayerId } = useGame()

    const availableTroops = player.availableTroops - Object.values(placements).reduce((a, b) => a + b, 0);

    return (

        <div
            style={{ top: marginTop }}
            className={
                player.id != currentPlayerId
                    ? `fixed inset-0 z-50 w-100 h-20  left-10 section-wood flex flex-col bg-linear-to-b from-gray-800 to-gray-900 text-white text-xl p-4 space-y-3 top-${marginTop}`
                    : `fixed inset-0 z-50 w-100 h-20 left-10 section flex flex-col bg-linear-to-br from-blue-950 via-blue-900 to-blue-950 text-white text-xl p-4 space-y-3 top-${marginTop}`
            }
        >
            <div className="flex justify-between">
                <div className="text-3xl font-bold flex items-center" style={{ color: player.color }}>
                    {player.name}
                    <div>
                        {
                            player.id == myPlayerId
                                ? (
                                    <div className="flex scale-75">
                                        <PiCaretLeftFill /> You
                                    </div>
                                )
                                : ""
                        }
                    </div>
                </div>
                <div>
                    {player.id != myPlayerId ?
                        (
                            <div className="flex space-x-4 items-center text-3xl">
                                <GiBattleGear /> {player.availableTroops}
                            </div>
                        ) : (
                            <div className="flex space-x-4 items-center text-3xl">
                                <GiBattleGear /> {availableTroops}
                            </div>
                        )}
                </div>
            </div>
        </div>

    )
}

export default PlayerInfo;
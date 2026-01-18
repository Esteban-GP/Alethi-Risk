import { useGame } from "../context/GameContext";
import { PiCaretLeftFill } from "react-icons/pi";

function PlayerInfo({ player, currentPlayerId }) {
    const { placements, myPlayerId } = useGame()

    const availableTroops = player.availableTroops - Object.values(placements).reduce((a, b) => a + b, 0);

    return (

        <div
            className={
                player.id != currentPlayerId
                    ? "section-wood flex flex-col bg-linear-to-b from-gray-800 to-gray-900 text-white text-xl p-4 space-y-3"
                    : "section flex flex-col bg-linear-to-br from-blue-950 via-blue-900 to-blue-950 text-white text-xl p-4 space-y-3"
            }
        >
            <div className="text-3xl font-bold flex items-center">
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
                        <div>
                            Available Troops: {player.availableTroops}
                        </div>
                    ) : (
                        <div>
                            Available Troops: {availableTroops}
                        </div>
                    )}
            </div>
            <div className="flex items-center">
                Color: <div className="ml-3 h-10 w-20 section saturate-50" style={{ backgroundColor: player.color }}>
                </div>
            </div>
        </div>

    )
}

export default PlayerInfo;
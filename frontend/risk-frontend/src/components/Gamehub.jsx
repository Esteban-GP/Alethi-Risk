import { useEffect, useState } from "react";
import axios from "axios";

function GameHub() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5282/game/getWaiting")
      .then((response) => {
        setGames(response.data);
        setLoading(false);
        console.game
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen w-full  bg-[url('/src/assets/roshar.png')] bg-cover cursor-default">
      <div className="backdrop-blur-xs min-h-screen flex flex-col items-center justify-center">
        <div className="text-amber-400 text-3xl w-140 text-center drop-shadow-xl drop-shadow-black">
          WELCOME TO THE STOMRLIGHT ARCHIVE RISK
        </div>
        <button className="btn-legendary my-20">
          Create Game
        </button>
        <div className="text-amber-400 text-2xl w-150 text-center drop-shadow-lg drop-shadow-black mb-10">
          Available Games
        </div>
        <div className="section w-300 h-80 bg-gray-900 grid grid-cols-4 grid-rows-2 gap-4 p-3">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col justify-between text-white cinzel bg-gray-900 
            border-6 p-2 border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2">
              <div className="cinzel font-bold">
                {game.players[0].name}'s Game
              </div>
              <div className="flex flex-row justify-between items-end">
                <div>
                  Players: {game.players.length} / 4
                </div>
                <div className="btn-leg-green p-2 text-md border-3">Join</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameHub;
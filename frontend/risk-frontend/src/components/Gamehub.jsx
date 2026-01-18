import { useEffect, useState } from "react";
import axios from "axios";
import { useGame } from "../context/GameContext";

function GameHub() {
  const { connectToGame, setMyPlayerId } = useGame();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [playerColor, setPlayerColor] = useState("#ff0000");

  const [join, setJoin] = useState(false)
  const [create, setCreate] = useState(false)

  const API_URL = "http://localhost:5282/riskhub"; 

  useEffect(() => {
    refreshGames();
  }, []);

  const handleCreate = async () => {
    if (!playerName) console.log("Pon un nombre, Radiante.");

    try {
      const res = await axios.post(`${API_URL}/game/create`, {
        Name: playerName,
        Color: playerColor
      });

      const { myPlayerId, gameId } = res.data;
      localStorage.setItem("myPlayerId", myPlayerId);

      await connectToGame(gameId);

    } catch (error) {
      alert("Error creando partida: " + error.message);
    }
  };

  const refreshGames = () => {
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
  };

  if (loading) return <p>Cargando...</p>;
  //if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen w-full  bg-[url('/src/assets/roshar.png')] bg-cover cursor-default">
      <div className="backdrop-blur-xs min-h-screen flex flex-col items-center justify-center">
        <div className="text-yellow-400 text-5xl w-140 text-center drop-shadow-xl drop-shadow-black">
          WELCOME TO THE STOMRLIGHT ARCHIVE RISK
        </div>
        {(join == false && create == false) &&
          (
            <div className="flex space-x-6">
              <button className="btn-legendary mt-20 mb-5 w-60" onClick={() => setCreate(true)}>
                Create Game
              </button>
              <button className="btn-legendary mt-20 mb-5 w-60" onClick={() => setJoin(true)}>
                Join Game
              </button>
            </div>
          )
        }
        {(create) &&
          (
            <div className="my-30">
              <button onClick={() => setCreate(false)} className="flex items-center text-white text-lg"><img src="/src/assets/back_arrow.png" alt="" className="w-2 h-4 mr-1" />Back</button>
              <div className="section w-130 h-60 bg-gray-800 px-20 py-10 text-primary text-xl flex flex-col justify-between">
                <div className="flex space-x-4">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" className="border-2 border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)} />
                </div>
                <div className="flex flex-row space-x-4 items-center">
                  <label htmlFor="color">Color: </label>
                  <input type="color" className="w-20 h-10 cursor-pointer" value={playerColor} onChange={e => setPlayerColor(e.target.value)} />
                </div>
                <button className="btn-legendary border-3 text-lg px-3 py-2" onClick={() => handleCreate()}>Create Game</button>
              </div>
            </div>
          )
        }
        {(join) &&
          (
            <div className="my-10">
              <button onClick={() => setJoin(false)} className="flex items-center text-white text-lg"><img src="/src/assets/back_arrow.png" alt="" className="w-2 h-4 mr-1" />Back</button>
              <div className="section w-130 h-40 bg-gray-800 px-20 py-8 text-primary text-xl flex flex-col justify-between">
                <div className="flex space-x-4">
                  <label htmlFor="">Name:</label>
                  <input type="text" id="name" className="border-2 border-t-brown1 border-l-brown1 border-r-brown2 border-b-brown2"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)} />
                </div>
                <div className="flex flex-row space-x-4 items-center">
                  <label htmlFor="color">Color: </label>
                  <input type="color" className="w-20 h-10 cursor-pointer" value={playerColor} onChange={e => setPlayerColor(e.target.value)} />
                </div>
              </div>
            </div>
          )
        }
        {(join) &&
          (
            <div>
              <div className="text-amber-400 text-2xl w-full text-center drop-shadow-lg drop-shadow-black">
                Available Games
              </div>
              <div className="flex flex-row w-300 justify-end">
                <button className="mr-3 mb-2 -mt-2"><img src="src/assets/rotate-ccw.png" alt="" className="" /></button>
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
          )
        }

      </div>
    </div>
  );
}

export default GameHub;
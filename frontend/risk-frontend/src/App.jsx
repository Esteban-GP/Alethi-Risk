import { GameProvider, useGame } from './context/GameContext';
import GameHub from './components/GameHub';
import GameBoard from './components/GameBoard';

const RiskNavigator = () => {
  const { game, loadingSession } = useGame();

  if (loadingSession) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
              <h1>Recuperando conexión con Roshar...</h1>
          </div>
      );
  }

  return game ? <GameBoard /> : <GameHub />;
};

function App() {
  return (
    <GameProvider>
       <RiskNavigator />
    </GameProvider>
  );
}

export default App;
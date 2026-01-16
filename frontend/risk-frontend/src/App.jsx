import { GameProvider, useGame } from './context/GameContext';
import GameHub from './components/GameHub';
import GameBoard from './components/GameBoard';

const RiskNavigator = () => {
  const { game } = useGame();

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
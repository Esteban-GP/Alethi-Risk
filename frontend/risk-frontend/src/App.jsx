import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/Game.jsx'
import GameHub from './components/Gamehub.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/lobby" element={<GameHub />} />
      </Routes>
    </Router>
  )
}

export default App

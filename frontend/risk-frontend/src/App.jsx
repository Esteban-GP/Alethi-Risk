import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/Game.jsx'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App

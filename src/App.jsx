import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/review" element={<ReviewPage />} />
    </Routes>
  )
}
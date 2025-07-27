import React from 'react'
import {useNavigate, Route, BrowserRouter, Routes} from 'react-router-dom'
import Header from "./components/Header"
import LandingPage from './pages/LandingPage'
import Products from './pages/Products'

function App() {

  return (
    <>
      <Header></Header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

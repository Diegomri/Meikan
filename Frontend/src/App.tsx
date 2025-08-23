import {Route, BrowserRouter, Routes} from 'react-router-dom'
import Header from "./components/Header"
import LandingPage from './pages/LandingPage'
import Products from './pages/Products'
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register'
import Login from './pages/Login'
import  Cart  from './pages/Cart'
import Account from './pages/Account';
import Locations from './pages/Locations';
function App() {

  return (
    <>
      <AuthProvider>
      <BrowserRouter>
      <Header />
      <main className="pt-32">
        <Routes>
          
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path='/locations' element={<Locations />} />
        </Routes>
        </main>
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App

import './App.css'
import { Login,Signup,Home,Form} from './pages/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/editForm/:id" element={<Form />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

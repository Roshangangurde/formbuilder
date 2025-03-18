import './App.css'
import { Login,Signup,Home,Form,Forms,Typebot,InviteForm,WorkplaceAccess} from './pages/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/editForm/:id" element={<Form />} />
        <Route path="/invite" element={<InviteForm />} />
        <Route path="/typebot" element={<Typebot />} />
        <Route path="/workplaceaccess" element={<WorkplaceAccess />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

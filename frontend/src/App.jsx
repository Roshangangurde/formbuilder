import './App.css'
import { Login, Register, Forms, FormBuilder,Folder, InviteForm,NoPageFound, Home, ResponsePage,Settings ,ProtectedRoute,PublishForm} from './pages/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext"; 
import {DarkModeProvider} from "./context/DarkModeContext";

function App() {
    return (
        <AuthProvider> 
           <DarkModeProvider>
            <BrowserRouter>
                <Routes>
                   <Route path='/' element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/publish/:formId" element={<PublishForm />} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/forms" element={<Forms />} />
                    <Route path="/folder/" element={<Folder />} />
                    <Route path="/folder/:folderId" element={<Folder />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/formbuilder" element={<FormBuilder />} />
                    <Route path="/formbuilder/:formId" element={<FormBuilder />} />
                    <Route path="/invite" element={<InviteForm />} />
                    <Route path="/invite/:formId" element={<InviteForm />} />
                    <Route path='/response' element={<ResponsePage/>} />
                    <Route path="/response/:formId" element={<ResponsePage />} />
                    </Route>
                    <Route path="/*" element={<NoPageFound />} />

                </Routes>
            </BrowserRouter>
            </DarkModeProvider>
        </AuthProvider>
    )
}

export default App;

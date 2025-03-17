import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Home</h1>
            <button onClick={() => navigate('/signup')} >
                Signup
            </button>
            <button onClick={() => navigate('/login')} >
                Login
            </button>
        </>
    );
}

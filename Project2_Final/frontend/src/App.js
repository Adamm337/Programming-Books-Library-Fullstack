import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/Login';
import Register from './Pages/Register';
import './index.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <h1>📚 My Books</h1>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {user ? (
          <>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Hi, {user.name}</span>
            <button onClick={logout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/about"    element={<About />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*"         element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import './styles/globals.scss'
import './styles/theme.scss'
import Card from './components/Card'
import ThemeToggle from './components/ThemeToggle'
import Users from './components/Users'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import PrivateRoute from './auth/PrivateRoute'
import navStyles from './styles/Nav.module.scss'

export default function App() {
  const items = [
    { title: 'SCSS + Grid', meta: 'Layout adaptable con 4-3-2-1 columnas' },
    { title: 'TypeScript', meta: 'Props tipadas y componentes seguros' },
    { title: 'OpenAPI', meta: 'Tipos generados desde la especificación' },
    { title: 'RxJS', meta: 'Buscador con debounce y cancelación' },
    { title: 'Auth + Session', meta: 'Persistencia con expiración' },
    { title: 'Jenkins CI/CD', meta: 'Deploy automático a Netlify' }
  ]
  return (
    <BrowserRouter>
      <div className="container">
        <header className="grid">
          <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0 }}>SII React Demo</h1>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <nav className={navStyles.nav}>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/profile">Perfil</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="grid">
          <Routes>
            <Route path="/" element={
              <section className="section">
                <div className="cards">
                  {items.map((it, i) => (
                    <Card key={i} title={it.title} meta={it.meta} />
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Users />
                </div>
              </section>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

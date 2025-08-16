import { Link } from 'react-router-dom'
import styles from './Nav.module.scss'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Perfil</Link>
    </nav>
  )
}

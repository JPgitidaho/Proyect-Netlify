import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark'|'light'>(() => (localStorage.getItem('theme') as 'dark'|'light') || 'dark')

  useEffect(() => {
    document.documentElement.classList.remove('dark','light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.15)', background: 'var(--surface)', color: 'var(--text)' }}>
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  )
}

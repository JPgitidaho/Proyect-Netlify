import { NavLink, Link } from "react-router-dom"
import { useState } from "react"

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">JP • Portafolio</Link>

        <button
          className="md:hidden w-9 h-9 grid place-items-center rounded-lg border border-black/10"
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
        >
          <span className={`block w-5 h-[2px] bg-black transition ${open ? "rotate-45 translate-y-[2px]" : ""}`} />
          <span className={`block w-5 h-[2px] bg-black my-[6px] transition ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[2px] bg-black transition ${open ? "-rotate-45 -translate-y-[2px]" : ""}`} />
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <Item to="/">Home</Item>
          <Item to="/projects">Projects</Item>
          <Item to="/About">About</Item>
          <Item to="/Skills">Skills</Item>
        </nav>
      </div>

      <div className={`md:hidden border-t border-black/5 ${open ? "block" : "hidden"}`}>
        <nav className="px-4 py-3 flex flex-col gap-2 bg-white">
          <Item to="/" onClick={() => setOpen(false)}>Home</Item>
          <Item to="/projects" onClick={() => setOpen(false)}>Projects</Item>
          <Item to="/About" onClick={() => setOpen(false)}>About</Item>
          <Item to="/Skills" onClick={() => setOpen(false)}>Skills</Item>
        </nav>
      </div>
    </header>
  )
}

function Item({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  )
}

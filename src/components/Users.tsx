import { useEffect, useRef, useState } from 'react'
import { from, fromEvent } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators'
import { listUsers, createUser } from '../api/users'
import styles from './Users.module.scss'

type User = { id: number; name: string; email: string; isOnline?: boolean }

export default function Users() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [name, setName] = useState('Juanita')
    const [email, setEmail] = useState('juanita@mail.com')
    const [saving, setSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const el = inputRef.current as HTMLInputElement
        const sub = fromEvent<InputEvent>(el, 'input')
            .pipe(
                map(() => el.value.trim()),
                debounceTime(400),
                distinctUntilChanged(),
                startWith(''),
                tap(() => { setLoading(true); setError(null) }),
                switchMap(q =>
                    from(listUsers()).pipe(
                        map(arr => q ? arr.filter(u => u.name.toLowerCase().includes(q.toLowerCase())) : arr),
                        catchError(() => {
                            setError('Error de API')
                            return from([[] as User[]])
                        })
                    )
                )
            )
            .subscribe(arr => { setUsers(arr); setLoading(false) })

        return () => sub.unsubscribe()
    }, [])

    async function onCreate(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            await createUser({ name, email })
            const q = (inputRef.current?.value || '').trim().toLowerCase()
            const arr = await listUsers()
            setUsers(q ? arr.filter(u => u.name.toLowerCase().includes(q)) : arr)
            setName('')
            setEmail('')
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Error creando')
        }
        finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.panel}>
            <h2 className={styles.title}>Usuarios (OpenAPI + TS + RxJS)</h2>

            <div className={styles.searchBar}>
                <input ref={inputRef} className={styles.input} placeholder="Buscar por nombre..." aria-label="Buscar" />
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
            </div>

            <form onSubmit={onCreate} className={styles.form}>
                <input className={styles.input} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
                <input className={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button className={styles.btn} disabled={saving}>{saving ? 'Guardando…' : 'Crear'}</button>
            </form>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <span>Cargando…</span>
                </div>
            )}
            {error && <p style={{ color: 'tomato' }}>Error: {error}</p>}

            <ul className={styles.list}>
                {users.map(u => <li className={styles.item} key={u.id}>{u.name} — {u.email}</li>)}
            </ul>
        </div>
    )
}

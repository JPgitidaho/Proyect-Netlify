import styles from './Card.module.scss'

type CardProps = {
  title: string
  meta: string
  href?: string
}

export default function Card({ title, meta, href }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.meta}>{meta}</div>
      {href && <a className={styles.cta} href={href} target="_blank" rel="noreferrer">Ver más</a>}
    </div>
  )
}

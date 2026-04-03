import React from 'react'
import styles from './Academics.module.css'

const Academics = () => {
  const items = [
    { title: 'Faculties', desc: 'Science, Social Sciences, Arts and more.' },
    { title: 'Departments', desc: 'Multiple departments offering BS, MS, PhD.' },
    { title: 'Programs', desc: 'Undergraduate and graduate programs.' },
  ]

  return (
    <section className={styles.wrap} id="academics">
      <div className={styles.container}>
        <h2>Academics</h2>
        <div className={styles.grid}>
          {items.map((it) => (
            <div key={it.title} className={styles.card}>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Academics
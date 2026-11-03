import './App.css'

function App() {
  return (
    <>
      <header className="site-header">
        <a className="site-name" href="#inicio">
          Cinebusca
        </a>
      </header>

      <main id="inicio">
        <section className="hero">
          <p className="eyebrow">Explora el mundo del cine</p>
          <h1>Encuentra tu próxima película</h1>
          <p className="intro">Busca películas por título y descubre algo nuevo para ver.</p>
        </section>
      </main>

      <footer className="site-footer">
        <p>Cinebusca · Descubre tu próxima película</p>
      </footer>
    </>
  )
}

export default App

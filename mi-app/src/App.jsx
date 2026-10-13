import './App.css'

function App() {
  return (
    <>
      <header className="site-header">
        <a className="site-name" href="#inicio">
          Tokke
        </a>
        <nav aria-label="Navegación principal">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <p className="eyebrow">Una página hecha por mí</p>
          <h1>Tokke</h1>
          <p className="intro">
            Este es mi espacio en internet. Estoy aprendiendo a crear páginas
            web y aquí empieza mi proyecto.
          </p>
          <a className="button" href="#sobre-mi">
            Conoce más
          </a>
        </section>

        <section className="about" id="sobre-mi">
          <h2>Sobre esta página</h2>
          <p>
            Puedes cambiar este texto, los colores y las secciones para hacer
            que la página sea tuya.
          </p>
        </section>
      </main>

      <footer id="contacto">
        <p>Hecho por mí · 2026</p>
      </footer>
    </>
  )
}

export default App

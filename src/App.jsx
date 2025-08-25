import { useEffect, useRef, useState } from "react"
import { jobs } from "./data/jobs"
import { projects } from "./data/projects"
import { posts } from "./data/posts"
import { socials } from "./data/socials"

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const ls = localStorage.getItem("theme")
      if (ls === "dark") return true
      if (ls === "light") return false
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    } catch {
      return true
    }
  })
  const [activeSection, setActiveSection] = useState("intro")
  const sectionsRef = useRef([])
  const animatedOnce = useRef(new Set())
  const [showTop, setShowTop] = useState(false)
  const [progress, setProgress] = useState(0)
  // (removido) Modal de imagen de proyecto
  // Parallax
  const prefersReducedRef = useRef(false)
  const rafId = useRef(null)
  const heroNameRef = useRef(null)
  const heroStatusRef = useRef(null)
  const heroFocusRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light")
    } catch {}
  }, [isDark])

  // Ensure page starts at top on hard refresh (browser may try to restore scroll)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      // If no hash, jump to top on initial mount
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    } catch {}
  }, [])

  useEffect(() => {
    // setup prefers-reduced-motion flag for parallax
    prefersReducedRef.current =
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      (entries) => {
        // Animar solo una vez y escoger la sección con mayor intersección
        const visible = entries.filter(e => e.isIntersecting)
        visible.forEach((entry) => {
          const id = entry.target.id
          if (!animatedOnce.current.has(id)) {
            if (!prefersReduced) entry.target.classList.add("animate-fade-in-up")
            entry.target.classList.remove("opacity-0")
            animatedOnce.current.add(id)
          } else {
            entry.target.classList.remove("opacity-0")
          }
        })

        if (visible.length) {
          const top = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          setActiveSection(top.target.id)
        } else {
          // Si ninguna entrada del lote es visible, determinamos por posición de las refs
          const mid = (window.innerHeight || document.documentElement.clientHeight) / 2
          const current = sectionsRef.current
            .filter(Boolean)
            .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
            .filter((s) => s.top <= mid)
            .sort((a, b) => b.top - a.top)[0]
          if (current) setActiveSection(current.id)
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" }
    )

    sectionsRef.current.forEach((section) => { if (section) observer.observe(section) })

    // Fallback inicial por si carga con secciones ya en viewport
    const vh = window.innerHeight || document.documentElement.clientHeight
    sectionsRef.current.forEach((section) => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        if (!prefersReduced) section.classList.add("animate-fade-in-up")
        section.classList.remove("opacity-0")
        animatedOnce.current.add(section.id)
      }
    })

    // Mostrar botón "arriba" al hacer scroll
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setShowTop(y > 400)

      // Progreso de lectura
      const vh = window.innerHeight || document.documentElement.clientHeight
      const doc = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
      const total = Math.max(doc - vh, 1)
      setProgress(Math.min(100, Math.max(0, (y / total) * 100)))

      // Asegurar visibilidad de secciones en viewport
      sectionsRef.current.forEach((section) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        const inView = rect.top < vh * 0.95 && rect.bottom > vh * 0.05
        if (inView) {
          if (!animatedOnce.current.has(section.id)) {
            if (!prefersReduced) section.classList.add("animate-fade-in-up")
            animatedOnce.current.add(section.id)
          }
          section.classList.remove("opacity-0")
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Utils: filtrar techs relevantes y limitar cantidad mostrada
  const normalizeTech = (s) => (s || "")
    .toString()
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "") // quitar versiones
    .replace(/\s+\(.*?\)/g, "") // quitar paréntesis descriptivos
    .trim()

  const relevantKeywords = [
    // Frontend
    "react", "react native", "next.js", "vite", "tailwind", "typescript", "javascript",
    // Backend / APIs
    "node", "express", "nest", "graphql", "rest",
    // Auth / Cloud
    "firebase", "auth", "jwt", "oauth",
    // Data
    "mongodb", "mongoose", "postgres", "sqlite",
    // Python
    "python", "flask", "fastapi",
    // DevOps
    "docker",
    // Security / Crypto (tu foco)
    "owasp", "pentest", "pentesting", "htb", "hack the box", "c2", "rsa", "aes", "argon2", "ssl", "openssl",
    // Hardware/IoT relacionados
    "esp32", "esp32-cam",
  ]

  const filterRelevantTech = (list = [], limit = 6) => {
    const scored = list.map((t) => {
      const n = normalizeTech(t)
      const isRelevant = relevantKeywords.some((k) => n.includes(k))
      // Penalizar herramientas utilitarias menos relevantes en portfolio
      const isNoise = /eslint|nodemon|dotenv|cookie|helmet|cors\b|rss|parser|rate|limit|validator|axios\b|email\b(?!.*auth)|google\b(?!.*auth)|github\b(?!.*auth)|powerlevel|zsh|sxhkd|polybar|picom/i.test(n)
      const score = (isRelevant ? 2 : 0) + (isNoise ? -2 : 0)
      return { t, n, score }
    })
    // Orden: mayor score primero, luego longitud corta
    scored.sort((a, b) => b.score - a.score || a.n.length - b.n.length)
    const filtered = scored.filter((x) => x.score > -2).map((x) => x.t)
    const unique = Array.from(new Set(filtered))
    const shown = unique.slice(0, limit)
    const hiddenCount = Math.max(0, unique.length - shown.length)
    return { shown, hiddenCount }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300">
      {/* Foreground content wrapper to sit above backgrounds */}
      <div className="relative z-10">
        {/* Reading progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-20">
          <div
            className="h-1 bg-neutral-900/50 dark:bg-neutral-100/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sidebar nav */}
        <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <div className="flex flex-col gap-4">
            {["intro", "work", "projects", "thoughts", "connect"].map((section) => (
              <button
                key={section}
                onClick={() =>
                  document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
                }
                className={`w-2 h-8 rounded-full transition-all duration-500 ${
                  activeSection === section
                    ? "bg-neutral-900 dark:bg-neutral-100"
                    : "bg-neutral-500/30 hover:bg-neutral-500/60"
                }`}
                aria-current={activeSection === section ? "true" : undefined}
                aria-controls={section}
                aria-label={`Navigate to ${section}`}
                title={section.charAt(0).toUpperCase() + section.slice(1)}
              />
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-8 lg:px-16">
          {/* INTRO */}
          <header
            id="intro"
            ref={(el) => (sectionsRef.current[0] = el)}
            className="min-h-screen flex items-center opacity-0"
          >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">
                  PORTFOLIO / 2025
                </div>
                <h1 ref={heroNameRef} className="text-6xl lg:text-7xl font-light tracking-tight will-change-transform">
                  Axel
                  <br />
                  <span className="text-muted-foreground">Castillo</span>
                </h1>
              </div>

              <div ref={heroStatusRef} className="space-y-6 max-w-md will-change-transform">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Ingeniero de software enfocado en construir aplicaciones web seguras, uniendo
                  <span className="text-foreground"> desarrollo</span>,
                  <span className="text-foreground"> arquitectura</span> y
                  <span className="text-foreground"> ciberseguridad</span> para prevenir vulnerabilidades y proteger datos.
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Disponible para trabajo
                  </div>
                  <div>Monterrey, México</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">Ing. en Desarrollo de Software (Universidad)</div>
                  <div className="text-muted-foreground">Autodidacta en Ciberseguridad</div>
                  <div className="text-xs text-muted-foreground">Universidad: 2023 — Presente · Ciberseguridad: 2020 — Presente</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div ref={heroFocusRef} className="flex flex-wrap gap-2 will-change-transform">
                  {["Offensive Security", "Web AppSec", "Node.js/Express", "ReactJS", "API Design", "Linux", "OWASP Top 10", "Bug Bounty", "Threat Hunting"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* WORK */}
        <section
          id="work"
          ref={(el) => (sectionsRef.current[1] = el)}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-light">Experiencia (Prácticas)</h2>
              <div className="text-sm text-muted-foreground font-mono">Reciente</div>
            </div>

            <div className="space-y-12">
              {jobs.map((job, index) => (
                <div
                  key={`${job.year}-${job.role}`}
                  className="group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                    {job.type && (
                      <div className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                        {job.type}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      {job.description}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 items-start lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-2 lg:justify-items-end lg:text-right">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs leading-tight text-muted-foreground rounded border border-border group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          ref={(el) => (sectionsRef.current[2] = el)}
          className="py-32 opacity-0"
        >
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-light">Proyectos</h2>
              <div className="text-sm text-muted-foreground font-mono">Seleccionados</div>
            </div>

            <div className="space-y-12">
              {projects.map((proj, index) => (
                <article
                  key={proj.title}
                  className="group card glass shadow-glow p-8 transition-all duration-500"
                >
                  <div className="space-y-4 md:flex md:items-start md:gap-6">
                    {/* Columna izquierda: texto */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                          {proj.title}
                        </h3>
                        {proj.source && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground group-hover:border-foreground/40 transition-colors duration-300">
                            {proj.source}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{proj.description}</p>
                      {(() => {
                        const { shown, hiddenCount } = filterRelevantTech(proj.tech || [])
                        return (
                          <div className="flex flex-wrap items-center gap-2">
                            {shown.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-1 text-xs text-muted-foreground rounded border border-border hover:text-foreground hover:border-foreground/40 transition-colors duration-300"
                              >
                                {t}
                              </span>
                            ))}
                            {hiddenCount > 0 && (
                              <span className="px-2 py-1 text-[10px] rounded border border-border text-muted-foreground">
                                +{hiddenCount} más
                              </span>
                            )}
                          </div>
                        )
                      })()}

                      {(proj.href || proj.repo) && (
                        <div className="pt-2 flex items-center gap-4 text-sm">
                          {proj.href && proj.href !== "#" && (
                            <a
                              href={proj.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors duration-300"
                              aria-label={`Abrir demo de ${proj.title}`}
                            >
                              <span>Demo</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          )}
                          {proj.repo && proj.repo !== "#" && (
                            <a
                              href={proj.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors duration-300"
                              aria-label={`Abrir repositorio de ${proj.title}`}
                            >
                              <span>Repo</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* (removida) Columna derecha: miniatura */}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* THOUGHTS */}
        <section
          id="thoughts"
          ref={(el) => (sectionsRef.current[3] = el)}
          className="min-h-screen py-32 opacity-0"
        >
          <div className="space-y-16">
            <h2 className="text-4xl font-light">Blog personal sobre Ciberseguridad</h2>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {posts.map((post, index) => (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                  aria-label={`Abrir post: ${post.title}`}
                >
                  <article className="card glass shadow-glow p-8 transition-all duration-500 cursor-pointer h-full flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 pt-4">
                      <span>Read more</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CONNECT */}
        <section
          id="connect"
          ref={(el) => (sectionsRef.current[4] = el)}
          className="py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Apasionado por la seguridad ofensiva y el desarrollo web; feliz de conversar sobre pentesting, OWASP Top 10, threat hunting y arquitectura de APIs.
                </p>

                <div className="space-y-4">
                  <a
                    href="mailto:axlc4st@proton.me"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-lg">axlc4st@proton.me</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-2 gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                    target={social.url && social.url !== "#" ? "_blank" : undefined}
                    rel={social.url && social.url !== "#" ? "noopener noreferrer" : undefined}
                    aria-label={`${social.name}: ${social.handle}`}
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                © 2025 Axel Castillo. All rights reserved.
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/*
              <button
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duración-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              */}
            </div>
          </div>
        </footer>
      </main>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => {
            const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
          }}
          className="cursor-pointer fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur hover:border-muted-foreground/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 transition-colors duration-300 shadow-sm"
          aria-label="Volver arriba"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      </div>
      {/* gradient bottom (fuera del wrapper para máxima visibilidad) */}
      <div className="fixed bottom-0 left-0 right-0 h-64 md:h-80 bg-gradient-to-t from-black/60 via-black/35 to-transparent dark:from-black/80 dark:via-black/50 pointer-events-none z-40"></div>

      {/* (removido) Image Modal (sobre el gradiente) */}
    </div>
  )
}

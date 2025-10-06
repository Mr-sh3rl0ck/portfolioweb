import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

export default function ProjectCard({ project, filterRelevantTech }) {
  const { shown, hiddenCount } = filterRelevantTech(project.tech || [])
  const [showModal, setShowModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Obtener array de imágenes solo si existen
  const images = Array.isArray(project.images) ? project.images :
    (project.image ? [project.image] : [])
  const hasImages = images.length > 0
  const hasMultipleImages = images.length > 1

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  // Navegación con teclado
  useEffect(() => {
    if (!showModal) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showModal, hasMultipleImages, images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // Solo permitir abrir modal si hay imágenes
  const openModal = () => {
    if (hasImages) {
      setCurrentImageIndex(0)
      setShowModal(true)
    }
  }
  
  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 card shadow-glow glass">
        {/* Image Container - Solo mostrar si hay imágenes */}
        {hasImages && (
          <div 
            className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-neutral-900/5 to-neutral-900/10 dark:from-neutral-100/5 dark:to-neutral-100/10 cursor-pointer"
            onClick={openModal}
          >
            <img
              src={images[0]}
              alt={project.imageAlt || project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                {hasMultipleImages ? `Ver ${images.length} imágenes` : 'Ver imagen'}
              </div>
            </div>
            
            {/* Source badge */}
            {project.source && (
              <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full bg-black/70 backdrop-blur-sm border border-white/30 text-white shadow-lg">
                {project.source}
              </div>
            )}
            
            {/* Multiple images indicator */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 right-4 px-2 py-1 text-xs font-medium rounded-full bg-black/70 backdrop-blur-sm text-white flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {images.length}
              </div>
            )}
          </div>
        )}

      {/* Content Container */}
      <div className="flex flex-col p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors duration-300 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {shown.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs text-muted-foreground rounded border border-border hover:text-foreground hover:border-foreground/40 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
          {(hiddenCount > 0 || shown.length > 4) && (
            <span className="px-2 py-0.5 text-[10px] rounded border border-border text-muted-foreground">
              +{hiddenCount + Math.max(0, shown.length - 4)} más
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {(project.href || project.repo) && (
          <div className="flex items-center gap-2 pt-3 mt-auto">
            {project.href && project.href !== "#" && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-lg border border-border hover:border-foreground/30 transition-all duration-300"
                aria-label={`Ver demo de ${project.title}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Ver más</span>
              </a>
            )}
            {project.repo && project.repo !== "#" && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-lg border border-border hover:border-foreground/30 transition-all duration-300"
                aria-label={`Ver repositorio de ${project.title}`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>

    {/* Image Modal con Carrusel usando Portal - Solo mostrar si hay imágenes */}
    {showModal && hasImages && createPortal(
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
        onClick={() => setShowModal(false)}
      >
        {/* Botón cerrar */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300 border border-white/20"
          aria-label="Cerrar modal"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Contenedor principal centrado */}
        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {/* Botón anterior */}
          {hasMultipleImages && (
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 z-[10000] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all duration-300 border border-white/20"
              aria-label="Imagen anterior"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Contenedor de imagen y controles */}
          <div className="flex flex-col items-center justify-center max-w-7xl w-full px-12 md:px-20">
            {/* Imagen actual */}
            <img
              src={images[currentImageIndex]}
              alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
              className="max-w-full max-h-[70vh] md:max-h-[75vh] w-auto h-auto object-contain rounded-lg md:rounded-xl shadow-2xl"
              key={currentImageIndex}
            />

            {/* Información del proyecto e indicador de imagen */}
            <div className="mt-4 md:mt-6 text-center bg-black/60 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-lg border border-white/10">
              <h4 className="text-white text-base md:text-lg font-semibold">{project.title}</h4>
              <div className="flex items-center justify-center gap-2 md:gap-3 mt-1 md:mt-2">
                {project.source && (
                  <p className="text-white/70 text-xs md:text-sm">{project.source}</p>
                )}
                {hasMultipleImages && (
                  <>
                    {project.source && <span className="text-white/40 text-xs md:text-sm">•</span>}
                    <p className="text-white/70 text-xs md:text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails / Dots indicator */}
            {hasMultipleImages && (
              <div className="flex gap-2 mt-3 md:mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/40 hover:bg-white/60 w-2'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Botón siguiente */}
          {hasMultipleImages && (
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 z-[10000] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all duration-300 border border-white/20"
              aria-label="Imagen siguiente"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  )
}

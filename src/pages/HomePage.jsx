import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { LABEL_KEYS, LABELS } from '../lib/labels'
import { validateSession } from '../lib/validate'

const SESSIONS = [
  { id: 1, title: 'Physics Simulation · Cohort A', status: 'reviewed', meta: '180s · 18 segments' },
  { id: 2, title: 'Circuit Lab · Cohort B', status: 'needs-review', meta: '240s · 24 segments' },
  { id: 3, title: 'Language Tutor · Cohort C', status: 'processing', meta: 'analyzing…' },
]

const STATUS_LABELS = {
  'reviewed': 'Reviewed',
  'needs-review': 'Needs review',
  'processing': 'Processing…',
}

export default function HomePage() {
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const proxy = useRef({ pct: 0 })
  const fillRef = useRef(null)
  const percentRef = useRef(null)
  const tweenRef = useRef(null)
  const isReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const startProcessing = useCallback((session) => {
    const go = () => navigate('/review', { state: session ? { session } : undefined })
    setProcessing(true)
    proxy.current.pct = 0
    if (fillRef.current) fillRef.current.style.width = '0%'
    if (percentRef.current) percentRef.current.textContent = '0%'
    if (isReduced.current) {
      setTimeout(go, 400)
      return
    }
    tweenRef.current = gsap.to(proxy.current, {
      pct: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (fillRef.current) fillRef.current.style.width = `${proxy.current.pct}%`
        if (percentRef.current) percentRef.current.textContent = `${Math.round(proxy.current.pct)}%`
      },
      onComplete: go,
    })
  }, [navigate])

  useEffect(() => {
    return () => {
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [])

  const handleFile = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    setError(null)
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    const file = files && files.length > 0 ? files[0] : null
    if (!file) return
    if (fileInputRef.current) fileInputRef.current.value = ''
    const reader = new FileReader()
    reader.onerror = () => setError('Could not read that file. Please try another session file.')
    reader.onload = () => {
      let parsed
      try {
        parsed = JSON.parse(reader.result)
      } catch {
        setError('Could not read that file as JSON. Please drop a .json or .nxs session file.')
        return
      }
      const result = validateSession(parsed)
      if (!result.ok) {
        setError(result.error)
        return
      }
      startProcessing(result.data)
    }
    reader.readAsText(file)
  }, [startProcessing])

  useEffect(() => {
    if (isReduced.current) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' })
      gsap.from('.lede', { opacity: 0, y: 14, duration: 0.5, delay: 0.1, ease: 'power2.out' })
      gsap.from('.rubric-chip', {
        opacity: 0,
        y: 10,
        duration: 0.3,
        stagger: 0.06,
        delay: 0.2,
        ease: 'power2.out',
      })
      gsap.from('.dropzone', { opacity: 0, y: 12, duration: 0.4, delay: 0.4, ease: 'power2.out' })
      gsap.from('.session-row', {
        opacity: 0,
        x: -8,
        duration: 0.3,
        stagger: 0.06,
        ease: 'power2.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="home">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="brand-mark">N</div>
          <div className="brand-wordmark">
            NexusSync <span>· lab</span>
          </div>
        </div>
        <div>
          <div className="sidebar__section">Fusing sessions</div>
          <div className="session-list">
            {SESSIONS.map(s => (
              <button
                key={s.id}
                className="session-row"
                onClick={() => navigate('/review')}
              >
                <div className="session-row__title">{s.title}</div>
                <div className="session-row__meta">
                  <span>{s.meta}</span>
                  <span className={`status-pill status-pill--${s.status}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="main-panel">
        <p className="eyebrow">Research assistant</p>
        <h1 className="hero-title">
          One pass.<br />
          <em>Fused timelines.</em>
        </h1>
        <p className="lede">
          Upload a session and review how gaze, heart rate, and clicks fuse
          into one affective timeline — engaged, frustrated, confused, or bored.
        </p>

        <div className="rubric">
          <h2>Affective labels</h2>
          <div className="rubric-list">
            {LABEL_KEYS.map(key => (
              <span className={`rubric-chip rubric-chip--${key}`} key={key}>
                {LABELS[key].name}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`dropzone${dragOver ? ' dropzone--over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFile}
        >
          <div>
            <div className="dropzone__title">Drop a session recording</div>
            <div className="dropzone__hint">Session JSON · .json or .nxs</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.nxs,application/json"
            onChange={handleFile}
          />
        </div>

        {error && <p className="home__error" role="alert">{error}</p>}
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="processing-card">
            <div className="processing-card__status">Fusing multimodal signals…</div>
            <div className="processing-card__sub">Aligning gaze, heart rate, and click data</div>
            <div className="progress-track">
              <div className="progress-fill" ref={fillRef} />
            </div>
            <div className="processing-card__percent" ref={percentRef}>0%</div>
          </div>
        </div>
      )}
    </div>
  )
}

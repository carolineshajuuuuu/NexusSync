import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { LABELS, LABEL_KEYS } from '../lib/labels'
import { formatTime } from '../lib/format'
import sessionData from '../data/session-data.json'

const ACTION_MS = 1600

function formatClick(click) {
  if (!click) return '—'
  return click.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ReviewPage() {
  const location = useLocation()
  const { sessionName, durationSeconds, segments } = location.state?.session || sessionData

  const [selectedId, setSelectedId] = useState(() => {
    const defaultSeg = segments.find(s => s.id === 4)
    return defaultSeg ? defaultSeg.id : segments[0].id
  })

  const [acceptedIds, setAcceptedIds] = useState(new Set())
  const [correctedIds, setCorrectedIds] = useState(new Set())

  const selected = useMemo(
    () => segments.find(s => s.id === selectedId) || segments[0],
    [segments, selectedId]
  )

  const stats = useMemo(() => {
    const counts = {}
    LABEL_KEYS.forEach(k => { counts[k] = 0 })
    let hrSum = 0
    let hrMin = Infinity
    let hrMax = -Infinity
    segments.forEach(s => {
      counts[s.label] = (counts[s.label] || 0) + 1
      hrSum += s.heartRate
      if (s.heartRate < hrMin) hrMin = s.heartRate
      if (s.heartRate > hrMax) hrMax = s.heartRate
    })
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const dominantPct = Math.round((dominant[1] / segments.length) * 100)
    return {
      total: segments.length,
      dominant: { key: dominant[0], count: dominant[1], pct: dominantPct },
      hrMean: (hrSum / segments.length).toFixed(1),
      hrMin,
      hrMax,
      counts,
    }
  }, [segments])

  const ctxRef = useRef(null)
  const pulseRef = useRef(null)
  const initRender = useRef(true)
  const isReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (isReduced.current) return
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.seg-log__row')
      gsap.from(rows, {
        opacity: 0,
        y: 8,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.out',
      })
    })
    ctxRef.current = ctx
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isReduced.current) return
    if (initRender.current) {
      initRender.current = false
      return
    }
    if (pulseRef.current) {
      gsap.killTweensOf(pulseRef.current)
    }
    const el = document.querySelector('.timeline__seg--selected')
    if (el) {
      pulseRef.current = el
      gsap.fromTo(
        el,
        { filter: 'brightness(1)' },
        {
          filter: 'brightness(1.12)',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
          clearProps: 'filter',
        }
      )
    }
  }, [selectedId])

  const animateValue = useCallback((el, to, decimals = 0) => {
    if (!el || isReduced.current) return
    const proxy = { val: 0 }
    gsap.to(proxy, {
      val: to,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = proxy.val.toFixed(decimals)
      },
    })
  }, [])

  const valueRefs = useRef({})

  useEffect(() => {
    const el = valueRefs.current['segments']
    if (el) animateValue(el, stats.total, 0)
    const el2 = valueRefs.current['hrMean']
    if (el2) animateValue(el2, parseFloat(stats.hrMean), 1)
  }, [stats, animateValue])

  const handleConfirm = useCallback((id, type) => {
    if (type === 'accept') {
      setAcceptedIds(prev => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
      setTimeout(() => {
        setAcceptedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, ACTION_MS)
    } else {
      setCorrectedIds(prev => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
      setTimeout(() => {
        setCorrectedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, ACTION_MS)
    }
  }, [])

  const rulerTicks = useMemo(() => {
    const ticks = []
    const step = 30
    for (let t = 0; t <= durationSeconds; t += step) {
      ticks.push(formatTime(t))
    }
    return ticks
  }, [durationSeconds])

  const playheadPct = (selected.startTime / durationSeconds) * 100

  return (
    <div className="review">
      <header className="topbar">
        <div className="topbar__left">
          <Link to="/" className="topbar__back">← Sessions</Link>
          <div className="topbar__title">{sessionName}</div>
        </div>
        <div className="topbar__meta">
          {segments.length} segments · {formatTime(durationSeconds)}
        </div>
      </header>

      <div className="review__grid">
        <div className="review__col">
          <section className="player">
            <div className="player__screen">
              <div className="player__glyph">
                <svg viewBox="0 0 24 24">
                  <polygon points="7,5 19,12 7,19" />
                </svg>
              </div>
              <p className="player__screen-copy">gaze · heart · clicks — fused</p>
            </div>
            <div className="player__meta">
              <span className="player__time">
                {formatTime(selected.startTime)} – {formatTime(selected.endTime)}
              </span>
              <span className="player__rec">
                <span className="player__rec-dot" /> reviewing
              </span>
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-panel__head">
              <span className="detail-panel__time">
                {formatTime(selected.startTime)} – {formatTime(selected.endTime)}
              </span>
              <span className="detail-panel__segment">
                <span
                  className="chip"
                  style={{
                    background: LABELS[selected.label].tint,
                    color: LABELS[selected.label].deep,
                  }}
                >
                  {LABELS[selected.label].name}
                </span>
              </span>
            </div>
            <p className="detail__justification">{selected.justification}</p>
            <div className="detail__fields">
              <div className="detail__field">
                <div className="detail__field-label">Heart rate</div>
                <div className="detail__field-value">{selected.heartRate} bpm</div>
              </div>
              <div className="detail__field">
                <div className="detail__field-label">Click event</div>
                <div className="detail__field-value">{formatClick(selected.clickEvent)}</div>
              </div>
            </div>
            <div className="detail__actions">
              <button
                className={`btn ${acceptedIds.has(selected.id) ? 'btn--confirm' : 'btn--ghost'}`}
                onClick={() => handleConfirm(selected.id, 'accept')}
              >
                Accept
              </button>
              <button
                className={`btn ${correctedIds.has(selected.id) ? 'btn--confirm' : 'btn--ghost'}`}
                onClick={() => handleConfirm(selected.id, 'correct')}
              >
                Correct
              </button>
            </div>
          </section>
        </div>

        <aside className="stats">
          <div className="stat-card">
            <div className="stat-card__label">Segments</div>
            <div
              className="stat-card__value"
              ref={el => { valueRefs.current['segments'] = el }}
            >
              {stats.total}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Dominant</div>
            <div className="stat-card__value" style={{ color: LABELS[stats.dominant.key].color }}>
              {LABELS[stats.dominant.key].name}
            </div>
            <div className="stat-card__sub">{stats.dominant.pct}% of session</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Heart rate</div>
            <div
              className="stat-card__value"
              ref={el => { valueRefs.current['hrMean'] = el }}
            >
              {stats.hrMean}
            </div>
            <div className="stat-card__sub">
              {stats.hrMin} – {stats.hrMax} bpm range
            </div>
          </div>
          <div className="stat-card">
            <div className="distribution">
              {LABEL_KEYS.map(key => (
                <div className="distribution-row" key={key}>
                  <div className="distribution-row__label">{LABELS[key].name}</div>
                  <div className="distribution-track">
                    <div
                      className="distribution-fill"
                      style={{
                        width: `${(stats.counts[key] / stats.total) * 100}%`,
                        background: LABELS[key].color,
                      }}
                    />
                  </div>
                  <div className="distribution-row__count">{stats.counts[key]}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="timeline">
        <div className="timeline__head">
          <h2>Timeline</h2>
          <div className="timeline__legend">
            {LABEL_KEYS.map(key => (
              <span className="timeline__legend-item" key={key}>
                <span
                  className="timeline__legend-dot"
                  style={{ background: LABELS[key].color }}
                />
                {LABELS[key].name}
              </span>
            ))}
          </div>
        </div>
        <div className="timeline__canvas">
          <span
            className="timeline__playhead"
            style={{ left: `${playheadPct}%` }}
          />
          <div className="timeline__track">
            {segments.map(seg => {
              const width = ((seg.endTime - seg.startTime) / durationSeconds) * 100
              return (
                <button
                  key={seg.id}
                  className={`timeline__seg${seg.id === selectedId ? ' timeline__seg--selected' : ''}`}
                  style={{
                    width: `${width}%`,
                    background: LABELS[seg.label].color,
                  }}
                  onClick={() => setSelectedId(seg.id)}
                  aria-label={`${LABELS[seg.label].name} segment ${seg.id}: ${formatTime(seg.startTime)} – ${formatTime(seg.endTime)}`}
                />
              )
            })}
          </div>
          <div className="timeline__ruler">
            {rulerTicks.map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="seg-log" style={{ marginTop: 30 }}>
        <div className="timeline__head">
          <h2>Review log</h2>
          <span className="topbar__meta">{segments.length} segments</span>
        </div>
        {segments.map(seg => (
          <button
            key={seg.id}
            className="seg-log__row"
            onClick={() => setSelectedId(seg.id)}
            style={seg.id === selectedId ? { background: 'var(--surface-warm)' } : undefined}
          >
            <span className="seg-log__time">
              {formatTime(seg.startTime)} : {formatTime(seg.endTime)}
            </span>
            <span
              className="chip"
              style={{
                background: LABELS[seg.label].tint,
                color: LABELS[seg.label].deep,
              }}
            >
              {LABELS[seg.label].name}
            </span>
          </button>
        ))}
      </section>
    </div>
  )
}

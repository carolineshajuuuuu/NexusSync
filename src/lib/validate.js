import { LABEL_KEYS } from './labels'

export function validateSession(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      ok: false,
      error: 'That file does not look like a session. Please drop a .json or .nxs session file.',
    }
  }

  if (typeof data.sessionName !== 'string' || data.sessionName.trim() === '') {
    return { ok: false, error: 'Missing a valid sessionName — expected a non-empty string.' }
  }

  const duration = data.durationSeconds
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration <= 0) {
    return { ok: false, error: 'Invalid durationSeconds — expected a positive number of seconds.' }
  }

  if (!Array.isArray(data.segments) || data.segments.length === 0) {
    return { ok: false, error: 'The session has no segments — expected a non-empty segments array.' }
  }

  const seenIds = new Set()
  for (const seg of data.segments) {
    if (!seg || typeof seg !== 'object' || Array.isArray(seg)) {
      return { ok: false, error: 'A segment entry is malformed — expected an object.' }
    }
    if (typeof seg.id !== 'number' || !Number.isFinite(seg.id)) {
      return { ok: false, error: `Segment ${data.segments.indexOf(seg) + 1} has an invalid id — expected a number.` }
    }
    if (seenIds.has(seg.id)) {
      return { ok: false, error: `Duplicate segment id ${seg.id} — each segment needs a unique id.` }
    }
    seenIds.add(seg.id)

    if (
      typeof seg.startTime !== 'number' || !Number.isFinite(seg.startTime) ||
      typeof seg.endTime !== 'number' || !Number.isFinite(seg.endTime)
    ) {
      return { ok: false, error: `Segment ${seg.id} has invalid startTime or endTime.` }
    }
    if (seg.startTime < 0 || seg.startTime >= seg.endTime || seg.endTime > duration) {
      return {
        ok: false,
        error: `Segment ${seg.id} is out of range — expected 0 <= startTime < endTime <= durationSeconds.`,
      }
    }
    if (!LABEL_KEYS.includes(seg.label)) {
      return {
        ok: false,
        error: `Segment ${seg.id} has an unknown label "${seg.label}" — expected one of: ${LABEL_KEYS.join(', ')}.`,
      }
    }
    if (typeof seg.heartRate !== 'number' || !Number.isFinite(seg.heartRate) || seg.heartRate < 0) {
      return { ok: false, error: `Segment ${seg.id} has an invalid heartRate — expected a finite number >= 0.` }
    }
    if (seg.justification !== undefined && typeof seg.justification !== 'string') {
      return { ok: false, error: `Segment ${seg.id} has an invalid justification — expected a string.` }
    }
  }

  return { ok: true, data }
}
const TZ = 'America/Bogota'

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso))
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: TZ,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

export function getAccessResultLabel(result: string): {
  label: string; color: string
} {
  const map: Record<string, { label: string; color: string }> = {
    GRANTED:              { label: 'Permitido',     color: '#2e7d32' },
    DENIED_NO_PERMISSION: { label: 'Sin permiso',   color: '#d32f2f' },
    DENIED_NOT_FOUND:     { label: 'No registrado', color: '#f57c00' },
    DENIED_MAX_CAPACITY:  { label: 'Aforo máximo',  color: '#7b1fa2' },
  }
  return map[result] ?? { label: result, color: '#546e7a' }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
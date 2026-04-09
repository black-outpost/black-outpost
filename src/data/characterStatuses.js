// Stałe statusy postaci — pokazywane w Personnel Search i Character List
export const CHARACTER_STATUSES = [
  { value: 'alive',    label: 'Alive',    color: '#60c080' },
  { value: 'deceased', label: 'Deceased', color: '#c04040' },
  { value: 'mia',      label: 'M.I.A.',   color: '#c08020' },
]

export const STATUS_NONE = { value: '', label: '— brak —', color: 'var(--color-bo-muted)' }

export function getStatus(val) {
  return CHARACTER_STATUSES.find(s => s.value === val) ?? null
}

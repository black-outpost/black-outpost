export const STAT_DISPLAY_NAMES = {
  bujutsu: {
    'Soul Reaper': 'Hakuda', 'Arrancar': 'Hakuda',
    'Quincy': 'Hakuda', 'Fullbringer': 'Hakuda', default: 'Bujutsu',
  },
  bukijutsu: {
    'Soul Reaper': 'Zanjutsu', 'Arrancar': 'Zanjutsu',
    'Quincy': 'Kyudo', 'Fullbringer': 'Bukijutsu', default: 'Bukijutsu',
  },
  tamashi: {
    'Soul Reaper': 'Zanpakuto Mastery', 'Arrancar': 'Zanpakuto Mastery',
    'Quincy': 'Blood Mastery', 'Fullbringer': 'Fullbring Mastery', default: 'Tamashi',
  },
}

export function getStatName(stat, race) {
  if (!STAT_DISPLAY_NAMES[stat]) return stat.charAt(0).toUpperCase() + stat.slice(1)
  return STAT_DISPLAY_NAMES[stat][race] ?? STAT_DISPLAY_NAMES[stat].default ?? stat
}

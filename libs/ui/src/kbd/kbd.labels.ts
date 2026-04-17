/** Spanish key-name glossary for screen reader announcements. */
const keyNameMap: Record<string, string> = {
  '⌘': 'Comando',
  'Ctrl': 'Control',
  '⇧': 'Mayús',
  '⌥': 'Opción',
  '⌃': 'Control',
  '↵': 'Intro',
  '⌫': 'Retroceso',
  '⎋': 'Escape',
  '↑': 'Flecha arriba',
  '↓': 'Flecha abajo',
  '←': 'Flecha izquierda',
  '→': 'Flecha derecha',
  '⇥': 'Tabulador',
  'Space': 'Espacio',
};

export function keyToSpokenName(key: string): string {
  return keyNameMap[key] ?? key;
}

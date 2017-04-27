export const WINDOW_SCROLL = 'WINDOW_SCROLL'

export function scrollLayout (position) {
  return { type: WINDOW_SCROLL, payload: {...position} }
}

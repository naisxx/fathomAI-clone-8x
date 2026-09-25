/**
 * A one-line channel for "open the command palette".
 *
 * The palette owns its own state, because the keyboard shortcut, the focus
 * restore and the result list all belong together. But the header trigger is a
 * sibling, and later the rail hint or an empty state may want to open it too —
 * so rather than lifting that state up through the layout, or wrapping the app
 * in a context provider for one boolean, anything can call `openPalette()`.
 *
 * Module scope is fine here: the palette is a singleton by construction.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function openPalette() {
  for (const fn of listeners) fn();
}

/** Returns the unsubscribe function, so it drops straight into useEffect. */
export function onOpenPalette(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * One icon set, one stroke weight. Inline SVG so nothing is fetched, and
 * `currentColor` so every icon takes the colour of the text beside it.
 * Paths are drawn on a 24-unit grid in the style of the Lucide set.
 */

const PATHS = {
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3ZM9 12l2 2 4-4',
  chain:
    'M9.5 14.5 14.5 9.5M8 11.5l-2.2 2.2a3.2 3.2 0 0 0 4.5 4.5L12.5 16M16 12.5l2.2-2.2a3.2 3.2 0 0 0-4.5-4.5L11.5 8',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM20 20l-4.8-4.8',
  handshake: 'M3 11l4-4 4 2 3-2 7 4M7 7v6l5 4 2-1M14 9l4 4-2 3M3 11v4l4 3',
  coins: 'M9 9a5 3 0 1 0 0-.01M4 9v4c0 1.7 2.2 3 5 3s5-1.3 5-3V9M14 12a5 3 0 0 1 6 2.6V18c0 1.7-2.2 3-5 3-1.7 0-3.2-.5-4-1.2',
  flask: 'M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10',
  phone: 'M7 2.5h10a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V4A1.5 1.5 0 0 1 7 2.5ZM10.5 18.5h3',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01',
  cpu: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  terminal: 'M4 5h16v14H4zM7.5 9.5l3 2.5-3 2.5M12.5 15h4',
  scroll: 'M8 3h10a2 2 0 0 1 2 2v2h-4M8 3a2 2 0 0 0-2 2v12M8 3a2 2 0 0 1 2 2v14a2 2 0 0 1-4 0v-2H4M10 8h6M10 12h6',
  alert: 'M12 3.5 2.5 20h19L12 3.5ZM12 10v4.5M12 17.5h.01',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  eye: 'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  key: 'M14.5 9.5a4.5 4.5 0 1 1-1.3-3.2M14.5 9.5l7 7M18 13l2 2M16 15l2 2',
  arrows: 'M4 8h14l-3-3M20 16H6l3 3',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z',
  image: 'M4 5h16v14H4zM8.5 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM20 15l-4.5-4.5L7 19',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  pen: 'M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  x: 'M6 6l12 12M18 6 6 18',
  list: 'M4 6h16M4 12h16M4 18h10',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  wave: 'M4 12h3l2-5 3 10 2-5h6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5',
  block: 'M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5ZM3.5 7 12 11.5 20.5 7M12 11.5v10',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

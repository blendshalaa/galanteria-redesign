import { Spinner } from '../ui';

/**
 * Shown while a lazily-loaded route chunk is fetched. Deliberately minimal and
 * dark so it reads as part of the page rather than a flash of empty white.
 */
const RouteFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg, #0e0d0b)',
    }}
  >
    <Spinner size={26} />
  </div>
);

export default RouteFallback;

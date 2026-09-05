import { Link } from 'react-router-dom';
import useLang from '../../Hooks/useLang';
import './ProductCard.scss';

const PLACEHOLDER = 'https://placehold.co/600x750/1a1815/555?text=Galanteria';

/**
 * One product tile, used by category pages, search results and the related
 * products strip.
 *
 * Two things it fixes versus the markup it replaces:
 *
 * 1. It is a real `<Link>`. The tiles were `<div onClick={() => navigate(...)}>`,
 *    which cannot be focused, cannot be opened in a new tab or middle-clicked,
 *    has no href for crawlers to follow, and is invisible to a keyboard user.
 *
 * 2. It renders the 600px thumbnail rather than the full-size photo, inside a
 *    fixed aspect-ratio box with lazy loading — so a twenty-product grid no
 *    longer downloads twenty full-resolution images, and the page does not
 *    reflow as they arrive.
 */
const ProductCard = ({ product, eager = false }) => {
  const { t } = useLang();

  const image = product.thumbnails?.[0] || product.images?.[0] || PLACEHOLDER;

  /* Spread rather than written inline, and lowercase.
     react-dom 18.3.1 does not recognise the camelCase `fetchPriority` prop —
     it drops the attribute and logs "React does not recognize the
     fetchPriority prop on a DOM element… spell it as lowercase fetchpriority
     instead" for every card in the grid. The camelCase spelling that
     eslint-plugin-react's `no-unknown-property` rule insists on only works
     from React 19, so passing it through a spread is what lets the hint reach
     the browser without tripping the lint rule. */
  const priority = { fetchpriority: eager ? 'high' : 'auto' };

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          <img
            src={image}
            alt={product.name}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            {...priority}
            width="600"
            height="750"
            onError={(event) => {
              if (event.currentTarget.src !== PLACEHOLDER) {
                event.currentTarget.src = PLACEHOLDER;
              }
            }}
          />
          <span className="product-card-overlay" aria-hidden="true">
            <span className="product-card-cta">{t('viewProduct')}</span>
          </span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
      </Link>
    </article>
  );
};

export default ProductCard;

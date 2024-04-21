import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { img } from '../../lib/tmdb';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useModalStore } from '../../store/useModalStore';
import Image from '../common/Image';
import MovieCardHover from './MovieCardHover';
import { cardHover } from '../../constants/variants';

/**
 * MovieCard — Netflix-style card tile.
 *
 * Props:
 *   item       — TMDB item object
 *   mediaType  — 'movie' | 'tv'
 *   isLarge    — shows 2:3 poster instead of 16:9 backdrop (Originals row)
 *   index      — position in the row (0-based), used for hover shift direction
 */
const MovieCard = memo(({ item, mediaType = 'movie', isLarge = false, index = 0 }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const openModal = useModalStore((s) => s.openModal);
  const navigate  = useNavigate();

  const [hovered, setHovered] = useState(false);

  // Derive resolved media type (TMDB trending mixes both)
  const resolvedType = item.media_type || mediaType;

  // Image URL
  const imageSrc = isLarge
    ? img.poster(item.poster_path, 'w500')
    : img.backdrop(item.backdrop_path, 'w780');

  // Aspect class: 2:3 poster vs 16:9 backdrop
  const aspectClass = isLarge ? 'aspect-[2/3]' : 'aspect-video';

  // Title for alt text
  const title = item.title || item.name || 'Untitled';

  const handleClick = () => {
    if (!isDesktop) {
      openModal(resolvedType, item.id);
    }
  };

  const handlePlay = () => {
    navigate(`/watch/${resolvedType}/${item.id}`);
  };

  return (
    <motion.div
      className={[
        'relative cursor-pointer will-change-transform',
        aspectClass,
        'rounded-card overflow-visible',
      ].join(' ')}
      // Only activate hover animations on desktop
      variants={isDesktop ? cardHover : {}}
      initial="rest"
      whileHover={isDesktop ? 'hover' : undefined}
      animate="rest"
      onHoverStart={() => isDesktop && setHovered(true)}
      onHoverEnd={() => isDesktop && setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${resolvedType}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {/* Base card image — always visible */}
      <div className={['w-full h-full rounded-card overflow-hidden', aspectClass].join(' ')}>
        <Image
          src={imageSrc}
          alt={title}
          className="w-full h-full"
          rounded="rounded-card"
          fallback={isLarge ? '/placeholder-poster.jpg' : '/placeholder-backdrop.jpg'}
        />
      </div>

      {/* Hover overlay — desktop only, rendered when hovered */}
      {isDesktop && hovered && (
        <MovieCardHover
          item={item}
          mediaType={resolvedType}
          isLarge={isLarge}
          index={index}
          onPlay={handlePlay}
        />
      )}
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

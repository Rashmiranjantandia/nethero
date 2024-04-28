import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { endpoints, img, formatYear } from '../../lib/tmdb';
import { useModalStore } from '../../store/useModalStore';
import Skeleton from '../common/Skeleton';

/** Mini card in the similar grid */
const SimilarCard = ({ item, mediaType }) => {
  const navigate  = useNavigate();
  const openModal = useModalStore((s) => s.openModal);

  const resolvedType = item.media_type || mediaType;
  const title        = item.title || item.name || '';
  const year         = formatYear(item.release_date || item.first_air_date);
  // img.backdrop/poster always return a non-falsy string (placeholder URL),
  // so || never falls through. Explicitly check the path first.
  const thumb = item.backdrop_path
    ? img.backdrop(item.backdrop_path, 'w500')
    : item.poster_path
      ? img.poster(item.poster_path, 'w342')
      : '/placeholder-backdrop.jpg';


  return (
    <article
      className="relative group rounded-card overflow-hidden bg-nethero-bgLight cursor-pointer"
      onClick={() => openModal(resolvedType, item.id)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — more info`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openModal(resolvedType, item.id);
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 will-change-transform"
          onError={(e) => { e.currentTarget.src = '/placeholder-backdrop.jpg'; }}
        />
      </div>

      {/* Play overlay on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-nethero-black/30">
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={(e) => { e.stopPropagation(); navigate(`/watch/${resolvedType}/${item.id}`); }}
          className="w-10 h-10 rounded-full bg-nethero-white/90 flex items-center justify-center hover:bg-nethero-white transition-colors"
        >
          <Play size={18} fill="black" className="text-black" aria-hidden="true" />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-nethero-white text-sm font-medium line-clamp-1">{title}</p>
        {year && <p className="text-nethero-gray text-xs mt-0.5">{year}</p>}
      </div>
    </article>
  );
};

/**
 * SimilarGrid — 3-col responsive grid of similar / recommended titles.
 *
 * Props:
 *   mediaId   — TMDB id of the current title
 *   mediaType — 'movie' | 'tv'
 */
const SimilarGrid = ({ mediaId, mediaType }) => {
  const { data, loading } = useFetch(
    mediaId ? endpoints.similar(mediaType, mediaId) : null
  );

  const items = (data?.results ?? [])
    .filter((r) => r.backdrop_path || r.poster_path)
    .slice(0, 12);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-video rounded-card" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      aria-label="More like this"
    >
      {items.map((item) => (
        <SimilarCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
};

export default SimilarGrid;

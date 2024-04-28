import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { endpoints, img, formatRuntime } from '../../lib/tmdb';
import Skeleton from '../common/Skeleton';

/** Single episode row */
const EpisodeRow = ({ ep }) => {
  const still = ep.still_path
    ? img.backdrop(ep.still_path, 'w300')
    : '/placeholder-backdrop.jpg';

  return (
    <div className="flex gap-3 py-3 border-b border-nethero-border last:border-0">
      {/* Still image */}
      <div className="flex-shrink-0 w-28 sm:w-36 aspect-video rounded-card overflow-hidden bg-nethero-bgHover">
        <img
          src={still}
          alt={ep.name || `Episode ${ep.episode_number}`}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = '/placeholder-backdrop.jpg'; }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-nethero-white font-semibold text-sm line-clamp-1">
            {ep.episode_number}. {ep.name}
          </span>
          {ep.runtime && (
            <span className="text-nethero-gray text-xs flex-shrink-0">
              {formatRuntime(ep.runtime)}
            </span>
          )}
        </div>
        {ep.overview && (
          <p className="text-nethero-grayLight text-xs line-clamp-2 leading-relaxed">
            {ep.overview}
          </p>
        )}
      </div>
    </div>
  );
};

/** Season selector + episode list */
const EpisodeList = ({ tvId, totalSeasons = 1 }) => {
  const [season, setSeason] = useState(1);

  const { data, loading } = useFetch(
    tvId ? endpoints.season(tvId, season) : null,
    {},
    [season]
  );

  const episodes = data?.episodes ?? [];

  // Build season option array (1 → totalSeasons)
  const seasonOptions = Array.from(
    { length: totalSeasons },
    (_, i) => i + 1
  );

  return (
    <div className="mt-4">
      {/* Season selector */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-nethero-white font-semibold text-lg">Episodes</h3>
        <select
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          aria-label="Select season"
          className="
            bg-nethero-bgHover border border-nethero-border
            text-nethero-white text-sm rounded-card
            px-3 py-1.5
            focus:outline-none focus:ring-2 focus:ring-nethero-white
            cursor-pointer
          "
        >
          {seasonOptions.map((s) => (
            <option key={s} value={s}>Season {s}</option>
          ))}
        </select>
      </div>

      {/* Episode list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-20 rounded-card" />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <p className="text-nethero-gray text-sm py-4">No episodes available.</p>
      ) : (
        <div>
          {episodes.map((ep) => (
            <EpisodeRow key={ep.id} ep={ep} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeList;

// Royalty-free / public domain films mapped as fallback "full content"
// When user clicks Play on a movie without a real source, rotate through these
export const FREE_FILMS = [
  { id: 1, title: 'Big Buck Bunny',  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 596 },
  { id: 2, title: 'Sintel',          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',        duration: 888 },
  { id: 3, title: 'Tears of Steel',  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',  duration: 734 },
  { id: 4, title: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',duration: 653 },
  { id: 5, title: 'For Bigger Blazes',url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',duration: 15 },
];

// Map TMDB id -> free film (deterministic so same movie always plays same demo)
export const getVideoSource = (tmdbId) => {
  const idx = tmdbId % FREE_FILMS.length;
  return FREE_FILMS[idx];
};

// YouTube trailer URL builder
export const getTrailerUrl = (key) => key ? `https://www.youtube.com/watch?v=${key}` : null;

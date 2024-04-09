export const Skeleton = ({ className = '', rounded = 'rounded-card' }) => {
  return (
    <div
      aria-hidden="true"
      className={[
        'relative overflow-hidden bg-nethero-bgHover',
        rounded,
        className,
      ].join(' ')}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;

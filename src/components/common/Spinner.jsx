const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
  xl: 'w-16 h-16 border-4',
};

export const Spinner = ({ size = 'md', className = '', 'aria-label': ariaLabel = 'Loading' }) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={['inline-block rounded-full border-nethero-grayDark border-t-nethero-white animate-spin', sizeMap[size] ?? sizeMap.md, className].join(' ')}
    />
  );
};

export default Spinner;

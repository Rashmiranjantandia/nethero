import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from './Skeleton';

export const Image = ({
  src,
  alt = '',
  fallback = '/placeholder-poster.jpg',
  className = '',
  skeletonClassName = '',
  rounded = 'rounded-card',
  loading: loadingProp = 'lazy',
  ...props
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');

  const imgSrc = status === 'error' ? fallback : src;

  return (
    <div className={['relative overflow-hidden', rounded, className].join(' ')}>
      <AnimatePresence>
        {status === 'loading' && (
          <Skeleton
            key="skeleton"
            className={['absolute inset-0 w-full h-full', skeletonClassName].join(' ')}
            rounded={rounded}
          />
        )}
      </AnimatePresence>

      <motion.img
        src={imgSrc}
        alt={alt}
        loading={loadingProp}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: status === 'loaded' ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
};

export default Image;

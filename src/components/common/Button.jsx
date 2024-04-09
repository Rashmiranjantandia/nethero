import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary:
    'bg-nethero-white text-nethero-black font-semibold hover:bg-nethero-grayLight',
  secondary:
    'bg-nethero-bgHover text-nethero-white font-semibold border border-nethero-grayLight hover:bg-opacity-80',
  ghost:
    'bg-transparent text-nethero-white font-semibold hover:bg-nethero-bgHover',
  icon:
    'bg-transparent text-nethero-white hover:bg-nethero-bgHover rounded-full p-2',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-base px-5 py-2 gap-2',
  lg: 'text-lg px-7 py-3 gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15 }}
      className={[
        'inline-flex items-center justify-center rounded-card transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white',
        variant === 'icon' ? variantClasses.icon : `${variantClasses[variant]} ${sizeClasses[size]}`,
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={18} aria-hidden="true" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon size={18} aria-hidden="true" />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../common/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthForm = ({ mode = 'login', onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, signUp, signInWithGoogle } = useAuthStore();
  const isSignup = mode === 'signup';

  const validate = () => {
    const errs = {};
    if (isSignup && !name.trim()) errs.name = 'Name is required';
    if (!EMAIL_REGEX.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { error } = isSignup
        ? await signUp(email, password, name.trim())
        : await signIn(email, password);

      if (error) {
        toast.error(error.message || 'Something went wrong. Please try again.');
      } else {
        if (isSignup) {
          toast.success('Account created! Welcome to NetHero.');
        } else {
          toast.success('Welcome back!');
        }
        onSuccess?.();
      }
    } catch (err) {
      toast.error('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message || 'Google sign-in failed.');
  };

  const inputClass = (field) =>
    [
      'w-full bg-nethero-bgHover border rounded-card px-4 py-3 text-nethero-white placeholder-nethero-gray text-sm focus:outline-none focus:ring-2 transition-colors',
      errors[field]
        ? 'border-nethero-red focus:ring-nethero-red'
        : 'border-nethero-border focus:ring-nethero-white',
    ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[450px] bg-black/75 rounded-modal px-8 py-10 sm:px-12"
    >
      <h1 className="text-3xl font-bold text-nethero-white mb-8">
        {isSignup ? 'Sign Up' : 'Sign In'}
      </h1>

      <form onSubmit={handleSubmit} noValidate aria-label={isSignup ? 'Sign up form' : 'Sign in form'}>
        <div className="flex flex-col gap-4">
          {/* Name (signup only) */}
          {isSignup && (
            <div>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nethero-gray" aria-hidden="true" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  aria-label="Full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'err-name' : undefined}
                  className={inputClass('name') + ' pl-9'}
                />
              </div>
              {errors.name && <p id="err-name" role="alert" className="text-nethero-red text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nethero-gray" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                className={inputClass('email') + ' pl-9'}
              />
            </div>
            {errors.email && <p id="err-email" role="alert" className="text-nethero-red text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nethero-gray" aria-hidden="true" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                aria-label="Password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'err-password' : undefined}
                className={inputClass('password') + ' pl-9 pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-nethero-gray hover:text-nethero-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p id="err-password" role="alert" className="text-nethero-red text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-nethero-border" />
        <span className="text-nethero-gray text-xs">OR</span>
        <div className="flex-1 h-px bg-nethero-border" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        aria-label="Sign in with Google"
        className="w-full flex items-center justify-center gap-2 border border-nethero-border rounded-card py-3 text-sm text-nethero-white hover:bg-nethero-bgHover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
      >
        {/* Google SVG icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
        </svg>
        Continue with Google
      </button>

      {/* Footer hint */}
      <p className="text-nethero-gray text-sm mt-6">
        {isSignup ? 'Already have an account?' : 'New to NetHero?'}{' '}
        <a
          href={isSignup ? '/login' : '/signup'}
          className="text-nethero-white hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {isSignup ? 'Sign in.' : 'Sign up now.'}
        </a>
      </p>

      <p className="text-nethero-gray text-xs mt-4">
        Need help?{' '}
        <button type="button" className="hover:underline focus-visible:outline-none focus-visible:underline">
          Learn more
        </button>
      </p>
    </motion.div>
  );
};

export default AuthForm;

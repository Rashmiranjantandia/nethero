import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { ROUTES } from '../constants/routes';
import Footer from '../components/layout/Footer';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.PROFILES);
  };

  return (
    <div className="min-h-screen bg-nethero-black flex flex-col">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a0a0a 100%)',
        }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-5">
        <a href={ROUTES.LANDING} aria-label="NetHero home">
          <span className="text-nethero-red font-bold text-3xl tracking-tight">NetHero</span>
        </a>
        <a
          href={ROUTES.SIGNUP}
          className="text-sm font-semibold text-nethero-white bg-nethero-red px-4 py-1.5 rounded hover:bg-nethero-redHover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
        >
          Sign Up
        </a>
      </header>

      {/* Form */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <AuthForm mode="login" onSuccess={handleSuccess} />
      </main>

      {/* Minimal footer */}
      <div className="relative z-10 border-t border-nethero-border px-6 sm:px-12 py-6">
        <p className="text-nethero-gray text-xs">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
          <a href="#" className="text-nethero-grayLight hover:underline">Learn more.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

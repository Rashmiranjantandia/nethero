// Stub — will be replaced by PROMPT #16
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-nethero-bg text-nethero-white gap-4">
      <h1 className="text-h1 font-bold">Lost your way?</h1>
      <p className="text-nethero-grayLight">Sorry, we can't find that page.</p>
      <button
        onClick={() => navigate(ROUTES.BROWSE)}
        className="bg-nethero-white text-nethero-black font-semibold px-6 py-2 rounded-card hover:bg-nethero-grayLight transition-colors"
      >
        NetHero Home
      </button>
    </div>
  );
};
export default NotFound;

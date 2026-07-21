import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-overlay">
        <div className="welcome-content">
          <h1 className="welcome-brand">StreamFlix</h1>
          <p className="welcome-text">
            Welcome{user?.name ? `, ${user.name}` : ''}. Your favorite VJ-hosted movies are ready whenever you are.
          </p>
          <button className="btn-play welcome-continue" onClick={() => navigate('/home')}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
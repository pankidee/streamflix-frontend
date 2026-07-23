import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/notifications').then((res) => {
      setNotifications(res.data);
      const lastSeen = localStorage.getItem('notifications_last_seen');
      const lastSeenTime = lastSeen ? new Date(lastSeen) : new Date(0);
      setUnreadCount(res.data.filter((n) => new Date(n.createdAt) > lastSeenTime).length);
    });
  }, []);

  const handleToggle = () => {
    setOpen((v) => !v);
    if (!open) {
      localStorage.setItem('notifications_last_seen', new Date().toISOString());
      setUnreadCount(0);
    }
  };

  const handleClick = (n) => {
    setOpen(false);
    navigate(n.type === 'movie' ? `/movie/${n.referenceId}` : `/series/${n.referenceId}`);
  };

  return (
    <div className="notification-bell-wrap">
      <button className="notification-bell" onClick={handleToggle} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <p className="notification-header">Notifications</p>
          {notifications.length === 0 && (
            <p className="empty-state" style={{ padding: '1rem' }}>No notifications yet.</p>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="notification-item" onClick={() => handleClick(n)}>
              <img
                src={n.posterUrl || '/poster-placeholder.svg'}
                alt={n.title}
                onError={(e) => { e.target.src = '/poster-placeholder.svg'; }}
              />
              <div>
                <p className="notification-title">
                  New {n.type === 'movie' ? 'Movie' : 'Series'}: {n.title}
                </p>
                <p className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
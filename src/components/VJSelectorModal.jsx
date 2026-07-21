import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useVJ } from '../context/VJContext';

export default function VJSelectorModal({ onClose }) {
  const [vjOptions, setVjOptions] = useState([]);
  const { chooseVj } = useVJ();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/movies/vjs').then((res) => setVjOptions(res.data));
  }, []);

  const handleSelect = (vj) => {
    chooseVj(vj);
    onClose();
    navigate(vj ? `/vj/${encodeURIComponent(vj)}` : '/home');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Choose a VJ</h2>
        <div className="vj-grid">
          <button onClick={() => handleSelect('')}>All VJs</button>
          {vjOptions.map((name) => (
            <button key={name} onClick={() => handleSelect(name)}>{name}</button>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
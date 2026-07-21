import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ streamUrl, startAt = 0, onProgress }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    let hls;
    setLoading(true);
    setPlayerError('');

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (startAt > 0) video.currentTime = startAt;
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setPlayerError('This video could not be loaded. Please try again later.');
          setLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        if (startAt > 0) video.currentTime = startAt;
      });
    }

    const interval = setInterval(() => {
      if (video && !video.paused && onProgress) {
        onProgress(Math.floor(video.currentTime));
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (hls) hls.destroy();
    };
  }, [streamUrl, startAt, onProgress]);

  return (
    <div className="video-wrapper">
      {loading && !playerError && <div className="video-loading">Loading video...</div>}
      {playerError && <div className="video-error">{playerError}</div>}
      <video ref={videoRef} controls autoPlay className="video-element" />
    </div>
  );
}
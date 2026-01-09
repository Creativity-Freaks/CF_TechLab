import { useEffect } from 'react';

export default function Chatbot() {
  useEffect(() => {
    const iframe = document.getElementById('cf-chatbot-iframe');
    if (!iframe) return;
    
    const handleMouseMove = (e) => {
      if (e.clientX > window.innerWidth - 150 && e.clientY > window.innerHeight - 150) {
        iframe.style.pointerEvents = 'auto';
      } else {
        iframe.style.pointerEvents = 'none';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <iframe
      id="cf-chatbot-iframe"
      src={`${import.meta.env.VITE_CHATBOT_WIDGET_URL || 'https://cf-techlab-bot-taaw.onrender.com/widget'}?v=${Date.now()}`}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: 999999,
        pointerEvents: 'none'
      }}
    />
  );
}
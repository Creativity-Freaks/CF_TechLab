import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    const iframe = document.getElementById("cf-chatbot-iframe") as HTMLIFrameElement | null;
    if (!iframe) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth - 150 && e.clientY > window.innerHeight - 150) {
        iframe.style.pointerEvents = "auto";
      } else {
        iframe.style.pointerEvents = "none";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const widgetUrl = (import.meta.env.VITE_CHATBOT_WIDGET_URL as string) || "https://cf-techlab-bot-taaw.onrender.com/widget";

  return (
    <iframe
      id="cf-chatbot-iframe"
      src={`${widgetUrl}?v=${Date.now()}`}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 999999,
        pointerEvents: "none",
      }}
    />
  );
}

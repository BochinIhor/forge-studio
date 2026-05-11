"use client";
import { useEffect, useRef } from "react";

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };

    const onDocEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onDocLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onLinkEnter = () => {
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.borderColor = "var(--gold)";
    };

    const onLinkLeave = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(201,168,76,0.5)";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onDocEnter);
    document.addEventListener("mouseleave", onDocLeave);

    const attachLinkListeners = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onLinkEnter);
        el.addEventListener("mouseleave", onLinkLeave);
      });
    };

    attachLinkListeners();

    const observer = new MutationObserver(attachLinkListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onDocEnter);
      document.removeEventListener("mouseleave", onDocLeave);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-gold pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full pointer-events-none opacity-0 transition-[width,height,border-color,opacity] duration-200"
        style={{
          willChange: "transform",
          border: "1px solid rgba(201,168,76,0.5)",
        }}
      />
    </>
  );
}

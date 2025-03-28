import { useEffect, useRef } from "react";

function App() {
  const imgRef = useRef(null);

  useEffect(() => {
    let angle = Math.PI / 2;
    let animationId;

    const animate = (time, lastTime) => {
      if (lastTime != null) {
        angle += (time - lastTime) * 0.001;
      }
      if (imgRef.current) {
        imgRef.current.style.top = `${Math.cos(angle) * 20 + 500}px`;
        imgRef.current.style.left = `${Math.sin(angle * 4) * 200}px`;
      }
      animationId = requestAnimationFrame((newTime) => animate(newTime, time));
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup function to cancel animation
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        <img
          ref={imgRef}
          src="img/react.svg"
          style={{ position: "relative" }}
          alt="React Logo"
        />
      </p>
    </div>
  );
}

export default App;

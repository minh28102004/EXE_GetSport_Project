import React, { useEffect, useRef, useState } from "react";

interface SportCourtBackgroundProps {
  theme?: "badminton" | "tennis";
  intensity?: "calm" | "moderate" | "energetic";
  showGrid?: boolean;
  animated?: boolean;
}

const SportCourtAnimatedBackground: React.FC<SportCourtBackgroundProps> = ({
  theme = "badminton",
  intensity = "moderate",
  showGrid = true,
  animated = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Theme configurations
  const themes = {
    badminton: {
      primary: "#14b8a6", // teal-500
      secondary: "#0d9488", // teal-600
      accent: "#06b6d4", // sky-500
      background: "from-teal-50 to-emerald-50",
      courtColor: "#14b8a6",
      lineColor: "#0d9488",
      particleColors: ["#14b8a6", "#0d9488", "#06b6d4", "#10b981"],
    },
    tennis: {
      primary: "#059669", // emerald-600
      secondary: "#047857", // emerald-700
      accent: "#84cc16", // lime-500
      background: "from-emerald-50 to-lime-50",
      courtColor: "#059669",
      lineColor: "#047857",
      particleColors: ["#059669", "#047857", "#84cc16", "#22c55e"],
    },
  };

  const currentTheme = themes[theme];

  // Floating elements (balls, shuttlecocks, etc.)
  class FloatingElement {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    type: "circle" | "shuttlecock" | "triangle";
    opacity: number;
    rotation: number;
    rotationSpeed: number;

    constructor(canvas: HTMLCanvasElement) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx =
        (Math.random() - 0.5) *
        (intensity === "calm" ? 0.5 : intensity === "energetic" ? 2 : 1);
      this.vy =
        (Math.random() - 0.5) *
        (intensity === "calm" ? 0.5 : intensity === "energetic" ? 2 : 1);
      this.size =
        Math.random() *
          (intensity === "calm" ? 8 : intensity === "energetic" ? 15 : 12) +
        3;
      this.color =
        currentTheme.particleColors[
          Math.floor(Math.random() * currentTheme.particleColors.length)
        ];
      this.type =
        Math.random() < 0.7
          ? "circle"
          : Math.random() < 0.5
          ? "shuttlecock"
          : "triangle";
      this.opacity = Math.random() * 0.4 + 0.1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update(canvas: HTMLCanvasElement) {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.01; // gravity
      this.rotation += this.rotationSpeed;

      // Khi chạm đáy -> nảy lên
      if (this.y + this.size >= canvas.height) {
        this.y = canvas.height - this.size;
        this.vy *= -0.6; // bật lên với lực yếu hơn
      }

      // Nếu hạt gần như đã dừng ở đáy -> giảm độ trong suốt
      if (this.y + this.size >= canvas.height - 2 && Math.abs(this.vy) < 0.5) {
        this.opacity -= 0.01; // mỗi frame mờ dần
      }

      // Khi hạt biến mất hoàn toàn -> reset lại từ trên
      if (this.opacity <= 0) {
        this.x = Math.random() * canvas.width;
        this.y = -this.size;
        this.vy = Math.random() * 2 + 2; // tốc độ rơi ban đầu
        this.opacity = Math.random() * 0.5 + 0.5; // reset opacity
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      switch (this.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          // Add inner glow
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
          gradient.addColorStop(0, this.color + "80");
          gradient.addColorStop(1, this.color + "00");
          ctx.fillStyle = gradient;
          ctx.fill();
          break;

        case "shuttlecock":
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            this.size * 0.8,
            this.size * 1.2,
            0,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = this.color;
          ctx.fill();

          // Feathers
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.6);
            ctx.lineTo(this.size * 0.3, -this.size * 1.2);
            ctx.lineTo(-this.size * 0.3, -this.size * 1.2);
            ctx.closePath();
            ctx.fillStyle = this.color + "60";
            ctx.fill();
            ctx.restore();
          }
          break;

        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.lineTo(-this.size * 0.8, this.size * 0.6);
          ctx.lineTo(this.size * 0.8, this.size * 0.6);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  // Court grid lines
  const drawCourtGrid = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (!showGrid) return;

    ctx.save();
    ctx.strokeStyle = currentTheme.lineColor + "20";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 20]);

    // Vertical lines
    for (let x = 0; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animated) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: canvas.width, height: canvas.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Create floating elements
    const elementCount =
      intensity === "calm" ? 15 : intensity === "energetic" ? 40 : 25;
    const elements: FloatingElement[] = [];

    for (let i = 0; i < elementCount; i++) {
      elements.push(new FloatingElement(canvas));
    }

    let animationId: number;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw court grid
      drawCourtGrid(ctx, canvas);

      // Update and draw floating elements
      elements.forEach((element) => {
        element.update(canvas);
        element.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [theme, intensity, showGrid, animated]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* CSS Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.background} opacity-60`}
      />

      {/* Decorative CSS Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner glows */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${currentTheme.primary}40, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${currentTheme.accent}40, transparent)`,
          }}
        />
      </div>

      {/* Canvas for complex animations */}
      {animated && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: intensity === "calm" ? 0.6 : 0.8 }}
        />
      )}

      {/* Static grid fallback */}
      {!animated && showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${currentTheme.lineColor}40 1px, transparent 1px),
              linear-gradient(90deg, ${currentTheme.lineColor}40 1px, transparent 1px)
            `,
            backgroundSize: "100px 80px",
          }}
        />
      )}
    </div>
  );
};

export default SportCourtAnimatedBackground;

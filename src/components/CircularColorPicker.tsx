import { useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';

interface CircularColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: number;
}

export const CircularColorPicker = ({ value, onChange, size = 200 }: CircularColorPickerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;

      for (let r = 0; r <= radius; r += 1) {
        const saturation = r / radius;
        const color = chroma.hsl(angle, saturation, 0.7).hex();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.stroke();
      }
    }

    // Draw outer border
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const getColorFromPosition = (x: number, y: number): string => {
    const canvas = canvasRef.current;
    if (!canvas) return value;

    const rect = canvas.getBoundingClientRect();
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    const mouseX = x - rect.left - centerX;
    const mouseY = y - rect.top - centerY;
    
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    if (distance > radius) return value;

    const angle = (Math.atan2(mouseY, mouseX) * 180) / Math.PI;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    const saturation = Math.min(distance / radius, 1);

    return chroma.hsl(normalizedAngle, saturation, 0.7).hex();
  };

  const drawSelector = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const color = chroma(value);
      const [h, s, l] = color.hsl();
      
      if (isNaN(h) || isNaN(s)) return;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size / 2 - 10) * s;
      const angle = (h * Math.PI) / 180;

      const selectorX = centerX + radius * Math.cos(angle);
      const selectorY = centerY + radius * Math.sin(angle);

      // Draw selector circle
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(selectorX, selectorY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing selector:', error);
    }
  };

  useEffect(() => {
    drawColorWheel();
    drawSelector();
  }, [value, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const newColor = getColorFromPosition(e.clientX, e.clientY);
    onChange(newColor);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newColor = getColorFromPosition(e.clientX, e.clientY);
    onChange(newColor);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newColor = getColorFromPosition(e.clientX, e.clientY);
        onChange(newColor);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, onChange]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair border border-border rounded-full shadow-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="text-center">
        <div
          className="w-8 h-8 rounded border-2 border-white shadow-sm mx-auto mb-2"
          style={{ backgroundColor: value }}
        />
        <p className="text-sm font-mono text-muted-foreground">{value.toUpperCase()}</p>
      </div>
    </div>
  );
};
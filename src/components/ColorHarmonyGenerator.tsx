import { useState, useEffect } from 'react';
import { Shuffle, Palette, Download } from 'lucide-react';
import chroma from 'chroma-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPalette } from '@/components/ColorPalette';
import { CircularColorPicker } from '@/components/CircularColorPicker';
import { useColorHarmonies } from '@/hooks/useColorHarmonies';
import { exportPaletteToPDF } from '@/utils/pdfExport';
import { cn } from '@/lib/utils';

export const ColorHarmonyGenerator = () => {
  const [inputColor, setInputColor] = useState('#6366f1');
  const [isValidColor, setIsValidColor] = useState(true);
  
  const harmonies = useColorHarmonies(inputColor);

  // Update CSS custom properties for dynamic theming
  useEffect(() => {
    try {
      const color = chroma(inputColor);
      const hsl = color.hsl();
      
      const root = document.documentElement;
      root.style.setProperty('--dynamic-primary', `${hsl[0] || 240} ${(hsl[1] || 1) * 100}% ${Math.max(50, Math.min(80, (hsl[2] || 0.7) * 100))}%`);
      root.style.setProperty('--dynamic-primary-muted', `${hsl[0] || 240} ${(hsl[1] || 1) * 100}% ${Math.max(70, Math.min(90, (hsl[2] || 0.7) * 100 + 20))}%`);
      root.style.setProperty('--dynamic-primary-dark', `${hsl[0] || 240} ${(hsl[1] || 1) * 100}% ${Math.max(20, Math.min(50, (hsl[2] || 0.7) * 100 - 20))}%`);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [inputColor]);

  const validateColor = (color: string): boolean => {
    try {
      chroma(color);
      return true;
    } catch {
      return false;
    }
  };

  const handleColorChange = (value: string) => {
    const valid = validateColor(value);
    setIsValidColor(valid);
    if (valid) {
      setInputColor(value);
    }
  };

  const generateRandomColor = () => {
    const randomColor = chroma.random().hex();
    setInputColor(randomColor);
    setIsValidColor(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-dynamic-primary/20 border border-dynamic-primary/30">
              <Palette className="w-8 h-8 text-dynamic-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Color Harmony Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover beautiful color palettes and harmonies. Enter a HEX color or generate random combinations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 animate-scale-in">
          <div className="bg-card border border-border rounded-lg p-8 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Circular Color Picker */}
              <div className="flex justify-center">
                <CircularColorPicker
                  value={inputColor}
                  onChange={setInputColor}
                  size={200}
                />
              </div>
              
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="color-input" className="block text-sm font-medium text-foreground mb-3">
                    HEX Color
                  </label>
                  <Input
                    id="color-input"
                    type="text"
                    value={inputColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#6366f1"
                    className={cn(
                      "font-mono transition-all duration-200",
                      !isValidColor && "border-destructive focus:ring-destructive"
                    )}
                    aria-describedby={!isValidColor ? "color-error" : undefined}
                  />
                  {!isValidColor && (
                    <p id="color-error" className="text-sm text-destructive mt-2">
                      Please enter a valid HEX color (e.g., #6366f1)
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={generateRandomColor}
                    variant="dynamic-outline"
                    size="default"
                    className="flex-1"
                    aria-label="Generate random color"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Random Color
                  </Button>
                  
                  <Button
                    onClick={() => exportPaletteToPDF(harmonies, inputColor)}
                    variant="dynamic"
                    size="default"
                    className="flex-1"
                    aria-label="Export palette as PDF"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Harmonies Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {harmonies.map((harmony, index) => (
            <div
              key={harmony.name}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ColorPalette
                title={harmony.name}
                description={harmony.description}
                colors={harmony.colors}
              />
            </div>
          ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8">
          <p className="text-muted-foreground">
            Click any color to copy its HEX value to clipboard
          </p>
        </div>
      </div>
    </div>
  );
};
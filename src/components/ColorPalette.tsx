import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ColorPaletteProps {
  colors: string[];
  title: string;
  description?: string;
}

export const ColorPalette = ({ colors, title, description }: ColorPaletteProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${hex} copied to clipboard`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card transition-all duration-300 hover:shadow-glow group">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div className={`grid gap-2 ${
        colors.length === 2 ? 'grid-cols-2' : 
        colors.length === 3 ? 'grid-cols-3' : 
        colors.length === 4 ? 'grid-cols-4' : 
        'grid-cols-5'
      }`}>
        {colors.map((color, index) => (
          <div
            key={index}
            className="relative group/color"
          >
            <button
              onClick={() => copyToClipboard(color, index)}
              className={cn(
                "w-full h-16 rounded-md border-2 border-transparent transition-all duration-200",
                "hover:border-dynamic-primary hover:scale-105 hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-dynamic-primary focus:ring-offset-2 focus:ring-offset-background",
                "relative overflow-hidden"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Copy color ${color}`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-200" />
                ) : (
                  <Copy className="w-4 h-4 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-200" />
                )}
              </div>
            </button>
            
            <div className="mt-2 text-center">
              <button
                onClick={() => copyToClipboard(color, index)}
                className="text-xs font-mono text-muted-foreground hover:text-dynamic-primary transition-colors duration-200 cursor-pointer"
              >
                {color.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
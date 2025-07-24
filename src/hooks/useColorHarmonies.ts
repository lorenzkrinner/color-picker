import { useMemo } from 'react';
import chroma from 'chroma-js';

export interface ColorHarmony {
  name: string;
  description: string;
  colors: string[];
}

export const useColorHarmonies = (baseColor: string): ColorHarmony[] => {
  return useMemo(() => {
    try {
      const color = chroma(baseColor);
      const hue = color.get('hsl.h') || 0;
      
      return [
        {
          name: 'Monochromatic',
          description: 'Different shades and tints of the same color',
          colors: [
            color.hex(),
            color.darken(1).hex(),
          ],
        },
        {
          name: 'Complementary',
          description: 'Colors opposite on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 180) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Analogous',
          description: 'Colors adjacent on the color wheel',
          colors: [
            chroma.hsl((hue - 30 + 360) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            color.hex(),
            chroma.hsl((hue + 30) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Triadic',
          description: 'Three colors evenly spaced on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 120) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 240) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Tetradic',
          description: 'Four colors forming a rectangle on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 90) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 180) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 270) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
      ];
    } catch (error) {
      // Return default harmonies if color is invalid
      const defaultColor = '#6366f1';
      const color = chroma(defaultColor);
      const hue = color.get('hsl.h') || 0;
      
      return [
        {
          name: 'Monochromatic',
          description: 'Different shades and tints of the same color',
          colors: [
            color.hex(),
            color.darken(1).hex(),
          ],
        },
        {
          name: 'Complementary',
          description: 'Colors opposite on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 180) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Analogous',
          description: 'Colors adjacent on the color wheel',
          colors: [
            chroma.hsl((hue - 30 + 360) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            color.hex(),
            chroma.hsl((hue + 30) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Triadic',
          description: 'Three colors evenly spaced on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 120) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 240) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
        {
          name: 'Tetradic',
          description: 'Four colors forming a rectangle on the color wheel',
          colors: [
            color.hex(),
            chroma.hsl((hue + 90) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 180) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
            chroma.hsl((hue + 270) % 360, color.get('hsl.s'), color.get('hsl.l')).hex(),
          ],
        },
      ];
    }
  }, [baseColor]);
};
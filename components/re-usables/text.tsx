import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  bold?: boolean;
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  align?: 'left' | 'center' | 'right' | 'justify';
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
}

const variantStyles = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: undefined },
  h2: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36, letterSpacing: undefined },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, letterSpacing: undefined },
  h4: { fontSize: 20, fontWeight: '500' as const, lineHeight: 28, letterSpacing: undefined },
  h5: { fontSize: 18, fontWeight: '500' as const, lineHeight: 24, letterSpacing: undefined },
  h6: { fontSize: 16, fontWeight: '500' as const, lineHeight: 22, letterSpacing: undefined },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, letterSpacing: undefined },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, letterSpacing: undefined },
  overline: { fontSize: 10, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 1.5 },
} as const;

export const Text: React.FC<TextProps> = ({
  children,
  size,
  color = '#1F2937',
  bold,
  weight,
  align = 'left',
  underline,
  lineThrough,
  uppercase,
  lowercase,
  capitalize,
  lineHeight,
  letterSpacing,
  opacity = 1,
  variant,
  style,
  ...props
}) => {
  const getTextDecorationLine = () => {
    const decorations = [];
    if (underline) decorations.push('underline');
    if (lineThrough) decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  };

  const getTextTransform = () => {
    if (uppercase) return 'uppercase';
    if (lowercase) return 'lowercase';
    if (capitalize) return 'capitalize';
    return 'none';
  };

  const getFontWeight = () => {
    if (bold) return '700';
    if (weight) return weight;
    return '400';
  };
  const getFontFamily = () => {
    if (bold) return 'Poppins-Bold';
    return 'Poppins-Regular';
  };

  const getFontSize = () => {
    if (size) return size;
    if (variant) return variantStyles[variant].fontSize;
    return 16;
  };

  const getLineHeight = () => {
    if (lineHeight) return lineHeight;
    if (variant) return variantStyles[variant].lineHeight;
    return undefined;
  };

  const getLetterSpacing = () => {
    if (letterSpacing !== undefined) return letterSpacing;
    if (variant && variantStyles[variant].letterSpacing)
      return variantStyles[variant].letterSpacing;
    return undefined;
  };

  const textStyle = [
    {
      fontSize: getFontSize(),
      color,
      fontWeight: getFontWeight(),
      textAlign: align,
      textDecorationLine: getTextDecorationLine(),
      textTransform: getTextTransform(),
      lineHeight: getLineHeight(),
      letterSpacing: getLetterSpacing(),
      opacity,
      fontFamily: getFontFamily(),
    },
  ];

  return (
    <RNText style={[textStyle as any, style]} {...props}>
      {children}
    </RNText>
  );
};


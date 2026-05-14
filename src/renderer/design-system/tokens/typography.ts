export interface TypographyToken {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
}

export const typography: Record<string, TypographyToken> = {
  h1: { fontSize: '34px', lineHeight: '42px', fontWeight: 700 },
  h2: { fontSize: '28px', lineHeight: '36px', fontWeight: 600 },
  h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
  h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
  body: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
  caption: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
  small: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
};

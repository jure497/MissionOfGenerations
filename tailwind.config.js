/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // New design system colors
        primary: '#577137', // green
        cream: '#efede8', // cream background
        warmBrown: '#895a38', // warm brown
        lightStone: '#e4ded0', // light stone
        accent: '#f2ce80', // yellow accent
        textDark: '#1f2a1f', // dark text
        textMuted: '#4a4a44', // muted text
        textLight: '#6b6b63', // light text

        // Legacy colors for compatibility
        bg_color: '#EFEDE8',
        header_color: '#5A3731',
        green_color: '#577137',
        hero_btn_color: '#577137',
        cards_matter_color: 'white',
        yellow_color: '#f2ce80'
      },

      lineHeight: {
        'relaxed': '1.6',
        'loose': '1.7',
      },
      fontFamily: {
        'sans': ['Nunito', 'system-ui', 'sans-serif'],
        'rounded': ['Nunito', 'Manrope', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
};

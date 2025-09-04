/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 50%, 47%)',
        accent: 'hsl(13, 76%, 63%)',
        background: 'hsl(210, 36%, 96%)',
        surface: 'hsl(0, 0%, 100%)',
        dark: {
          bg: '#0F0825',
          surface: '#1A1240',
          card: '#2A1B5C',
          primary: '#6366F1',
          accent: '#F59E0B',
          text: '#F8FAFC',
          muted: '#94A3B8'
        }
      },
      borderRadius: {
        lg: '16px',
        md: '10px',
        sm: '6px',
      },
      spacing: {
        lg: '20px',
        md: '12px',
        sm: '8px',
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        'dark-card': '0 8px 25px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [],
}
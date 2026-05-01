/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: 'var(--accent-blue)',
        success: 'var(--accent-emerald)',
        warning: '#f59e0b',
        main: 'var(--text-main)',
        bold: 'var(--text-bold)',
        muted: 'var(--text-muted)',
        deep: 'var(--bg-deep)',
        surface: 'var(--bg-slate)',
      }
    },
  },
}

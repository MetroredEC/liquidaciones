/**
 * Tailwind CSS configuration file.
 *
 * Extends the default Tailwind palette with Metrored corporate colors
 * and enables form styles via the @tailwindcss/forms plugin. The
 * content globs target all HTML and React source files so unused
 * classes can be purged in production builds.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: '#00B7D3',
        blue: '#135EA7',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          DEFAULT: '#6B7280',
        },
        grayLight: '#E5E7EB',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
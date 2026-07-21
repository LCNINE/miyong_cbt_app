/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // 화해(Hwahae) 디자인 토큰
      colors: {
        brand: {
          DEFAULT: '#00d5ce', // Hwahae Turquoise
          bright: '#22d3d6',
          deep: '#00a5aa', // hover
          tint: '#eefbfb', // Mint Tint
        },
        ink: {
          DEFAULT: '#111111', // Ink Soft
          black: '#000000',
        },
        body: '#3d3d3d',
        muted: '#666666',
        faint: '#999999',
        placeholder: '#aaaaaa',
        canvas: '#f7f7f7', // Surface Grey
        line: '#e8e8e8', // Hairline
        divider: '#d8d8d8',
        amber: '#ffaa3c', // Rating
        info: '#467dff', // Action Blue
        alert: '#ff5555',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.08) 0px 2px 8px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      screens: {
        xs: { max: '350px' }, // 350px 이하에 적용할 새로운 브레이크포인트
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

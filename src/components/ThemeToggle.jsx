import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  // Initialize from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDark])

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-lg px-3 py-2 text-white/90 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
      onClick={() => setIsDark(v => !v)}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
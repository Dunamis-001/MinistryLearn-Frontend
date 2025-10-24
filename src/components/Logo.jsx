export default function Logo({ className = "h-8 w-8 text-primary-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="MinistryLearn">
      <path d="M3 5.5C3 4.12 4.12 3 5.5 3H12v18H5.5A2.5 2.5 0 0 1 3 18.5v-13zM21 5.5V19a2 2 0 0 1-2 2h-7V3h7a2 2 0 0 1 2 2.5zM6 6h4v10H6a1 1 0 0 0-1 1V7a1 1 0 0 1 1-1zm9 0h3v12h-3z"/>
    </svg>
  )
}
export default function Logo({ className = "h-12 w-12 text-white", useImage = false, imageSrc = "/logo.png" }) {
  // If useImage is true, use the image file, otherwise use the SVG
  if (useImage) {
    // Ensure the path starts with / for Vite public folder
    const logoPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
    
    return (
      <div className={className}>
        <img 
          src={logoPath} 
          alt="MinistryLearn Logo" 
          className="w-full h-full object-contain"
          style={{ display: 'block' }}
          onError={(e) => {
            console.error('Logo image failed to load. Path:', logoPath, 'Full URL:', window.location.origin + logoPath);
            // Fallback to SVG if image fails
            e.target.style.display = 'none';
          }}
          onLoad={() => {
            console.log('Logo image loaded successfully:', logoPath);
          }}
        />
      </div>
    )
  }

  // Default SVG logo - uses currentColor so it can be styled via CSS
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path 
          d="M 30 20 L 30 80 M 30 20 L 50 20 Q 60 20 60 30 Q 60 40 50 40 L 30 40 M 50 40 L 60 50 L 50 60 L 30 60" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />
      </svg>
    </div>
  )
}

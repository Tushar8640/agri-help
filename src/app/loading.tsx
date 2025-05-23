// Simplified and more appropriate loading component
export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          {/* Agricultural-themed spinner */}
          <svg 
            className="w-16 h-16 text-green-600 animate-spin mx-auto" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
            <path 
              fill="currentColor" 
              d="M12 6c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6z"
            />
          </svg>
        </div>
      </div>
    )
  }
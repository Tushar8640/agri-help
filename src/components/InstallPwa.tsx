'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true ||
                      document.referrer.includes('android-app://') ||
                      window.matchMedia('(display-mode: fullscreen)').matches

    setIsStandalone(standalone)

    // Handle the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)
      setShowInstallBanner(true)
    }

    // Listen for the install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setInstallPrompt(null)
      setShowInstallBanner(false)
      console.log('PWA was installed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    try {
      // Show the install prompt
      await installPrompt.prompt()
      
      // Wait for the user's response
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowInstallBanner(false)
      } else {
        console.log('User dismissed the install prompt')
      }
      
      // Clear the saved prompt since it can only be used once
      setInstallPrompt(null)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const dismissBanner = () => {
    setShowInstallBanner(false)
    // Optionally store in localStorage to remember user's choice
    localStorage.setItem('installPromptDismissed', 'true')
  }

  // Don't show anything if app is already installed
  if (isStandalone) {
    return null
  }

  return (
    <>
      {/* Install Banner - shows at top of page */}
      {showInstallBanner && (installPrompt || isIOS) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded p-1">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 2a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Install Our App</p>
                <p className="text-sm opacity-90">Get the full experience with offline access</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
                >
                  Install
                </button>
              )}
              <button
                onClick={dismissBanner}
                className="text-white hover:bg-blue-700 p-1 rounded"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Card - shows in main content */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Install App</h3>
            
            {installPrompt && (
              <div className="mb-4">
                <p className="text-gray-600 mb-3">
                  Install this app on your device for a better experience with offline access and faster loading.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <span>Add to Home Screen</span>
                </button>
              </div>
            )}
            
            {isIOS && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Install on iOS:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Tap the Share button <span className="font-mono bg-blue-100 px-1 rounded">⎋</span></li>
                  <li>2. Scroll down and tap Add to Home Screen <span className="font-mono bg-blue-100 px-1 rounded">➕</span></li>
                  <li>3. Tap Add in the top right corner</li>
                </ol>
              </div>
            )}
            
            {!installPrompt && !isIOS && (
              <div className="text-gray-600">
                <p className="mb-2">To install this app:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li><strong>Chrome/Edge:</strong> Click the install icon in the address bar</li>
                  <li><strong>Firefox:</strong> Look for the install option in the menu</li>
                  <li><strong>Safari:</strong> Use Share → Add to Home Screen</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Simple Install Button Component (for toolbar/header)
export function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true

    setIsStandalone(standalone)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
    } catch (error) {
      console.error('Install error:', error)
    }
  }

  // Don't show if already installed or no install prompt available
  if (isStandalone || !installPrompt) {
    return null
  }

  return (
    <button
      onClick={handleInstall}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <span>Install App</span>
    </button>
  )
}
'use client'

import { getSubscriptionCount, sendNotification, subscribeUser, unsubscribeUser } from '@/app/action'
import { useState, useEffect } from 'react'


// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Push Notification Manager Component
export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [subscriptionCount, setSubscriptionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
      updateSubscriptionCount()
      console.log('serviceWorker' in navigator && 'PushManager' in window, "Service Worker and PushManager supported")
    }
  }, [])

  async function updateSubscriptionCount() {
    try {
      const result = await getSubscriptionCount()
      setSubscriptionCount(result.count)
    } catch (error) {
      console.error('Error getting subscription count:', error)
    }
  }

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
      
      console.log('Service Worker registered:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  async function subscribeToPush() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      
      setSubscription(sub)
      const serializedSub = JSON.parse(JSON.stringify(sub))
      await subscribeUser(serializedSub)
      await updateSubscriptionCount()
      
      console.log('User subscribed to push notifications')
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true)
    try {
      await subscription?.unsubscribe()
      setSubscription(null)
      await unsubscribeUser(subscription?.endpoint)
      await updateSubscriptionCount()
      
      console.log('User unsubscribed from push notifications')
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function sendTestNotification() {
    if (!message.trim()) return
    
    setIsLoading(true)
    try {
      const result = await sendNotification(message, title || 'Test Notification')
      console.log('Notification sent:', result)
      setMessage('')
      setTitle('')
    } catch (error) {
      console.error('Error sending notification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">Push notifications are not supported in this browser.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">Total subscriptions: {subscriptionCount}</p>
      
      {subscription ? (
        <div className="space-y-4">
          <p className="text-green-600 font-medium">✅ You are subscribed to push notifications.</p>
          
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Notification title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={sendTestNotification}
              disabled={!message.trim() || isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Test Notification'}
            </button>
            <button
              onClick={unsubscribeFromPush}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">You are not subscribed to push notifications.</p>
          <button
            onClick={subscribeToPush}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Notifications'}
          </button>
        </div>
      )}
    </div>
  )
}

// Install Prompt Component
export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    const result = await installPrompt.prompt()
    console.log('Install prompt result:', result)
    setInstallPrompt(null)
  }

  if (isStandalone) {
    return (
      <div className="p-4 bg-green-100 border border-green-400 rounded">
        <p className="text-green-800">✅ App is installed and running in standalone mode!</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Install App</h3>
      
      {installPrompt && (
        <button
          onClick={handleInstallClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Add to Home Screen
        </button>
      )}
      
      {isIOS && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon" className="mx-1">⎋</span>
            and then Add to Home Screen
            <span role="img" aria-label="plus icon" className="mx-1">➕</span>
          </p>
        </div>
      )}
      
      {!installPrompt && !isIOS && (
        <p className="text-gray-600">
          Installation prompt will appear when criteria are met or you can install manually through your browser menu.
        </p>
      )}
    </div>
  )
}

// PWA Status Component
export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setSwRegistration(registration || null)
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">PWA Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${swRegistration ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Service Worker: {swRegistration ? 'Registered' : 'Not Registered'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${'PushManager' in window ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Push API: {'PushManager' in window ? 'Supported' : 'Not Supported'}</span>
        </div>
        
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${'Notification' in window ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Notifications: {'Notification' in window ? 'Supported' : 'Not Supported'}</span>
        </div>
      </div>
    </div>
  )
}
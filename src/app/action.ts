'use server'
 
import webpush from 'web-push'
 
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
 
// In production, use a database instead of memory storage
let subscriptions: PushSubscription[] = []
 
export async function subscribeUser(sub: PushSubscription) {
  // Remove existing subscription if it exists
  subscriptions = subscriptions.filter(
    (subscription: any) => subscription.endpoint !== (sub as any).endpoint
  )
  // Add new subscription
  subscriptions.push(sub)
  console.log('User subscribed:', sub.endpoint)
  return { success: true }
}
 
export async function unsubscribeUser(endpoint?: string) {
  if (endpoint) {
    subscriptions = subscriptions.filter((sub: any) => sub.endpoint !== endpoint)
  } else {
    subscriptions = []
  }
  console.log('User unsubscribed')
  return { success: true }
}
 
export async function sendNotification(message: string, title: string = 'PWA Notification') {
  if (subscriptions.length === 0) {
    throw new Error('No subscriptions available')
  }
 
  const notificationPayload = JSON.stringify({
    title,
    body: message,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'pwa-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-72x72.png'
      }
    ]
  })
 
  const sendPromises = subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, notificationPayload)
      return { success: true, endpoint: (subscription as any).endpoint }
    } catch (error) {
      console.error('Error sending push notification:', error)
      // Remove invalid subscriptions
      subscriptions = subscriptions.filter((sub: any) => sub.endpoint !== (subscription as any).endpoint)
      return { success: false, error: 'Failed to send notification', endpoint: (subscription as any).endpoint }
    }
  })
 
  const results = await Promise.all(sendPromises)
  return { 
    success: true, 
    results,
    totalSent: results.filter(r => r.success).length,
    totalFailed: results.filter(r => !r.success).length
  }
}

export async function getSubscriptionCount() {
  return { count: subscriptions.length }
}
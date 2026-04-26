export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export async function requestPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

export async function showNotification(
  title: string,
  body: string,
  tag: string,
): Promise<void> {
  if (getPermissionStatus() !== 'granted') return

  const options: NotificationOptions = {
    body,
    tag,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    requireInteraction: true,
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready.catch(() => null)
    if (registration) {
      await registration.showNotification(title, options)
      return
    }
  }

  new Notification(title, options)
}

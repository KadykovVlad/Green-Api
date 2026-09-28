import { useEffect, useRef } from 'react'
import axios from 'axios'

/**
 * Цикл получения уведомлений через HTTP API:
 * receiveNotification -> обработка -> deleteNotification -> снова.
 * Уведомление удаляем в любом случае, иначе очередь встанет на нём.
 */
export default function useNotifications(api, onNotification) {
  // Храним колбэк в ref, чтобы не перезапускать цикл на каждый рендер
  const handlerRef = useRef(onNotification)
  handlerRef.current = onNotification

  useEffect(() => {
    const controller = new AbortController()

    const poll = async () => {
      while (!controller.signal.aborted) {
        try {
          const data = await api.receiveNotification(controller.signal)
          if (!data) continue

          try {
            handlerRef.current(data.body)
          } catch (error) {
            console.error('Не удалось обработать уведомление', data.body, error)
          }
          await api.deleteNotification(data.receiptId)
        } catch (error) {
          if (axios.isCancel(error)) return
          // Сеть/429 — ждём немного и пробуем снова
          await new Promise((resolve) => setTimeout(resolve, 3000))
        }
      }
    }

    poll()
    return () => controller.abort()
  }, [api])
}

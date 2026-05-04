import { useEffect, useRef, useCallback } from 'react'

interface WebSocketHandlers {
  onCapacityUpdate?: (event: any) => void
  onAccessEvent?:    (event: any) => void
  onAlert?:          (event: any) => void
}

export function useWebSocket(
  handlers: WebSocketHandlers,
  enabled = true
) {
  const clientRef    = useRef<any>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>()

  const connect = useCallback(async () => {
    if (!enabled) return
    try {
      const [{ Client }, { default: SockJS }] = await Promise.all([
        import('@stomp/stompjs'),
        import('sockjs-client'),
      ])
      const client = new Client({
        webSocketFactory: () => new SockJS('/ws-room911'),
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe('/topic/room.capacity', msg => {
            handlers.onCapacityUpdate?.(JSON.parse(msg.body))
          })
          client.subscribe('/topic/access.event', msg => {
            handlers.onAccessEvent?.(JSON.parse(msg.body))
          })
          client.subscribe('/topic/alerts', msg => {
            handlers.onAlert?.(JSON.parse(msg.body))
          })
        },
      })
      client.activate()
      clientRef.current = client
    } catch (err) {
      reconnectRef.current = setTimeout(connect, 5000)
    }
  }, [enabled])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectRef.current)
      clientRef.current?.deactivate()
    }
  }, [connect])
}
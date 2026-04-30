import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(onCapacityUpdate: (data: any) => void) {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws-room911'),
      onConnect: () => {
        client.subscribe('/topic/room.capacity', (msg) => {
          onCapacityUpdate(JSON.parse(msg.body));
        });
      },
    });
    client.activate();
    return () => { client.deactivate(); };
  }, []);
}
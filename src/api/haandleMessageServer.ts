import type {WebSocketInstance, WebSocketMessage} from '../types/websocketTypes';
import { useEffect, useState } from 'react';


export const useMessageStatuses = (ws: WebSocketInstance) => {
  const [statuses, setStatuses] = useState<Record<string, { isDelivered?: boolean; isReaded?: boolean }>>({});

  useEffect(() => {
    if (!ws) return;

    const unsubscribe = ws.onMessage((message: WebSocketMessage) => {
      if (message.type === 'MSG_READ' && message.id === null) {
        const { id, status } = message.payload.message;
        setStatuses(prev => ({
          ...prev,
          [id]: { ...prev[id], isReaded: status.isReaded },
        }));
      }
    });

    return () => unsubscribe();
  }, [ws]);

  return { statuses };
};

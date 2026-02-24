import { useState, useRef, useCallback, useEffect } from 'react';
import type { MessageCallback, WebSocketMessage} from '../types/websocketTypes';
const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000;

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<MessageCallback[]>([]);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualDisconnectRef = useRef(false);
  const reconnectAttemptRef = useRef(0);

  const connectRef = useRef<() => Promise<void> | undefined>(undefined);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    return new Promise<void>((res, rej) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        res();
        return;
      }

      isManualDisconnectRef.current = false;

      try {
        const socket = new WebSocket(`ws://localhost:4000`);
        wsRef.current = socket;

        socket.onopen = () => {
          console.log('✅ WebSocket подключен');
          setIsConnected(true);

          reconnectAttemptRef.current = 0;
          setReconnectAttempt(0);

          clearReconnectTimer();
          res();
        };

        socket.onerror = error => {
          console.error('❌ WebSocket ошибка:', error);
          setIsConnected(false);
          rej(error);
        };

        socket.onclose = () => {
          console.log('🔌 WebSocket закрыт');
          setIsConnected(false);

          if (!isManualDisconnectRef.current) {
            const currentAttempt = reconnectAttemptRef.current;

            if (currentAttempt < MAX_RECONNECT_ATTEMPTS) {
              const nextAttempt = currentAttempt + 1;
              const delay = BASE_RECONNECT_DELAY * Math.pow(2, currentAttempt);

              console.log(
                `🔄 Переподключение через ${delay / 1000}с... (попытка ${nextAttempt}/${MAX_RECONNECT_ATTEMPTS})`
              );

              reconnectAttemptRef.current = nextAttempt;
              setReconnectAttempt(nextAttempt);

              reconnectTimerRef.current = setTimeout(() => {
                connectRef.current?.();
              }, delay);
            } else {
              console.error('💀 Все попытки переподключения исчерпаны');
            }
          }
        };

        socket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            messageHandlersRef.current.forEach(handler => handler(data));
          } catch (error) {
            console.error('Ошибка парсинга сообщения:', error);
          }
        };
      } catch (error) {
        setIsConnected(false);
        rej(error);
      }
    });
  }, [clearReconnectTimer]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket не подключен');
    }
  }, []);

  const onMessage = useCallback((handler: MessageCallback) => {
    messageHandlersRef.current.push(handler);

    return () => {
      messageHandlersRef.current = messageHandlersRef.current.filter(h => h !== handler);
    };
  }, []);

  const disconnect = useCallback(() => {
    console.log('👋 Намеренное отключение');
    isManualDisconnectRef.current = true;
    clearReconnectTimer();

    if (wsRef.current) {
      const state = wsRef.current.readyState;

      if (state === WebSocket.CONNECTING) {
        wsRef.current.onopen = () => wsRef.current?.close();
      } else if (state === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }

    wsRef.current = null;
    setIsConnected(false);
    setReconnectAttempt(0);
    reconnectAttemptRef.current = 0;
  }, [clearReconnectTimer]);

  return {
    isConnected,
    reconnectAttempt,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
    connect,
    sendMessage,
    onMessage,
    disconnect,
  };
};

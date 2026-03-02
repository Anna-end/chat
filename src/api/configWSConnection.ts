import { useRef, useCallback, useEffect } from 'react';
import type { MessageCallback, WebSocketMessage} from '../types/websocketTypes';
import { useAppDispatch } from '../store/hooks';
import { setConnected, setReconnectAttempt } from '../store/features/chat/chatSlice';

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000;

export const useWebSocket = () => {
  const dispatch = useAppDispatch();

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
          dispatch(setConnected(true)); 
          reconnectAttemptRef.current = 0;
          setReconnectAttempt(0);
          dispatch(setReconnectAttempt(0));
          clearReconnectTimer();
          res();
        };

        socket.onerror = error => {
          console.error('❌ WebSocket ошибка:', error);
          dispatch(setConnected(false));
          rej(error);
        };

        socket.onclose = () => {
          console.log('🔌 WebSocket закрыт');
          dispatch(setConnected(false));

          if (!isManualDisconnectRef.current) {
            const currentAttempt = reconnectAttemptRef.current;

            if (currentAttempt < MAX_RECONNECT_ATTEMPTS) {
              const nextAttempt = currentAttempt + 1;
              const delay = BASE_RECONNECT_DELAY * Math.pow(2, currentAttempt);

              console.log(
                `🔄 Переподключение через ${delay / 1000}с... (попытка ${nextAttempt}/${MAX_RECONNECT_ATTEMPTS})`
              );

              reconnectAttemptRef.current = nextAttempt;
              dispatch(setReconnectAttempt(nextAttempt));
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
        dispatch(setConnected(false));
        rej(error);
      }
    });
  }, [clearReconnectTimer, dispatch])

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
    dispatch(setConnected(false));
    dispatch(setReconnectAttempt(0));
    reconnectAttemptRef.current = 0;
  }, [clearReconnectTimer, dispatch]);

  return {
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
    connect,
    sendMessage,
    onMessage,
    disconnect,
  };
};

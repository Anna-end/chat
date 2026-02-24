import { useContext } from 'react'
import {WebSocketContext} from '../useContext/Contexts';
import type { WebSocketInstance } from '../types/websocketTypes';

export function useWSData(): WebSocketInstance {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWSData must be used within a WebSocketProvider');
  }

  return context;
}
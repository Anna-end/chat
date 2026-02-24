import type{ WebSocketMessage } from './websocketTypes';
export interface ServerErrorResponse {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
}

export const isServerError = (
  message: WebSocketMessage,
  requestId: string
): message is ServerErrorResponse => {
  return message.type === 'ERROR' && message.id === requestId;
};
import type { ServerErrorResponse } from './errorsType';

export interface HistoryMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export interface UserLoginRequest {
  id: string;
  type: 'USER_LOGIN';
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface UserLoginResponse {
  id: string;
  type: 'USER_LOGIN';
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface UserLogoutRequest {
  id: string;
  type: 'USER_LOGOUT';
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface AuthenticatedUsersRequest {
  id: string;
  type: 'USER_ACTIVE';
  payload: null;
}

export interface AuthenticatedUsersResponse {
  id: string;
  type: 'USER_ACTIVE';
  payload: {
    users: Array<{
      login: string;
      isLogined: boolean;
    }>;
  };
}

export interface UserLogoutServer {
  id: null;
  type: 'USER_EXTERNAL_LOGOUT';
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface UserLoginServer {
  id: null;
  type: 'USER_EXTERNAL_LOGIN';
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface SendingMessageUserRequest {
  id: string;
  type: 'MSG_SEND';
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

export interface SendingMessageUserResponse {
  id: string;
  type: 'MSG_SEND';
  payload: {
    message: HistoryMessage; // переиспользуем
  };
}

export interface ReceivingMessageFromUser {
  id: null;
  type: 'MSG_SEND';
  payload: {
    message: HistoryMessage; // переиспользуем
  };
}

export interface MessageHistoryWithUserRequest {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    user: {
      login: string;
    };
  };
}

export interface MessageHistoryWithUserResponse {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    messages: HistoryMessage[]; // было []
  };
}

export const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`; // substr → slice
};

export type WebSocketMessage =
  | UserLoginRequest
  | UserLoginResponse
  | AuthenticatedUsersRequest
  | AuthenticatedUsersResponse
  | UserLogoutServer
  | UserLoginServer
  | SendingMessageUserRequest
  | SendingMessageUserResponse
  | ReceivingMessageFromUser
  | MessageHistoryWithUserRequest
  | MessageHistoryWithUserResponse
  | ServerErrorResponse;

export interface WebSocketInstance {
  isConnected: boolean;
  reconnectAttempt: number;
  maxReconnectAttempts: number;
  connect: () => Promise<void>;
  sendMessage: (message: WebSocketMessage) => void;
  onMessage: (handler: MessageCallback) => () => void;
  disconnect: () => void;
}

export type MessageCallback = (message: WebSocketMessage) => void;
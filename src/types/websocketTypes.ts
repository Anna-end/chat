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
export interface UnauthorizedUsersRequest {
  id: string,
  type: "USER_INACTIVE",
  payload: null,
}

export interface UnauthorizedUsersResponse {
  id: string,
  type: "USER_INACTIVE",
  payload: {
    users: Array<{
      login: string;
      isLogined: boolean;
    }>;
  }
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
    message: HistoryMessage; 
  };
}

export interface ReceivingMessageFromUser {
  id: null;
  type: 'MSG_SEND';
  payload: {
    message: HistoryMessage; 
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
    messages: HistoryMessage[];
  };
}

export interface FetchingCountUnreadMessagesWithUserRequest {
  id: string,
  type: "MSG_COUNT_NOT_READED_FROM_USER",
  payload: {
    user: {
      login: string,
    }
  }
}

export interface FetchingCountUnreadMessagesWithUserResponse {
  id: string,
  type: "MSG_COUNT_NOT_READED_FROM_USER",
  payload: {
    count: number,
  }
}

export interface MessageReadStatusChangeRequest {
  id: string,
  type: "MSG_READ",
  payload: {
    message: {
      id: string,
    }
  }
}

export interface MessageReadStatusChangeResponse {
  id: string,
  type: "MSG_READ"
  payload: {
    message: {
      id: string,
      status: {
        isReaded: boolean,
      }
    }
  }
}

export interface NotificationMessageReadStatusChange {
  id: null,
  type: "MSG_READ"
  payload: {
    message: {
      id: string,
      status: {
        isReaded: boolean,
      }
    }
  }
}

export type WebSocketMessage =
  | UserLoginRequest
  | UserLoginResponse
  | AuthenticatedUsersRequest
  | AuthenticatedUsersResponse
  | UnauthorizedUsersResponse
  | UnauthorizedUsersRequest
  | UserLogoutServer
  | UserLoginServer
  | SendingMessageUserRequest
  | SendingMessageUserResponse
  | ReceivingMessageFromUser
  | MessageHistoryWithUserRequest
  | MessageHistoryWithUserResponse
  | ServerErrorResponse
  | FetchingCountUnreadMessagesWithUserRequest
  | FetchingCountUnreadMessagesWithUserResponse
  | MessageReadStatusChangeRequest
  | MessageReadStatusChangeResponse
  | NotificationMessageReadStatusChange

export type MessageCallback = (message: WebSocketMessage) => void;

export interface WebSocketInstance {
  isConnected: boolean;
  reconnectAttempt: number;
  maxReconnectAttempts: number;
  connect: () => Promise<void>;
  sendMessage: (message: WebSocketMessage) => void;
  onMessage: (handler: MessageCallback) => () => void;
  disconnect: () => void;
}


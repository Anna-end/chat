import { saveDataUserLocalStorage } from './localStorage'
interface UserCredentials {
  login: string;
  password: string;
}

interface UserAuthRequest {
  id: string;
  type: "USER_LOGIN";
  payload: {
    user: UserCredentials;
  };
}

interface UserAuthResponse {
  id: string;
  type: "USER_LOGIN";
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}



let socket: WebSocket | null = null;
let isConnected: boolean = false;
const pendingRequests = new Map();
const SERVER_PORT = 4000;

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)}

export function connectWebSocket(): Promise<void> {
  return new Promise<void>((resolve, rej) => {
    socket = new WebSocket(`ws://localhost:${SERVER_PORT}`);

    socket.onopen = () => {
      console.log('WebSocket соединение установлено');
      isConnected = true;
      resolve();
    };
    socket.onmessage = handleServerMessage;
    socket.onerror = (error: Event) => {
      console.error('WebSocket ошибка:', error);
      rej(error);
    }

    socket.onclose = (event: CloseEvent) => {
      console.log('Соединение закрыто', event.code, event.reason);
      isConnected = false;
      pendingRequests.clear();
    };
  })
}

function handleServerMessage(event: MessageEvent) {
  try {
    const response = JSON.parse(event.data as string);
    const { id, type, payload } = response;
    
    if (type === "USER_LOGIN" && pendingRequests.has(id)) {
      const request = pendingRequests.get(id)!;
      clearTimeout(request.timeout);
      
      if (payload.user.isLogined) {
        console.log('✅ Пользователь успешно аутентифицирован:', payload.user.login);
        request.resolve(payload.user);
      } else {
        console.log('❌ Аутентификация не удалась для:', payload.user.login);
        request.reject(new Error('Неверные учетные данные'));
      }
      
      pendingRequests.delete(id);
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения:', error);
  }
}

export function loginUser(login: string, password: string): Promise<UserAuthResponse> {
  return new Promise((resolve, reject) => {
    if (!isConnected || !socket) {
      reject(new Error('Соединение не установлено'));
      return;
    }
    
    const requestId = generateUniqueId();
    
    const request: UserAuthRequest = {
      id: requestId,
      type: "USER_LOGIN",
      payload: {
        user: { login, password }
      }
    };
    
    pendingRequests.set(requestId, {
      resolve,
      reject,
      timeout: setTimeout(() => {
        pendingRequests.delete(requestId);
        reject(new Error('Таймаут ожидания ответа от сервера'));
      }, 10000)
    });
    if(socket)
    socket.send(JSON.stringify(request));
    saveDataUserLocalStorage(login, requestId)
  });
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
    isConnected = false;
    pendingRequests.clear();
  }
}
import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WebSocketContext = createContext({
    subscribe: () => {},
    unsubscribe: () => {}
  });

export const WebSocketProvider = ({ children, authToken }) => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!authToken) return; 

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({ 'Authorization': authToken }, frame => {
      console.log('Connected:', frame);
      
    });
    setStompClient(client);
    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [authToken]); // Reconnect when authToken changes

  const subscribe = (topic, callback) => {
    if (!stompClient || !stompClient.connected) return null;
    return stompClient.subscribe(topic, callback);
  };

  const unsubscribe = (subscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

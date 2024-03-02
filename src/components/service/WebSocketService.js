import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


class WebSocketService {
    constructor() {
        this.client = null;
        this.subscribers = {};
        const url = window.location.href;
        var host = "http://pro2-dev.sabanciuniv.edu:8080";
        if (url.indexOf("pro2") === -1) {
            host = "http://localhost:8080";
        }
        this.socketFactory = () => new SockJS(host + '/ws');
    }

    connectWebSocket(jwtToken) {
       
        this.client = Stomp.over(this.socketFactory);

      
        this.client.reconnect_delay = 120000; 
        console.log('jwtToken', jwtToken)
        this.client.connect({ 'Authorization': jwtToken }, frame => {
            console.log('Connected:', frame);

      
            Object.keys(this.subscribers).forEach(topic => {
                this.subscribers[topic].forEach(sub => {
                    sub.subscription = this.client.subscribe(topic, message => {
                        sub.callback(JSON.parse(message.body));
                    });
                });
            });
        });
    }

    subscribe(topic, callback) {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        console.log('I am Here 3')
        if (this.client && this.client.connected) {
            console.log('I am Here 4')
            const subscription = this.client.subscribe(topic, message => {
                callback(JSON.parse(message.body));
            });

            this.subscribers[topic].push({ subscription, callback });
        }else {
            this.subscribers[topic].push({subscription: null, callback})
        }
        console.log('this.subscribers[topic]', this.subscribers[topic])
    }

    unsubscribe(topic, callback) {
        console.log('this.subscribers[topic]', this.subscribers[topic])
        if (this.subscribers[topic]) {
           
            const subscriptionIndex = this.subscribers[topic].findIndex(sub => sub.callback.name === callback.name);

            if (subscriptionIndex !== -1) {

                const subscriptionId = this.subscribers[topic][subscriptionIndex].subscription.id;


                this.client.unsubscribe(subscriptionId);

                this.subscribers[topic].splice(subscriptionIndex, 1);
            }
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
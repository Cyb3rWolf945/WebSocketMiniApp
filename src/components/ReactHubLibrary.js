import {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";

export default function ReactHubLibrary() {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://jsamsignal.azurewebsites.net/signal", {
                skipNegotiation: false, // Optional based on your server config
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    console.log("Connected to SignalR hub");

                    // Listening for messages
                    connection.on("BroadCast", (message) => {
                        console.log(message);
                        setMessages((prevMessages) => [...prevMessages, message]);
                    });
                })
                .catch((error) => console.error("Connection error:", error));
        }
    }, [connection]);


    return <>
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
    </>;
}
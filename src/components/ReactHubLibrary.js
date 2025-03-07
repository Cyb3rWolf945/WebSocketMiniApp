import {useEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";

export default function ReactHubLibrary() {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

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


    return <div style={{border: "1px solid black", height: "80vh"}}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={ async()=>{
            await connection.invoke("BroadCast", input);
        }}>Clica em mim</button>

        <p>Abaixo são apresentadas as mensagens</p>
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
    </div>;
}

import '../App.css';
import { createStyles, makeStyles } from "@mui/styles";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import { Message } from './message';


//classes importadas do codeSandbox
const useStyles = makeStyles(() =>
    createStyles({
        paper: {
            width: "80vw",
            height: "80vh",
            maxWidth: "500px",
            maxHeight: "700px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        paper2: {
            width: "80vw",
            maxWidth: "500px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "relative"
        },
        container: {
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        messagesBody: {
            width: "calc(100% - 20px)",
            margin: 10,
            overflowY: "scroll",
            height: "calc(100% - 80px)"
        },
        wrapForm: {
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: "auto",
        },
        wrapText: {
            width: "100%"
        },
        button: {
            marginLeft: 10
        }
    })
);

function WebSocketComponent() {
    const classes = useStyles();
    const [message, setMessage] = useState({
        message: "",
        timestamp: "10:30 AM",
        photoURL: "https://example.com/user.jpg",
        displayName: "user",
        isUser:"False"
    });

    //variavel para o websocket e para a lista de mensagens.
    const [ws, setWs] = useState(null);
    const [listMessages, setListMessages] = useState([]);

    // id do utilizador no hub
    const [idHub, setIdHub] = useState("");


    /**
     * 1ºpasso: Abrir conexão com o websocket.
     * 2ºpasso: Forçar a conexão.
     * 3ºpasso: Filtro das mensagens do tipo 1 bem como a obtenção do user id respetivo ao Hub.
     */
    useEffect(() => {
        if (!ws) {
            const websocket = new WebSocket('wss://jsamsignal.azurewebsites.net/signal');

            websocket.onopen = () => {
                console.log('WebSocket is connected');
                websocket.send('{"protocol":"json","version":1}');
            };

            websocket.onmessage = (evt) => {
                const data = evt.data.trim();
                console.log(evt);

                try {
                    const messages = data.split(/\u001e+/).filter(msg => msg.trim().length > 0);
                    messages.forEach((message) => {
                        const jsonData = JSON.parse(message);
                        if (jsonData.type === 1 && jsonData.target === "OnConnectedAsyncPrivate") {
                            setIdHub(jsonData.arguments[0].split(" ").pop());
                        }
                    });
                } catch (error) {
                    console.error("Erro ao processar mensagem WebSocket:", error, "Mensagem recebida:", data);
                }
            };

            setWs(websocket);
        }
    }, [ws]);


    const handleDisconnect = () => {
        ws.close();
    }

    const handleShake = () => {
        ws.send('{"protocol":"json","version":1}');
    }

    const handleSendMessage = () => {


        ws.send(` {"arguments":["${message.message}"],"invocationId":"0","target":"BroadCast","type":1}`);

        setMessage(prevState => ({
            ...prevState,
            message: ""
        }));

    }

    const listItems = listMessages.map((item, index) => (
        <Message
            key={index}
            message={item.message}
            timestamp={item.timestamp}
            photoURL={item.photoURL}
            displayName={item.displayName}
            isUser={item.isUser}
        />
    ));

    return (
        <div className="App">
            <div className={classes.container}>
                <Paper className={classes.paper} elevation={2}>
                    <Paper id="style-1" className={classes.messagesBody}>
                        <Message
                            message="Ola, tudo bem?"
                            timestamp="10:30 AM"
                            photoURL="https://example.com/user.jpg"
                            displayName="João"
                            isUser={false}
                        />
                        <Message
                            message="Tudo e contigo!"
                            timestamp="10:31 AM"
                            isUser={true}
                        />
                        {listItems}
                    </Paper>
                    <form className={classes.wrapForm} noValidate autoComplete="off">
                        <TextField
                            id="standard-text"
                            label="Escreve a tua mensagem"
                            className={classes.wrapText}
                            value={message.message}
                            onChange={(e) => setMessage({ ...message, message: e.target.value })}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={handleSendMessage}
                        >
                            <SendIcon />
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );
}

export default WebSocketComponent;

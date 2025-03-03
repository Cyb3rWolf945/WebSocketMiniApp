import './App.css';
import React, {
  useState,
  useEffect
} from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    if(ws == null){
      const websocket = new WebSocket('wss://jsamsignal.azurewebsites.net/signal');
      //const websocket = new WebSocket('wss://localhost:7296/signal');
      
      websocket.onopen = () => {
        console.log('WebSocket is connected');
      };
  
      websocket.onmessage = (evt) => {
        // Create a new array instead of mutating the existing one
        setList(prevList => [...prevList, evt.data]);
      };
      
      setWs(websocket);
    }
  }, []);

  // This useEffect will now properly log the updated list
  useEffect(() => {
    console.log(list);
  }, [list]);

  const handleDisconnect = () => {
    ws.close();
  }

  const handleShake = () => {
    ws.send('{"protocol":"json","version":1}');
  }

  const handleSendMessage = () => {
    ws.send(' {"arguments":["ola tudo bem?"],"invocationId":"0","target":"BroadCast","type":1}');
  }

  // No need for two separate list rendering variables
  const listItems = list.map((item, index) =>
    <li key={index}>{item}</li>
  );

  return (
    <div className="App">
      <button onClick={handleShake}>
        Shake shake
      </button>

      <button onClick={handleSendMessage}>
        message
      </button>

      <ul>
        {listItems}
      </ul>
    </div>
  );
}

export default App;
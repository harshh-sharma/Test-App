import { useRef } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const CHAT_ID = "6acb247b3c6def878b3db1fe";
// const userId = "6aca9436614b9896345160af";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState("6aca9436614b9896345160af");
  const [showTyping, setShowTyping] = useState(false);

  const typingTimeout = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in first.");
      return;
    }

    let active = true;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    fetch(`http://localhost:5000/api/messages/${CHAT_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to load messages");
        if (active) setMessages(data.messages);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    newSocket.on("connect", () => {
      newSocket.emit("join_chat", CHAT_ID);
    });

    newSocket.on("receive_message", (message) => {
      setMessages((previous) => {
        if (previous.some((item) => item._id === message._id)) {
          return previous;
        }
        return [...previous, message];
      });
    });

    newSocket.on("user_typing", (data) => {
      console.log(
        "Typing event received:",
        data,
        data.userId == user,
        user,
        data.userId,
      );

      if (data.chatId !== CHAT_ID) {
        return;
      }

      setShowTyping(true);
    });


    newSocket.on("user_typing_off", (data) => {
      if(data.userId !== user || data.chatId !== CHAT_ID) return 
      setShowTyping(false);
    })


    newSocket.on("chat_error", (message) => {
      setError(message);
    });

    return () => {
      active = false;
      newSocket.disconnect();
    };
  }, []);

// let typingTimeout;

const handleTypingEvent = () => {
  if (!socket?.connected) return;

  socket.emit("typing", CHAT_ID);

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    socket.emit("typingOff", CHAT_ID);
  }, 1500);
};

  const sendMessage = (event) => {
    event.preventDefault();

    socket.emit("typingOff", CHAT_ID);
    const messageText = text.trim();

    if (!messageText || !socket?.connected) return;

    setError("");

    socket.emit(
      "send_message",
      {
        chatId: CHAT_ID,
        text: messageText,
      },
      (response) => {
        if (response.success) {
          setText("");
        } else {
          setError(response.message || "Failed to send message");
        }
      },
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h1>Chat Room</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 12,
          marginBottom: 12,
        }}
      >
        {messages.map((message) => (
          <div key={message._id} style={{ marginBottom: 12 }}>
            <strong>
              {message.sender?.name || message.sender?.name === ""
                ? message.sender.name
                : "User"}
              :
            </strong>
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      {user}
      {showTyping && <p>Typing...</p>}
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(event) => {
            console.log("sdfes");
            handleTypingEvent();
            setText(event.target.value);
          }}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" disabled={!socket?.connected || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;



3. Use this memory trick
- on = listen.
- emit = send.
- join = enter a room.
- to = target a room.
- broadcast = exclude the sender.
- io = the whole Socket.IO server.
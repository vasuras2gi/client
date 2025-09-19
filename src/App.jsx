import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(
    () =>
      io("https://server-v06f.onrender.com", {
        withCredentials: true,
      }),
    []
  );

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [mymessages, setMymessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message || !room) return;
    socket.emit("message", { message, room });
    setMessage("");
  };

  const JoinRoomHandler = (e) => {
    e.preventDefault();
    if (!roomName) return;
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-message", (data) => {
      setMymessages((mymessages) => [...mymessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Welcome To <span className="text-green-400">Vasu Rastogi</span> Chat
      </h1>

      {/* Connected ID */}
      <h2 className="text-sm sm:text-lg mb-6 text-center">
        Connected as:{" "}
        <span className="text-green-400 break-all">{socketId}</span>
      </h2>

      {/* Join Room Form */}
      <form
        onSubmit={JoinRoomHandler}
        className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-md"
      >
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
        >
          Join
        </button>
      </form>

      {/* Send Message Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-md"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room/User ID"
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
        >
          Send
        </button>
      </form>

      {/* Messages Box */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 overflow-y-auto max-h-96 shadow-md">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        {mymessages.length === 0 ? (
          <p className="text-gray-400">No messages yet...</p>
        ) : (
          mymessages.map((m, i) => (
            <div
              key={i}
              className={`p-2 my-1 rounded-lg text-sm break-words ${
                m.sender === socketId
                  ? "bg-blue-600 text-white text-right"
                  : "bg-gray-700 text-gray-100 text-left"
              }`}
            >
              {/* Show sender ID or "You" */}
              <p className="text-xs text-gray-300 mb-1">
                {m.sender === socketId ? "You" : m.sender}
              </p>
              {/* Show actual message */}
              <p>{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;

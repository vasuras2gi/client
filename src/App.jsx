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
      <h1 className="text-lg sm:text-2xl font-bold text-center mb-4">
        Welcome To <span className="text-blue-400">Vasu Rastogi</span> Chat
        Prototype
      </h1>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Socket ID */}
        <h2 className="text-base sm:text-xl font-semibold mb-4 text-center break-all">
          Connected as:{" "}
          <span className="text-green-400 font-mono">{socketId}</span>
        </h2>

        {/* Join Room Form */}
        <form
          onSubmit={JoinRoomHandler}
          className="flex flex-col sm:flex-row gap-2 mb-4 w-full"
        >
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold text-sm"
          >
            Join
          </button>
        </form>

        {/* Send Message Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 mb-4 w-full"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room/User ID"
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold text-sm"
          >
            Send
          </button>
        </form>

        {/* Messages */}
        <div className="w-full bg-gray-800 rounded p-3 sm:p-4 overflow-y-auto max-h-80">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Messages</h2>
          {mymessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet...</p>
          ) : (
            mymessages.map((m, i) => (
              <div
                key={i}
                className={`p-2 my-1 rounded-lg text-sm ${
                  m.sender === socketId
                    ? "bg-blue-600 text-white text-right"
                    : "bg-gray-700 text-gray-100 text-left"
                }`}
              >
                {/* Show sender ID or "You" */}
                <p className="text-xs text-gray-300 mb-1 break-all">
                  {m.sender === socketId ? "You" : m.sender}
                </p>
                {/* Show the actual message */}
                <p>{m.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

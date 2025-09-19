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
      console.log(data, socket.id);
      setMymessages((mymessages) => [...mymessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Socket ID */}
      <h1 className="text-2xl font-bold mb-6">
        Connected as: <span className="text-green-400">{socketId}</span>
      </h1>

      {/* Join Room Form */}
      <form
        onSubmit={JoinRoomHandler}
        className="flex gap-2 mb-6 w-full max-w-md"
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
        className="flex gap-2 mb-6 w-full max-w-md"
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

      {/* Messages */}
      <div className="w-full max-w-md bg-gray-800 rounded p-4 overflow-y-auto max-h-80">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        {mymessages.length === 0 ? (
          <p className="text-gray-400">No messages yet...</p>
        ) : (
          mymessages.map((m, i) => (
            <div
              key={i}
              className="p-2 my-1 bg-gray-700 rounded-lg text-sm text-gray-100"
            >
              {m}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;

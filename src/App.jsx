import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // Socket connection
  const socket = useMemo(
    () =>
      io("https://server-v06f.onrender.com", {
        withCredentials: true,
      }),
    []
  );

  // States
  const [activeTab, setActiveTab] = useState("room"); // "room" or "personal"
  const [message, setMessage] = useState("");
  const [targetId, setTargetId] = useState(""); // Room name OR Socket ID
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  
  // Separate message states
  const [roomMessages, setRoomMessages] = useState([]);
  const [personalMessages, setPersonalMessages] = useState([]);

  // Send Message Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message || !targetId) return;

    // Backend ko message bhejte time 'type' zaroor bhejein
    socket.emit("message", { 
      message, 
      room: targetId, 
      type: activeTab 
    });
    
    setMessage("");
  };

  // Join Room Handler
  const JoinRoomHandler = (e) => {
    e.preventDefault();
    if (!roomName) return;
    socket.emit("join-room", roomName);
    setTargetId(roomName); // Automatically set target to joined room
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

    // Receive Message Handler
    socket.on("receive-message", (data) => {
      // Backend se aane wale data mein 'type' check karein
      if (data.type === "personal") {
        setPersonalMessages((prev) => [...prev, data]);
      } else {
        setRoomMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Determine which messages to show based on active tab
  const currentMessages = activeTab === "room" ? roomMessages : personalMessages;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 py-8 font-sans">
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Welcome To <span className="text-green-400">Vasu Rastogi</span> Chat 🐧
      </h1>
      
      <h2 className="text-sm sm:text-base mb-8 text-center text-gray-400">
        Your ID: <span className="text-green-400 select-all">{socketId}</span>
      </h2>

      {/* Tab Selectors */}
      <div className="flex gap-4 mb-6 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("room")}
          className={`px-6 py-2 rounded-md font-semibold transition-all ${
            activeTab === "room" ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Room Chat
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-6 py-2 rounded-md font-semibold transition-all ${
            activeTab === "personal" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Personal Chat
        </button>
      </div>

      {/* Join Room Form (Only visible in Room Chat Tab) */}
      {activeTab === "room" && (
        <form onSubmit={JoinRoomHandler} className="flex gap-2 mb-6 w-full max-w-md">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name to Join..."
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <button type="submit" className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors">
            Join
          </button>
        </form>
      )}

      {/* Send Message Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 w-full max-w-md bg-gray-800 p-4 rounded-lg border border-gray-700">
        <input
          type="text"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder={activeTab === "room" ? "Target Room Name" : "Target User's Socket ID"}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition-colors">
            Send
          </button>
        </div>
      </form>

      {/* Messages Box */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 h-96 flex flex-col border border-gray-700">
        <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
          {activeTab === "room" ? "Group Messages" : "Direct Messages"}
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {currentMessages.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No messages here yet...</p>
          ) : (
            currentMessages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[85%] break-words ${
                  m.sender === socketId
                    ? "bg-blue-600 text-white self-end ml-auto rounded-br-none"
                    : "bg-gray-700 text-gray-100 self-start mr-auto rounded-bl-none"
                }`}
              >
                <p className="text-[10px] text-gray-300 mb-1 font-semibold opacity-75">
                  {m.sender === socketId ? "You" : m.sender}
                </p>
                <p className="text-base">{m.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;






// import React, { useEffect, useMemo, useState } from "react";
// import { io } from "socket.io-client";

// const App = () => {
//   const socket = useMemo(
//     () =>
//       io("https://server-v06f.onrender.com", {
//         withCredentials: true,
//       }),
//     []
//   );

//   const [message, setMessage] = useState("");
//   const [room, setRoom] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [mymessages, setMymessages] = useState([]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!message || !room) return;
//     socket.emit("message", { message, room });
//     setMessage("");
//   };

//   const JoinRoomHandler = (e) => {
//     e.preventDefault();
//     if (!roomName) return;
//     socket.emit("join-room", roomName);
//     setRoomName("");
//   };

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//       console.log("connected", socket.id);
//     });

//     socket.on("welcome", (s) => {
//       console.log(s);
//     });

//     socket.on("receive-message", (data) => {
//       setMymessages((mymessages) => [...mymessages, data]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-6">
//       {/* Header */}
//       <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
//         Welcome To <span className="text-green-400">Vasu Rastogi</span> Chat Proto-type🐧 
//       </h1>

//       {/* Connected ID */}
//       <h2 className="text-sm sm:text-lg mb-6 text-center">
//         Connected as:{" "}
//         <span className="text-green-400 break-all">{socketId}</span>
//       </h2>

//       {/* Join Room Form */}
//       <form
//         onSubmit={JoinRoomHandler}
//         className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-md"
//       >
//         <input
//           type="text"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           placeholder="Enter room name"
//           className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
//         >
//           Join
//         </button>
//       </form>

//       {/* Send Message Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-md"
//       >
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter message"
//           className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="text"
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//           placeholder="Room/User ID"
//           className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold"
//         >
//           Send
//         </button>
//       </form>

//       {/* Messages Box */}
//       <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 overflow-y-auto max-h-96 shadow-md">
//         <h2 className="text-lg font-semibold mb-2">Messages</h2>
//         {mymessages.length === 0 ? (
//           <p className="text-gray-400">No messages yet...</p>
//         ) : (
//           mymessages.map((m, i) => (
//             <div
//               key={i}
//               className={`p-2 my-1 rounded-lg text-sm break-words ${
//                 m.sender === socketId
//                   ? "bg-blue-600 text-white text-right"
//                   : "bg-gray-700 text-gray-100 text-left"
//               }`}
//             >
//               {/* Show sender ID or "You" */}
//               <p className="text-xs text-gray-300 mb-1">
//                 {m.sender === socketId ? "You" : m.sender}
//               </p>
//               {/* Show actual message */}
//               <p>{m.message}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

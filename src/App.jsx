import React from 'react'
import { useEffect } from 'react'
import {io} from "socket.io-client"
import {Button, Container, Stack, TextField, Typography} from '@mui/material'
import { useState } from 'react'
import { useMemo } from 'react'

const App = () => {
  const socket = useMemo(()=> io('https://server-v06f.onrender.com',{
    withCredentials:true,
  }) ,[]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [mymessages, setMymessages] = useState([]);

  console.log(mymessages);

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message",{message, room});
    setMessage("");
  }

  const JoinRoomHandler = (e)=>{
      e.preventDefault();
      socket.emit("join-room",roomName);
      setRoomName("")
  }

  useEffect(( ) => {
    socket.on("connect",( ) => {
      setSocketId(socket.id);
      console.log("connected",socket.id);
    });

    socket.on("welcome",(s)=>{
      console.log(s);
    })

    socket.on("receive-message",(data)=>{
      console.log(data);
      setMymessages((mymessages) => [...mymessages, data]);
    })


    return()=>{
      socket.disconnect();
    }

  },[]);

  return (
    <Container maxWidth='sm'>

      <Typography variant='h1' component='div' gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={JoinRoomHandler}>
        <h5>join room</h5>
        <TextField value={roomName}
         onChange={(e)=>setRoomName(e.target.value)}
         id='outlined-basic' label='Room' variant='outlined'/>

        <Button type='submit' variant='contained' color='primary'>Join</Button>
      </form>

      <form onSubmit={handleSubmit}>

        <TextField value={message}
         onChange={(e)=>setMessage(e.target.value)}
         id='outlined-basic' label='message' variant='outlined'/>

        <TextField value={room}
         onChange={(e)=>setRoom(e.target.value)}
         id='outlined-basic' label='userId/roomname' variant='outlined'/>


        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>

      <Stack>
        {
          mymessages.map((m, i)=>(
            <Typography key={i} variant='h6' component='div' gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>  
    </Container>
  )
}

export default App
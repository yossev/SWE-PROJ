"use client"

import { redirect } from "next/navigation";
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import io from 'socket.io-client';

const socket = io('http://localhost:3001');


export default async function Home({
    params,
  }: {
    params: Promise<{ chatId: string }>
  })
{

  let roomJoined = false;
  let userIdData = getCookie('userIdData');
  console.log("User ID before render: " +  userIdData);

    let messages : any = [];
    let input = "";

    const setInput = async (setData : any) => {
        input = setData;
    }

    let data = {roomId : (await params).chatId , user : "Test" , userId : userIdData , message : input}
    //socket.emit('join_room' , data);

    const joinRoom = async () => {
      roomJoined = true;
      userIdData = getCookie('userId');
      console.log("join room func has user id: " , userIdData);
      data.userId = userIdData;
      socket.emit('join_room' ,data );
    }

    const leaveRoom = async() => {
      roomJoined = false;
      userIdData = getCookie('userId');
      console.log("join room func has user id: " , userIdData);
      data.userId = userIdData;
      socket.emit('leave_room' ,data );
    }

    const sendMessage = async () => {
        data.message = input;
        socket.emit('sendMessage' , data);
        setInput('');
    }

    return (
        <>
        {roomJoined? (<button onClick={leaveRoom}>leave Room</button>) : (<button onClick={joinRoom}>join Room</button>)}
        <h1>{userIdData}</h1>
        <div>
          <div className="messages">
            {messages.map((msg : any, index : any) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        </>

    )
    
}
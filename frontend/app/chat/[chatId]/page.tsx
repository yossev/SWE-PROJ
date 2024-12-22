"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from 'react'
import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next/client';
import { useEffect, useState } from "react";
import axiosInstance from 'app/utils/axiosInstance';

import io from 'socket.io-client';

const socket = io('http://localhost:3001');


export default function Home()
{
  const path = usePathname().split('/');


  const [room , setRoom] = useState("");
  const [joined , setJoined] = useState(true);
  const [messages , setMessages] = useState<{ sender : string , message : string }[]>([])
  let userId = getCookie("userId");
  let userName = getCookie("username");

  let chatId : string = path[path.length - 1];


  let dataEmit = {roomId : chatId , user : userName , userId : userId , message : ""}
  useEffect(() => { 
    if(userId)
    {
      socket.emit("join_room" , {roomId : chatId , user : userName , userId : userId});

      socket.emit("get_chat_history" , {roomName : chatId});
      socket.on("get_chat_history" , (data) => {
        const dataAppend : {sender: string , message: string}[] = [];
        data.forEach(function(value : any) {
          console.log("Sender is: " + value.sender + " And message is: " + value.message)
          dataAppend.push({sender : value.sender , message: value.message})
        })
        setMessages((prev) => [...prev, ...dataAppend]);
      })

      socket.on("sendMessage", (data) => {
        setMessages((prev) => [...prev, {sender : data.user, message : data.message}]);
      });
  
      socket.on("join_room" , (message) => {
        setMessages((prev) => [...prev, {sender : "System" , message : message}]);
      });
  
      console.log("User ID : " + userId);
    }


} , []);


  const handleSendMessage = (message: string) => {
    dataEmit.message = message;
    socket.emit("sendMessage", dataEmit);
    console.log(message);
    console.log(messages);
    console.log("ID sending is: " + userId);
  };

  return (
    
    <div className="flex mt-24 justify-center w-full">
      {!userId ? (
        <div className="flex flex-col items-center justify-center"> Please login to continue</div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
        <h1 className="mb-4 text-2xl font-bold">Room: {chatId}</h1>
        <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
          {messages.map((msg , index) => (
          <ChatMessage key={index} sender={msg.sender} message={msg.message} isOwnMessage={msg.sender === userName} />
        ))}</div>
        <ChatForm onSendMessage={handleSendMessage} />
      </div>
      )}

    </div>
  );
}

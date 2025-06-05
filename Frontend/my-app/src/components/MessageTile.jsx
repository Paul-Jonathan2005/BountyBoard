import React from 'react';
import '../css/MessageTile.css'

export default function Message({chat}){
      const  {username, created_time, message, isClient}= chat;

      return (
        <div className={`chat-message ${isClient ? 'chat-left' : 'chat-right'}`}>
          <div className="chat-bubble">
            <div className="chat-meta">
              <span className="chat-username">{username}</span>
              <span className="chat-time">
                {new Date(created_time).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
            <p>{message}</p>
          </div>
        </div>
      );
}
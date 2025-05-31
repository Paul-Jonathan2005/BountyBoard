import Message from './MessageTile';
import React from 'react';

export default function MessageTileList({ chatMessages }) {
  return (
    <div>
      {chatMessages.map((chat, index) => (
        <Message key={index} chat={chat} />
      ))}
    </div>
  );
}
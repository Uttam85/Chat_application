// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { ChatComponentComponent } from "./componts/chat-component/chat-component.component";
// import { TestComponent } from "./componts/test/test.component";
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterOutlet, ChatComponentComponent, TestComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   // title = 'first-project';
//   // searchText: string = '';
//   // replyMode: { status: boolean, chatIndex: number | null } = { status: false, chatIndex: null };
//   // newMessage: string = '';
//   // replyMessage: string = '';

//   // chats = [
//   //   {
//   //     username: 'egg',
//   //     avatar: 'E',
//   //     time: '2:12 PM',
//   //     message: "the new album from fromis_9 is really good hey @blueee get on voice",
//   //     onlineStatus: true,
//   //     replies:[
//   //       {
//   //         replyTo: 'egg',
//   //         message: 'yeah agreed that album is great',
//   //         time: '2:14 PM',
//   //         username: 'marble plant',
//   //         avatar: 'M',
//   //         onlineStatus: true
//   //       }
//   //     ] as any[],
//   //   },
//   //   {
//   //     username: 'blueee',
//   //     avatar: 'B',
//   //     time: '2:12 PM',
//   //     message: "can someone pls give me a smidge of attention",
//   //     onlineStatus: true,
//   //     replies: [] as string[]
//   //   }
//   // ];


//   // // Filter messages based on search query
//   // filterChats() {
//   //   return this.chats.filter(chat => 
//   //     chat.message.toLowerCase().includes(this.searchText.toLowerCase())
//   //   );
//   // }

//   // // Enable reply mode for a specific chat message
//   // enableReply(index: number) {
//   //   this.replyMode = { status: true, chatIndex: index };
//   // }

//   // // Add a reply to a specific chat message
//   // sendReply() {
//   //   if (this.replyMessage.trim() && this.replyMode.chatIndex !== null) {
//   //     this.chats[this.replyMode.chatIndex].replies.push(this.replyMessage);
//   //     this.replyMessage = '';
//   //     this.replyMode = { status: false, chatIndex: null };
//   //   }
//   // }

//   // // Send a new message
//   // sendMessage() {
//   //   if (this.newMessage.trim()) {
//   //     const newChat = {
//   //       username: 'Current User',
//   //       avatar: 'CU',
//   //       time: new Date().toLocaleTimeString(),
//   //       message: this.newMessage,
//   //       onlineStatus: true,
//   //       replies: []
//   //     };
//   //     this.chats.push(newChat);
//   //     this.newMessage = '';
//   //   }
//   // }

//   rooms = ['#gameroom', '#learningroom'];
//   selectedRoom = '#gameroom'; // Default room

//   // Array of messages
//   messages: Message[] = [
//     { id: 1, sender: 'Alice', text: 'Hello, welcome to the chat!', online: true, timestamp: new Date() },
//     { id: 2, sender: 'Bob', text: 'Thanks! Glad to be here.', replyTo: 1, online: true, timestamp: new Date() },
//     { id: 3, sender: 'Charlie', text: 'Hi everyone, how\'s it going?', online: false, timestamp: new Date() }
//   ];

//   // List of users in the room (right section)
//   users = [
//     { name: 'Alice', online: true },
//     { name: 'Bob', online: true },
//     { name: 'Charlie', online: false }
//   ];

//   // New message text input
//   newMessageText = '';

//   // For tracking the message being replied to
//   replyToMessageId: number | null = null;

//   constructor() { }

//   // Function to select a chat room
//   selectRoom(room: string): void {
//     this.selectedRoom = room;
//     this.loadRoomData();
//   }

//   // Dummy function to load data based on selected room (expand as needed)
//   loadRoomData(): void {
//     // Load chat history and users based on selected room
//     // You can fetch room-specific messages and users via API here
//     this.messages = [
//       { id: 1, sender: 'Alice', text: `Welcome to ${this.selectedRoom}`, online: true, timestamp: new Date() }
//     ];
//   }

//   // Send a new message
//   sendMessage(): void {
//     if (this.newMessageText.trim()) {
//       const newMessage: Message = {
//         id: this.messages.length + 1,
//         sender: 'You', // Simulate the current user sending the message
//         text: this.newMessageText,
//         online: true,
//         timestamp: new Date()
//       };

//       if (this.replyToMessageId) {
//         newMessage.replyTo = this.replyToMessageId;
//       }

//       this.messages.push(newMessage);
//       this.newMessageText = '';
//       this.replyToMessageId = null; // Reset reply
//     }
//   }

//   // Function to reply to a specific message
//   replyToMessage(messageId: number): void {
//     this.replyToMessageId = messageId;
//   }

//   // Check if a message is a reply
//   isReplyMessage(message: Message): boolean {
//     return !!message.replyTo;
//   }

//   // Get the original message text being replied to
//   getOriginalMessageText(replyToId: number): string {
//     const originalMessage = this.messages.find(msg => msg.id === replyToId);
//     return originalMessage ? originalMessage.text : '';
//   }

//   // Function to search messages (case-insensitive)
//   searchMessages(searchText: string): Message[] {
//     return this.messages.filter(msg =>
//       msg.text.toLowerCase().includes(searchText.toLowerCase())
//     );
//   }
// }


// interface Message {
//   id: number;
//   sender: string;
//   text: string;
//   replyTo?: number; // ID of the message being replied to
//   online: boolean;
//   timestamp: Date;
// }

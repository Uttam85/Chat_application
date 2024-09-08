import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Room, User, Message, SocketService } from './service/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // rooms: string[] = ['#gameroom', '#learningroom'];
  // filteredRooms: string[] = [...this.rooms]; // Filtered rooms for searching
  // selectedRoom: string = this.rooms[0];

  // messages: Message[] = [
  //   { id: 1, sender: 'Alice', text: 'Hello, welcome to the chat!', online: true, timestamp: new Date() },
  //   { id: 2, sender: 'Bob', text: 'Thanks! Glad to be here.', replyTo: 1, online: true, timestamp: new Date() },
  //   { id: 3, sender: 'Charlie', text: 'Hi everyone, how\'s it going?', online: false, timestamp: new Date() }
  // ];

  // filteredMessages: Message[] = [...this.messages]; // Filtered messages for searching

  // users: User[] = [
  //   { name: 'Alice', online: true },
  //   { name: 'Bob', online: true },
  //   { name: 'Charlie', online: false }
  // ];
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  users: User[] = [];
  selectedRoom: Room | null = null;
  currentUser: User | null = null;
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  newMessage = '';
  searchTerm = '';
  editedMessage: Message | null = null;
  emojis: string[] = ['👍', '😂', '❤️', '😮', '😢', '👏'];
  emojiPopupVisible: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.subscribeToSocketEvents();
  }

  subscribeToSocketEvents() {
    // Unsubscribe  avoid duplicate subscriptions
    this.clearSubscriptions();

    this.subscriptions.push(
      this.socketService.messages$.subscribe(messages => {
        console.log(messages);

        if (this.selectedRoom) {
          this.messages = messages.filter(msg => msg.roomId === this.selectedRoom?.id);
          this.filteredMessages = [...this.messages];
        }
      })
    );

    this.subscriptions.push(
      this.socketService.users$.subscribe(users => {
        console.log("userss", users);

        if (this.selectedRoom) {
          this.users = users.filter(user => user.roomId === this.selectedRoom?.id);
        }
      })
    );

    this.subscriptions.push(
      this.socketService.roomUpdates$.subscribe(rooms => {
        this.rooms = rooms;
        this.filteredRooms = [...rooms];
      })
    );
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.clearSubscriptions();
  }

  createRoom() {
    const roomName = prompt('Enter the name of the new room:');
    if (roomName) {
      this.socketService.createRoom(roomName);
    }
  }


  roomSearchTerm: string = '';
  selectRoom(room: Room) {
    this.filteredMessages = [];
    this.selectedRoom = room;
    this.socketService.messagesSubject.next([]);
    this.socketService.getRoomMessages(room.id);

    this.subscribeToSocketEvents();
  }

  joinedRooms: Set<string> = new Set();
  joinRoom(room: Room) {
    const username = prompt('Enter your username:');
    if (username) {
      this.currentUser = { id: '', name: username, isOnline: true, roomId: room.id };
      this.socketService.joinRoom({ roomId: room.id, user: this.currentUser });
      this.selectRoom(room);
    }
  }

  searchRooms() {
    this.filteredRooms = this.rooms.filter(room =>
      room.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendMessage() {
    if (this.currentUser && this.selectedRoom) {
      if (this.editedMessage) {
        this.editedMessage.content = this.newMessage;
        this.editedMessage.isEdited = true;
        this.editedMessage.editedContent = this.newMessage;
        this.socketService.updateMessage(this.editedMessage);
        this.editedMessage = null;
      } else {
        const newMsg: Message = {
          id: '', // id assigned form the server side
          content: this.newMessage,
          sender: this.currentUser.name,
          timestamp: new Date(),
          roomId: this.selectedRoom.id,
          reactions: []
        };
        this.socketService.sendMessage(newMsg);
      }
      this.newMessage = '';
      this.replyMessage = null;
    }
  }

  replyMessage: any = null;
  cancelReply() {
    this.replyMessage = null;
  }

  replyToMessage(message: Message) {
    this.replyMessage = message;
    this.newMessage = `Replying to: "${message.content}"`;
  }

  editMessage(message: Message) {
    if (this.currentUser?.name === message.sender) {
      this.newMessage = message.content;
      this.editedMessage = message;
    } else {
      alert('You can only edit your own messages.');
    }
  }

  deleteMessage(message: Message) {
    if (this.currentUser?.name === message.sender) {
      this.socketService.deleteMessage(message);
      this.messages = this.messages.filter(m => m.id !== message.id);
      this.filteredMessages = [...this.messages];
    } else {
      alert('You can only delete your own messages.');
    }
  }

  searchMessages() {
    this.filteredMessages = this.messages.filter(m =>
      m.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleEmojiPicker(message: Message) {
    message.showEmojiPicker = !message.showEmojiPicker;
  }

  addEmojiReaction(message: Message, emoji: string) {
    if (!message.reactions) {
      message.reactions = [];
    }
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      existingReaction.count += 1;
      if (!existingReaction.users.includes(this.currentUser?.name || '')) {
        existingReaction.users.push(this.currentUser?.name || '');
      }
    } else {
      message.reactions.push({ emoji, count: 1, users: [this.currentUser?.name || ''] });
    }
    message.showEmojiPicker = false;
    this.socketService.updateMessage(message);
  }

  get filteredUsers(): User[] {
    if (this.selectedRoom) {
      return this.users.filter(user => user.roomId === this.selectedRoom?.id)
    }
    return [];
  }

  clearSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
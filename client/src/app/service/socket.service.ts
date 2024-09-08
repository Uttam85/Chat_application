import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Room {
  id: string;
  name: string;
  status: string;
}

export interface User {
  id: string;
  name: string;
  isOnline: boolean;
  roomId?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  roomId: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
  isEdited?: boolean;
  editedContent?: string;
  showEmojiPicker?:boolean;

}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  public messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private usersSubject = new Subject<User[]>();
  users$ = this.usersSubject.asObservable();

  private roomsSubject = new Subject<Room[]>();
  roomUpdates$ = this.roomsSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('messages', (messages: Message[]) => {
      this.messagesSubject.next(messages);
    });

    this.socket.on('users', (users: User[]) => {
      this.usersSubject.next(users);
    });

    this.socket.on('rooms', (rooms: Room[]) => {
      this.roomsSubject.next(rooms);
    });

    // Handle incoming messages for specific rooms
    this.socket.on('roomMessages', (roomMessages: { roomId: string; messages: Message[] }) => {
      
      this.messagesSubject.next(this.messagesSubject.value.concat(roomMessages.messages));
    });
  }

  createRoom(name: string) {
    this.socket.emit('createRoom', name);
  }

  joinRoom(payload: { roomId: string; user: User }) {
    this.socket.emit('joinRoom', payload);
  }

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }

  updateMessage(message: Message) {
    this.socket.emit('updateMessage', message);
  }

  deleteMessage(message: Message) {
    this.socket.emit('deleteMessage', message);
  }

  getRoomMessages(roomId: string): Observable<Message[]> {
    this.socket.emit('getRoomMessages', roomId);

    // Return observable for room messages
    return new Observable<Message[]>(observer => {
      this.socket.on('roomMessages', (data: { roomId: string; messages: Message[] }) => {
        if (data.roomId === roomId) {
          observer.next(data.messages);
        }
      });
    });
  }

  // disconnecConnection()

  ngOnDestroy() {
    this.messagesSubject.next([]);
    this.roomsSubject.next([])
    this.usersSubject.next([]);
  }


}

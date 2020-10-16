import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import Peer from 'peerjs';

export interface Message {
  userId: string;
  date: Date;
  message: string;
}
@Component({
  selector: 'app-modal-chat',
  templateUrl: './modal-chat.page.html',
  styleUrls: ['./modal-chat.page.scss'],
})
export class ModalChatPage implements OnInit {
  @Input() conn: Peer.DataConnection;
  @Input() myId: string;
  @Input() peer: Peer;
  messageText = '';
  messages: Array<Message> = [];
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.conn.on('error', (err) => {
      console.log(err);
    });
    this.conn.on('data', (data) => {
      this.messages.push(data);
      // this.messages = data;
      console.log(this.messages);
    });
    this.conn.on('close', () => {
      console.log('conn closed');
      this.closeModal();
    });
  }

  sendMessage() {
    if (this.messageText.trim() !== '') {
      const msg = {date: new Date(), message: this.messageText, userId: this.myId};
 /*     this.messages.push(msg);*/
      // this.messages.push({date: new Date(), message: this.messageText, userId: this.myId});
      this.conn.send(msg);
      this.messages.push(msg);
      // this.justScrollToBottom(200);
      this.messageText = '';
    }
  }
  close() {
    this.conn.close();
  }
  async closeModal() {
    await this.modalController.dismiss();
  }
}

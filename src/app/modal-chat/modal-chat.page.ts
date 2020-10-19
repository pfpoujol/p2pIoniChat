import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
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
export class ModalChatPage implements OnInit, OnDestroy {
  @Input() conn: Peer.DataConnection;
  @Input() myId: string;
  @Input() peer: Peer;
  messageText = '';
  messages: Array<Message> = [];
  closeStatus = 'closedByPartner';
  constructor(public modalController: ModalController, public alertController: AlertController) { }

  ngOnInit() {
    console.log(this.conn.open)
    this.conn.on('open', () => {
      console.log('open');
    })
    this.conn.on('error', (err) => {
      console.log(err);
    });
    this.conn.on('data', (data) => {
      this.messages = data.sort((a, b) => new Date(a.date).getTime()-new Date(b.date).getTime());
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
      this.messages.push(msg);
      // this.messages.push({date: new Date(), message: this.messageText, userId: this.myId});
      // this.conn.send(msg);
      this.conn.send(this.messages);
      // this.messages.push(msg);
      // this.justScrollToBottom(200);
      this.messageText = '';
    }
  }
  closeConnection() {
    this.closeStatus = 'closedByMe';
    this.conn.close();
  }
  async closeModal() {
    // Par défaut, this.closeStatus = closedByPartner
    await this.modalController.dismiss(this.closeStatus);
  }
  ngOnDestroy() {
    if (this.conn.open) {
      this.conn.close();
    }
  }

}

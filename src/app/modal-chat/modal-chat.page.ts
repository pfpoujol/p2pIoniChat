import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonContent, ModalController} from '@ionic/angular';
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
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @Input() conn: Peer.DataConnection;
  @Input() myId: string;
  @Input() peer: Peer;
  messageText = '';
  messages: Array<Message> = [];
  closeStatus = 'closedByPartner';
  constructor(public modalController: ModalController) {
    window.addEventListener('keyboardDidShow', () => {
      this.justScrollToBottom(10);
    });
  }

  // A la création de la fenetre modale,
  ngOnInit() {
    // Ecoute de l'event pour les messages entrants.
    this.conn.on('data', (data) => {
      // le nouveau message receptionné est ajouté au tableau, celui-ci est en suite trié par date
      this.messages = this.sortMessagesWhileAdding(data);
      this.justScrollToBottom(200);
    });
    // Ecoute de l'event signalant de la fermeture de la connexion avec le serveur P2P
    this.onConnectionClosed();
    // Si l'autre participant ferme la fenêtre de conversation ou quitte l'application,
    // la fenêtre de conversation se ferme aussi de mon coté.
  }

  onConnectionClosed() {
    // lorsque la connexion est fermée d'un coté ou de l'autre.
    this.conn.on('close', () => {
      this.closeModal();
    });
    // si l'autre utilisateur crash l'appli salement (connexion pas fermée
    this.conn.peerConnection.oniceconnectionstatechange = () => {
      if (this.conn.peerConnection.iceConnectionState === 'failed' ||
          this.conn.peerConnection.iceConnectionState === 'disconnected' ||
          this.conn.peerConnection.iceConnectionState === 'closed') {
        this.closeModal();
      }
    };
  }

  /**
   * Envoi d'un message
   */
  sendMessage() {
    const msg = {date: new Date(), message: this.messageText, userId: this.myId};
    // ajout du message de mon coté, puis,
    this.messages = this.sortMessagesWhileAdding(msg);
    // envoi du message à l'autre participant via le serveur P2P
    this.conn.send(msg);

    this.justScrollToBottom(200);
    this.messageText = '';
  }
  sortMessagesWhileAdding(newMsg: Message): Array<Message> {
    const clonedMessages = [...this.messages];
    clonedMessages.push(newMsg);
    return clonedMessages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Fermeture de la connexion
   */
  closeConnection() {
    this.closeStatus = 'closedByMe';
    this.conn.close();
  }

  async closeModal() {
    await this.modalController.dismiss(this.closeStatus);
  }

  justScrollToBottom(timeout) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  ngOnDestroy() {
    if (this.conn.open) {
      this.conn.close();
    }
  }
}

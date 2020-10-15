import {Component, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {ModalController} from '@ionic/angular';
import {ModalChatPage} from '../modal-chat/modal-chat.page';
// import {WebrtcService} from "../webrtc.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  peer: Peer;
  otherId: string;
  private myId: string;
  constructor(public modalController: ModalController) {}
  // constructor(public webrtcService: WebrtcService) {}
  ngOnInit() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.myId = id;
      console.log(id);
    });
    this.peer.on('connection', (conn) => {
      console.log('Connexion établie.', conn);
      this.presentModal(conn);
    });

  }

  connect() {
    if (this.otherId) {
      console.log(this.otherId);
      const conn = this.peer.connect(this.otherId);
      if (conn) {
        console.log('Connexion établie.', conn);
        this.presentModal(conn);
      }
    }

  }


  async presentModal(conn) {
    const modal = await this.modalController.create({
      component: ModalChatPage,
      componentProps: {
        conn,
        myId: this.myId
      }
    });
    modal.onDidDismiss().then(() => {
      console.log('closed');
    });
    return await modal.present();
  }
}

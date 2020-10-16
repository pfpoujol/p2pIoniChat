import {Component, OnDestroy, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {ModalController} from '@ionic/angular';
import {ModalChatPage} from '../modal-chat/modal-chat.page';
// import {WebrtcService} from "../webrtc.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  peer: Peer;
  otherId: string;
  private myId: string;
  constructor(public modalController: ModalController) {}
  // constructor(public webrtcService: WebrtcService) {}
  ngOnInit() {
    this.peer = new Peer(undefined, {debug: 3});
    this.peer.on('open', (id) => {
      this.myId = id;
      console.log(id);
    });
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        console.log('conn opened');
        this.presentModal(conn);
      });
    });
    this.peer.on('error', (err) => {
      console.log(err);
    });

  }


  connect() {
    if (this.otherId) {
      const conn = this.peer.connect(this.otherId);
      conn.on('open', () => {
        console.log('conn opened');
        this.presentModal(conn);
      });
    }

  }


  async presentModal(conn) {
    const modal = await this.modalController.create({
      component: ModalChatPage,
      componentProps: {
        conn,
        myId: this.myId,
        peer: this.peer
      }
    });
/*    modal.onDidDismiss().then(() => {
      console.log('closed');
    });*/
    return await modal.present();
  }

  ngOnDestroy() {
    this.peer.destroy();
  }
}

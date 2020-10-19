import {Component, OnDestroy, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {ModalController} from '@ionic/angular';
import {ModalChatPage} from '../modal-chat/modal-chat.page';

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

  // A la création de la page
  ngOnInit() {
    // instantiation de l'objet Peer pour pouvoir se connecter à un autre pair ou être en écoute pour une connexion entrante.
    this.peer = new Peer(undefined, {debug: 3});

    // Récupération de l'id lorsque la connexion au PeerServer est établi.
    this.peer.on('open', (id) => {
      //
      this.myId = id;
    });

    // Ecoute pour une connexion entrante puis, ouverture du chat.
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        console.log('conn opened');
        this.presentChat(conn);
      });
    });
    this.peer.on('error', (err) => {
      console.log(err);
    });

  }


  connect() {
    if (this.otherId) {
      // Connexion à une pair distant grace à son ID puis, ouverture du chat.
      const conn = this.peer.connect(this.otherId);
      conn.on('open', () => {
        console.log('conn opened');
        this.presentChat(conn);
      });
    }

  }

  /**
   * Ouverture de la fenêtre de chat en passant le l'objet DataConnection
   */
  async presentChat(conn: Peer.DataConnection) {
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

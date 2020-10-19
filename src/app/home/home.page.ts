import {Component, OnDestroy, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {AlertController, ModalController} from '@ionic/angular';
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
  constructor(public modalController: ModalController, public alertController: AlertController) {}

  // A la création de la page,
  ngOnInit() {
    // instantiation de l'objet Peer avec un identifiant automatique
    this.peer = new Peer(undefined, {debug: 3});

    // Récupération de l'id lorsque la connexion au PeerServer est établi.
    this.peer.on('open', (id) => {
      console.log(id);
      this.myId = id;
    });

    // Ecoute pour une connexion entrante puis,
    this.peer.on('connection', (conn) => {
      // lorsque la connexion est ouverte, affichage du chat.
      conn.on('open', () => {
        console.log('conn opened');
        this.presentChat(conn);
      });
    });
    this.peer.on('error', (err) => {
      console.log(err);
      switch(err.type) {
        case 'peer-unavailable': {
          this.presentAlert('Pair indisponible',
              'Le pair avec lequel vous essayez de vous connecter n\'existe pas.')
              .then(() => {
            this.otherId = '';
          });
          break;
        }
        default: {
          console.log(err)
        }
      }
    });

  }


  connect() {
    if (this.otherId) {
      // Connexion à un pair distant grace à son ID puis,
      const conn = this.peer.connect(this.otherId);
      // lorsque la connexion est ouverte, affichage du chat.
      conn.on('open', () => {
        console.log('conn opened');
        this.presentChat(conn);
      });
    }

  }

  /**
   * Ouverture de la fenêtre de chat en lui passant le l'objet DataConnection
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
    modal.onWillDismiss().then(() => {
      this.otherId = '';
    });
    modal.onDidDismiss().then((dataReterned) => {
      if (dataReterned) {
        console.log(dataReterned)
        switch (dataReterned.data) {
          case 'closedByPartner' : {
            this.presentAlert('Fin de la communication', 'Votre partenaire à mis fin à la communication.');
          }
        }
      }
      console.log('closed');
    });
    return await modal.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
  ngOnDestroy() {
    this.peer.destroy();
  }
}

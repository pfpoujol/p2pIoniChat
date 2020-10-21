import {Component, OnDestroy, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {ModalChatPage} from '../modal-chat/modal-chat.page';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  peer: Peer;
  otherId: string;
  private myId: string;
  tryingToConnect = false;
  private subscription: Subscription;
  modalOpen = false;
  constructor(public modalController: ModalController, public alertController: AlertController, public platform: Platform) {
    this.exitAppOnBackBtnPress();
  }

  // A la création de la page.
  ngOnInit() {
    // Instantiation de l'objet Peer avec un identifiant automatique.
    this.peer = new Peer(undefined, {debug: 3});

    // Ecoute de l'event qui signal que la connexion au PeerServer est établi : récupération de l'id.
    this.peer.on('open', (id) => {
      console.log(id);
      this.myId = id;
    });

    // Ecoute pour une connexion entrante, puis,
    this.peer.on('connection', (conn) => {
      // lorsque la connexion est ouverte, affichage du chat.
      conn.on('open', () => {
        this.presentChatModal(conn);
      });
    });
    // en cas d'erreur
    this.peer.on('error', (err) => {
      switch (err.type) {
        // L'ID qu'on essaye de contacter n'existe pas.
        case 'peer-unavailable': {
          this.presentAlert('Pair indisponible', 'Le pair avec lequel vous essayez de vous connecter n\'existe pas.');
          this.otherId = '';
          this.tryingToConnect = false;
          break;
        }
        case 'server-error': {
          this.presentAlert('Erreur serveur',
              'Une erreur s\'est produite, essayez de recharger l\'app.').then(() => {
            // @ts-ignore
            navigator.app.exitApp();
          });
          break;
        }
        default: {
          console.log(err.type);
        }
      }
    });
  }

  /**
   * Clic bouton "Contacter".
   */
  connect() {
      this.tryingToConnect = true;
      // Connexion à un pair distant grace à son ID, puis,
      const conn = this.peer.connect(this.otherId);
      // lorsque la connexion est ouverte, affichage du chat.
      conn.on('open', () => {
        this.tryingToConnect = false;
        this.presentChatModal(conn);
      });
  }

  /**
   * Ouverture de la fenêtre de chat en lui passant le l'objet DataConnection
   */
  async presentChatModal(conn: Peer.DataConnection) {
    this.modalOpen = true;
    const modal = await this.modalController.create({
      component: ModalChatPage,
      componentProps: {
        conn,
        myId: this.myId,
        peer: this.peer
      }
    });
    // à la fermeture de la fenêtre
    modal.onWillDismiss().then(() => {
      this.otherId = '';
      this.tryingToConnect = false;
    });
    modal.onDidDismiss().then((dataReterned) => {
      this.modalOpen = false;
      if (dataReterned) {
        switch (dataReterned.data) {
          case 'closedByPartner' : {
            this.presentAlert('Fin de la communication', 'Votre partenaire à mis fin à la communication ou la connexion a été perdu.');
          }
        }
      }
    });
    await modal.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
    return alert.onDidDismiss();
  }
  async presentAlertConfirmExit() {
    const alert = await this.alertController.create({
      header: 'Quitter',
      message: 'Etes-vous sûr de vouloir quitter l\'application ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Quitter',
          handler: () => {
            this.peer.destroy();
            // @ts-ignore
            navigator.app.exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnDestroy() {
    // Fermeture de la connexion au serveur et fin des connexions existantes
    this.peer.destroy();
    this.subscription.unsubscribe();
  }
  exitAppOnBackBtnPress() {
    this.subscription = this.platform.backButton.subscribeWithPriority(666666, () => {
      if (this.constructor.name === 'HomePage') {
        this.presentAlertConfirmExit();
      }
    });
  }
}

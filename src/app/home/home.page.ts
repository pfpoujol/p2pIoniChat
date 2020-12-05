import {Component, OnDestroy, OnInit} from '@angular/core';
import Peer from 'peerjs';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {ModalChatPage} from '../modal-chat/modal-chat.page';
import {Subscription} from 'rxjs';
import {Storage} from '@ionic/storage';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {PeerServerCredentials} from '../peerserver-credentials';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  peer: Peer;
  myId: string = null;
  tryingToConnect = false;
  modalOpen = false;

  private subscription: Subscription;

  constructor(public modalController: ModalController,
              public alertController: AlertController,
              public platform: Platform,
              public storage: Storage,
              public barcodeScanner: BarcodeScanner) {
    this.exitAppOnBackBtnPress();
  }

  // A la création de la page.
  ngOnInit() {
    this.storage.get('peerId').then(id => {
      // Instantiation de l'objet Peer
      this.initPeer(id);

      // Ecoute de l'event qui signal que la connexion au PeerServer est établi : récupération de l'id.
      this.peer.on('open', (newId) => {
        console.log(newId);
        // stockage dans localStorage pour les prochaines sessions
        this.storage.set('peerId', newId);
        this.myId = newId;
      });

      // Ecoute pour une connexion entrante, puis,
      this.peer.on('connection', (conn) => {
        // lorsque la connexion est ouverte, affichage du chat.
        conn.on('open', () => {
          this.tryingToConnect = false;
          this.presentChatModal(conn);
        });
      });
      // en cas d'erreur
      this.onPeerError();
    });
  }

  initPeer(id: string | null) {
    // si id=null (n'existe pas dans localStorage), un nouveau ID est généré
    this.peer = new Peer(id, PeerServerCredentials);
  }

  /**
   * Clic bouton "Scanner" et scan.
   */
  connect(partnerId: string) {
      this.tryingToConnect = true;
      // Connexion à un pair distant grace à son ID, puis,
      const conn = this.peer.connect(partnerId);
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
        myId: this.myId
      }
    });
    // à la fermeture de la fenêtre
    modal.onWillDismiss().then(() => {
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

  /**
   * Ouverture de l'appareil photo pour scanner le QCcode du partenaire et s'y connecter
   */
  scanCode() {
    this.barcodeScanner
        .scan()
        .then(barcodeData => {
          if (!barcodeData.cancelled) {
            if (barcodeData.format === 'QR_CODE' && barcodeData.text !== '') {
              // Tentative de connexion si QRcode conforme;
              this.connect(barcodeData.text);
            } else if (barcodeData.text === '') {
              this.presentAlert('QR code erroné', 'QR codes ilisible');
            } else {
              this.presentAlert('QR code erroné', 'Seul les QR codes sont autorisés.');
            }
          }
        })
        .catch(err => {
          console.log('Error', err);
        });
  }

  onPeerError() {
    this.peer.on('error', (err) => {
      switch (err.type) {
          // L'ID qu'on essaye de contacter n'existe pas.
        case 'peer-unavailable': {
          this.presentAlert('Pair indisponible', 'Le pair avec lequel vous essayez de vous connecter n\'existe pas.');
          this.tryingToConnect = false;
          break;
        }
        case 'server-error': {
          this.presentAlert('Erreur PeerServer',
              'Une erreur s\'est produite, essayez de recharger l\'app.').then(() => {
            // @ts-ignore
            navigator.app.exitApp();
          });
          break;
        }
        case 'unavailable-id': {
          this.presentAlert('ID indisponible', 'L\'ID généré est déjà, rechargez l\'app, un nouveau vous sera attribué.').then(() => {
            // @ts-ignore
            this.storage.clear().then(() => navigator.app.exitApp());
          });
          break;
        }
        case 'network': {
          this.presentAlert('Erreur PeerServer',
              'La connexion avec le serveur a été perdu, veuillez relancer le PeerServer.').then(() => {
            // @ts-ignore
            navigator.app.exitApp();
          });
          break;
        }
        default: {
          console.log(err);
          console.log(err.type);
        }
      }
    });
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
}

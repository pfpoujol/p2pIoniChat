Informations générales
====
- Technologie employée : Ionic (Angular)
- Library utilisée : [PeerJS](https://peerjs.com/)
- Support visé : Android

Pour faciliter les connexions et contourner les problématiques réseaux, l'application se connecte également à un serveur ([PeerServer](https://github.com/peers/peerjs-server/blob/master/README.md#peerserver-a-server-for-peerjs)). 
À noter qu'aucune donnée peer-to-peer ne passe par ce serveur, celui-ci agit uniquement en tant que médiateur de connexion. Il est ainsi possible de s'envoyer des messages entre 2 appareils, même si ces derniers ne sont pas connectés sur le même réseau.

Mise en route
====
### Executer PeerServer
Pour executer le serveur, il faut d'abord se connecter sur [Gitpod](https://gitpod.io/login/) avec le compte GitHub fourni.

Lancer le serveur : https://gitpod.io/start/#be67f35d-dfc8-49a4-973f-2fa9e7406ae1

### Installer l'application
Lien de l'apk : https://github.com/pfpoujol/p2pIoniChat/releases/tag/1.0.0

Veillez bien à ce que le serveur soit toujours actif lorsque vous utilisez l'application.

Aperçu de l'app
=
Voir les répertoires **home** et **modal-chat** depuis [/src/app](https://github.com/pfpoujol/p2pIoniChat/tree/master/src/app).
### Screenshot
<img src="screenshot_home.jpg" alt="home" width="500"/> <img src="screenshot_modal_chat.jpg" alt="home" width="500"/>





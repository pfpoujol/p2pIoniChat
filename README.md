Informations générales
====
- Technologie employée : Ionic (Angular)
- Library utilisée : [PeerJS](https://peerjs.com/)
- Support visé : Android

Pour faciliter les connexions et contourner les problématiques réseaux, l'application se connecte également à un serveur ([PeerServer](https://github.com/peers/peerjs-server/blob/master/README.md#peerserver-a-server-for-peerjs)). 
À noter qu'aucune donnée peer-to-peer ne passe par ce serveur, celui-ci agit uniquement en tant que médiateur de connexion. Il est ainsi possible de s'envoyer des messages entre 2 appareils, même si ces derniers ne sont pas connectés sur le même réseau.

Mise en route
====
### Executez un PeerServer
Lancez votre propre serveur sur Gitpod.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/peers/peerjs-server)

Dans le fichier ``peerserver-credentials.ts``, remplacez l'url de la ligne *host* par celui de votre serveur.

### Créez votre application Android
Commande :```ionic cordova run andoid```

Veillez bien à ce que le serveur soit toujours actif lorsque vous utilisez l'application.

Screenshot
===
<img src="screenshot_home.jpg" alt="home" width="500"/> <img src="screenshot_modal_chat.jpg" alt="home" width="500"/>





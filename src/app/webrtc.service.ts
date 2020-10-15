import { Injectable } from '@angular/core';
// import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
/*  peer: Peer;
  myId: string;
  conn: Peer.DataConnection;*/

  constructor() {
    /*this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.myId = id;
    });
    this.peer.on('connection', (conn) => {
      console.log('Connexion établie.', conn)
      this.conn = conn;
      this.conn.on('data', (data) => {
        console.log('Received', data);
      });
    })*/
  }
}

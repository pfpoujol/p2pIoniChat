import {Component, OnInit} from '@angular/core';
import Peer from 'peerjs';
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
  private conn: Peer.DataConnection;
  constructor() {}
  //constructor(public webrtcService: WebrtcService) {}
  ngOnInit() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.myId = id;
      console.log(id);
    });
    this.peer.on('connection', (conn) => {
      console.log('Connexion établie.', conn)
      this.conn = conn;
      this.conn.on('data', function(data) {
        console.log('Received', data);
      });
    })

  }

  connect() {
    if(this.otherId) {
      console.log(this.otherId);
      this.conn = this.peer.connect(this.otherId);
      this.conn.on('data', function(data) {
        console.log('Received', data);
      });
    }

  }
  sayHi() {
    this.conn.send('Salut !');
  }
}

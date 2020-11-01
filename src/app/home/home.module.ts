import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ModalChatPageModule} from '../modal-chat/modal-chat.module';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {QRCodeModule} from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalChatPageModule,
    QRCodeModule
  ],
  declarations: [HomePage],
  providers: [BarcodeScanner]
})
export class HomePageModule {}

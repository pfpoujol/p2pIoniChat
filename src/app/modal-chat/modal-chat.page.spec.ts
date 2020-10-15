import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChatPage } from './modal-chat.page';

describe('ModalChatPage', () => {
  let component: ModalChatPage;
  let fixture: ComponentFixture<ModalChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

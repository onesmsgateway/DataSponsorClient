import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMemberComponent } from './bank-member.component';

describe('BankMemberComponent', () => {
  let component: BankMemberComponent;
  let fixture: ComponentFixture<BankMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

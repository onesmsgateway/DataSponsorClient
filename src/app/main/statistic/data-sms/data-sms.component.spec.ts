import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSmsComponent } from './data-sms.component';

describe('DataSmsComponent', () => {
  let component: DataSmsComponent;
  let fixture: ComponentFixture<DataSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

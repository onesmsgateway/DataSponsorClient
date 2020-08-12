import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCodeComponent } from './data-code.component';

describe('DataCodeComponent', () => {
  let component: DataCodeComponent;
  let fixture: ComponentFixture<DataCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCodeHisComponent } from './data-code-his.component';

describe('DataCodeHisComponent', () => {
  let component: DataCodeHisComponent;
  let fixture: ComponentFixture<DataCodeHisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCodeHisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCodeHisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

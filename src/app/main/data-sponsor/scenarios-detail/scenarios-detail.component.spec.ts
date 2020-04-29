import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosDetailComponent } from './scenarios-detail.component';

describe('ScenariosDetailComponent', () => {
  let component: ScenariosDetailComponent;
  let fixture: ComponentFixture<ScenariosDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

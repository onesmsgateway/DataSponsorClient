import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDataComponent } from './point-data.component';

describe('PointDataComponent', () => {
  let component: PointDataComponent;
  let fixture: ComponentFixture<PointDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

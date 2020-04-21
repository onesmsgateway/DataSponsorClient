import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTelcoComponent } from './package-telco.component';

describe('PackageTelcoComponent', () => {
  let component: PackageTelcoComponent;
  let fixture: ComponentFixture<PackageTelcoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTelcoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTelcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

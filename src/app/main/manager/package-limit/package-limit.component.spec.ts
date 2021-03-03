import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageLimitComponent } from './package-limit.component';

describe('PackageLimitComponent', () => {
  let component: PackageLimitComponent;
  let fixture: ComponentFixture<PackageLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

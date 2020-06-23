import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosBirthdayComponent } from './scenarios-birthday.component';

describe('ScenariosBirthdayComponent', () => {
  let component: ScenariosBirthdayComponent;
  let fixture: ComponentFixture<ScenariosBirthdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosBirthdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

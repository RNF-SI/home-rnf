import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteContactComponent } from './alerte-contact.component';

describe('AlerteContactComponent', () => {
  let component: AlerteContactComponent;
  let fixture: ComponentFixture<AlerteContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlerteContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlerteContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

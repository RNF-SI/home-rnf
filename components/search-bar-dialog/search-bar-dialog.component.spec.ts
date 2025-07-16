import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarDialogComponent } from './search-bar-dialog.component';

describe('SearchBarDialogComponent', () => {
  let component: SearchBarDialogComponent;
  let fixture: ComponentFixture<SearchBarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../app-routing.module';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NavHomeComponent } from './components/nav-home/nav-home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { InputErrorPipe } from './pipes/input-error.pipe';

@NgModule({
  declarations: [
    LogoutComponent,
    NavHomeComponent,
    InputErrorPipe,
    LoadingSpinnerComponent,
    NotFoundComponent,
    AccessDeniedComponent
  ],
  exports: [
    FontAwesomeModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingSpinnerComponent
  ], imports: [CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FontAwesomeModule,
    NgbModule,
    MatButtonModule,
    MatAutocompleteModule], providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} },
      provideHttpClient(withInterceptorsFromDi())
    ]
})
export class HomeRnfModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(
      fab,
      fas,
      far
    );
  }
}

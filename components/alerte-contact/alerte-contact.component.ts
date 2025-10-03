import { Component } from '@angular/core';
import { ContactHomeRnfComponent } from "../contact/contact.home.rnf.component";
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-alerte-contact',
  imports: [ContactHomeRnfComponent,MatDialogModule,MatButtonModule],
  templateUrl: './alerte-contact.component.html',
  styleUrl: './alerte-contact.component.scss'
})
export class AlerteContactComponent {
  constructor(
    public dialogRef: MatDialogRef<AlerteContactComponent>
    
  ) {}

  close(){
    this.dialogRef.close();
  }
}

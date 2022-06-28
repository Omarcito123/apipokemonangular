import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfirmacionComponent } from './../dialog-confirmacion/dialog-confirmacion.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit(): void {
  }

  openDialogLogout(): void {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '350px',
      data: {mensaje: '¿Estas seguro que quieres cerrar la sesion?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'aceptar') {
        this.authService.logout();
      }
    });
  }
}

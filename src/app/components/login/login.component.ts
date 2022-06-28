import { Component, OnInit } from '@angular/core';
import { user } from '../../models/user';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLogin: any = new user();

  constructor(private api: ApiService, private router: Router, private SpinnerService: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  register(){
    this.router.navigate(['/dashboard/register']);
  }

  login(user: user) {
      if (user.username == undefined || user.username == ''){
        this.api.openSnackBar('Favor ingresa tu usuario', 'X', 'error');
      } else if (user.password == undefined || user.password == '') {
        this.api.openSnackBar('Favor ingresa tu contraseña', 'X', 'error');
      } else {
        this.SpinnerService.show();  
        this.api.login(user).subscribe(
          (response) => {
            if (response != null) {
              if (response.state == "Success") {
                this.authService.setJwt(response.data);      
                this.router.navigate(['/dashboard/perfil']);
              } else {
                this.api.openSnackBar(response.message, 'X', 'error');
              }
            } else {
              this.api.openSnackBar("Error", 'X', 'error');
            }
            this.SpinnerService.hide(); 
          },
          (error) => {
            this.api.openSnackBar(error, 'X', 'error');
            this.SpinnerService.hide(); 
          }
        );
      }
  }
}

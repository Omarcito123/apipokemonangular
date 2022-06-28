import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { pokemon } from '../../models/pokemon';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userSesion: any;
  imagePath: any;
  age: any;
  id_master: number = 0;

  pokemonList: Array<pokemon> = [];

  constructor(private api: ApiService, private SpinnerService: NgxSpinnerService, private authService: AuthService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.userSesion = this.authService.currentUserValue;
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.userSesion.img_perfil);
    let birthday = new Date(this.userSesion.birthday);
    var timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    this.id_master = this.userSesion.id_master;
    this.getMastePokemonList();
  }

  getMastePokemonList(){
    this.SpinnerService.show(); 
      this.api.getMastePokemonList(this.id_master).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.pokemonList = response.data;                   
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar("Error al obtener los pokemon del maestro", 'X', 'error');
          }
          this.SpinnerService.hide(); 
        },
        (error) => {
          this.SpinnerService.hide(); 
          if(error.includes("403")){
            this.authService.logout();
          }
        }
      );
  }
}

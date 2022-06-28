import { pokemon } from './../../models/pokemon';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { perfil } from '../../models/perfil';
import { NgxSpinnerService } from "ngx-spinner"; 
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private base64textString: String = "";
  imagePath: any;
  pokemonList: any;
  pokemonSelectList: Array<pokemon> = [];
  perfil: any = new perfil();
  statsList: any = [];
  pokemonSelect = new pokemon();
  firstStep: any = true;
  secondStep: any = false;
  pokemon1: number = 0;
  pokemon2: number = 0;
  pokemon3: number = 0;
  age: any;
  showDocumentNumber = false;

  constructor(private api: ApiService, private router: Router, private SpinnerService: NgxSpinnerService, public dialog: MatDialog, private authService: AuthService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.imagePath = './assets/img/user.png';
    this.getPokemonList("offset=0&limit=9");
  }

  getPokemonList(pagination: string){
    this.SpinnerService.show();
      this.api.getPokemonList(pagination).subscribe(
        (response) => {
          if (response != null) {
            if (response.state == "Success") {
              this.pokemonList = response.data;                    
            } else {
              this.api.openSnackBar(response.message, 'X', 'error');
            }
          } else {
            this.api.openSnackBar("Error al obtener los pokemon", 'X', 'error');
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

  previous(previous: string){
    let toArray =  previous.split("?");
    this.getPokemonList(toArray[1]);
  }

  next(next: string){
    let toArray =  next.split("?");
    this.getPokemonList(toArray[1]);
  }

  selectPokemon(item: any){
    const index = this.pokemonSelectList.findIndex(poke => poke.number_pokemon_pokeapi === item.id); 
    if(index != -1){
      this.pokemonSelectList.splice(index, 1);      
      if(this.pokemon1 === item.order){
        this.pokemon1 = 0;
      }
      if(this.pokemon2 === item.order){
        this.pokemon2 = 0;
      }
      if(this.pokemon3 === item.order){
        this.pokemon3 = 0;
      }
      return;
    }
    
    if(this.pokemonSelectList.length < 3){
      this.pokemonSelect = new pokemon();
      this.pokemonSelect.number_pokemon_pokeapi = item.id;
      this.pokemonSelect.name = item.name;
      this.pokemonSelect.pokemon_type = item.types[0].type.name;

      this.statsList = item.stats;

      this.statsList.forEach((element: { stat: { name: string; }; base_stat: number; }) => {
        if(element.stat.name = 'hp'){
          this.pokemonSelect.hp = element.base_stat;
        }
        if(element.stat.name = 'attack'){
          this.pokemonSelect.attack = element.base_stat;
        }
        if(element.stat.name = 'defense'){
          this.pokemonSelect.defense = element.base_stat;
        }
        if(element.stat.name = 'special-attack'){
          this.pokemonSelect.special_attack = element.base_stat;
        }
        if(element.stat.name = 'special-defense'){
          this.pokemonSelect.special_defense = element.base_stat;
        }
        if(element.stat.name = 'speed'){
          this.pokemonSelect.speed = element.base_stat;
        }
      });

      this.pokemonSelect.image = item.sprites.front_default;
      this.pokemonSelectList.push(this.pokemonSelect);
      if(this.pokemon1 == 0){
        this.pokemon1 = item.order;
      }
      else if(this.pokemon2 == 0){
        this.pokemon2 = item.order;
      }
      else if(this.pokemon3 == 0){
        this.pokemon3 = item.order;
      }
    }else{
      this.api.openSnackBar("Ya seleccionaste los 3 pokemon solicitados", 'X', 'error');
    }    
  }

  onFileChange(evt: any){
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
        var reader = new FileReader();
        reader.onload =this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                 + this.base64textString);
    this.perfil.img_perfil = this.base64textString;
   }

   continue(){
    if(this.perfil.name === undefined || this.perfil.name == ''){
      console.log('entro');
      this.api.openSnackBar("Ingresa tu nombre por favor", 'X', 'error');
      return;
    }
    if(this.perfil.hobby === undefined || this.perfil.hobby == ''){
      this.api.openSnackBar("Ingresa tu pasatiempo favorito", 'X', 'error');
      return;
    }
    if(this.perfil.birthday === undefined || this.perfil.birthday == ''){
      this.api.openSnackBar("Ingresa tu fecha de nacimiento", 'X', 'error');
      return;
    }
    if(this.perfil.username === undefined || this.perfil.username == ''){
      this.api.openSnackBar("Ingresa un nombre de usuario", 'X', 'error');
      return;
    }
    if(this.perfil.password == undefined || this.perfil.password == ''){
      this.api.openSnackBar("Ingresa una contraseña", 'X', 'error');
      return;
    }
    if(this.perfil.img_perfil == undefined || this.perfil.img_perfil == ''){
      this.api.openSnackBar("La imagen de perfil es requerida", 'X', 'error');
      return;
    }
    let birthday = new Date(this.perfil.birthday);
    var timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    if(this.age < 18){
      this.perfil.document_name = 'CARNET DE MENORIDAD';
      this.perfil.document_number = '0';
      this.showDocumentNumber = false;
    }else{
      this.perfil.document_name = 'DUI';
      this.showDocumentNumber = true;
    }
    if(this.age >= 18){
      if(this.perfil.document_number == undefined || this.perfil.document_number == ''){
        this.api.openSnackBar("El numero de documento requerido", 'X', 'error');
        return;
      }
    }
    this.firstStep = false;
    this.secondStep = true;
   }

   selectDate(){
    let birthday = new Date(this.perfil.birthday);
    var timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    if(this.age < 18){
      this.perfil.document_name = 'CARNET DE MENORIDAD';
      this.perfil.document_number = '0';
      this.showDocumentNumber = false;
    }else{
      this.perfil.document_name = 'DUI';
      this.showDocumentNumber = true;
    }
   }

   back(){
    this.firstStep = true;
    this.secondStep = false;
   }

   savePerfil(){    
    this.perfil.pokemonList = this.pokemonSelectList;
    this.SpinnerService.show();
    this.api.signup(this.perfil).subscribe(
      (response) => {
        console.log(response);
        if (response != null) {          
          if (response.state == "Success") {
            this.api.openSnackBar(response.message, 'X', 'success');
            this.router.navigate(['/login']);                   
          } else {
            this.api.openSnackBar(response.message, 'X', 'error');
          }
        } else {
          this.api.openSnackBar("Error al crear tu perfil", 'X', 'error');
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

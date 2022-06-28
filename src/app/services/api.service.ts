import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { user } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseModel } from '../models/response';
import { perfil } from '../models/perfil';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlServer: string;
  userCredencial: any = new user();
  userSesion: any;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private authService: AuthService) {
    this.urlServer = `${environment.apiUrl}/api`;
  }

  login(data: user): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let url = `${this.urlServer}/pokemon/login`;
    const body = new HttpParams()
    .set('username', data.username)
    .set('password', data.password);
    let options = { headers: headers };
    return this.http.post<ResponseModel>(url, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getMastePokemonList(id_master: number): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let url = `${this.urlServer}/pokemon/getMasterPokemon/` + id_master;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getPokemonList(pagination: string): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let url = `${this.urlServer}/pokemon/getPokemonList?` + pagination;
    let options = { headers: headers };
    return this.http.get<ResponseModel>(url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  signup(perfil: perfil): Observable<ResponseModel> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    let url = `${this.urlServer}/pokemon/signup`;
    let options = { headers: headers };
    let body = JSON.stringify(perfil);
    return this.http.post<ResponseModel>(url, body, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  openSnackBar(message: string, action: string, type: any) {
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: [type]
    });
  }
}

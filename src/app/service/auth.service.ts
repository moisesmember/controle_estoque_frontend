import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../pages/login/usuario.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {tap} from 'rxjs/operators'
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authEmitter = new EventEmitter()
  user: Usuario
  API: string
  lastUrl: string
  constructor(private _http: HttpClient,
              private _router: Router
    ) { 
    this.API = environment.host
  }

  getName(){
    return localStorage.getItem('nome') || 'nao logado' 
  }

  logout(){
    localStorage.clear()
  }

  login(values: Usuario): Observable<Usuario> {
    return this._http.patch<Usuario>(`${this.API}/auth`,
                      values)
                    .pipe(
                      tap((user: Usuario) => {
                          localStorage.setItem('token', String(user.token))
                          localStorage.setItem('nome', String(user.nmUsuario))
                          localStorage.setItem('login', String(user.dsLogin))
                          localStorage.setItem('user', JSON.stringify(user))
                          localStorage.setItem('cdUser', String(user.cdUsuario))
                          return this.user = user
                      })
                    )  
                    
  }
  handleLogin(path: string = this.lastUrl ) {
    this._router.navigate(['/login', btoa(path)])
  }

  avisoLogin(status: boolean = true){
		this.authEmitter.emit(status)
	}

  isLoggedIn(){
		return localStorage.getItem('token') != null
	}

  getCdUsuario(){
    return 1
  }

  obterMenus(){
    return [
      /*{
        menu: 'Dashboard', 
        url: ['/dashboard'], 
        logo: 'fa-dashboard',
      },*/
      {
        menu: 'Entrada', 
        url: ['/entrada'], 
        logo: 'fa-cart-arrow-down',
      },
      {
        menu: 'Saída', 
        url: ['/saida'], 
        logo: 'fa-balance-scale',
      },
      {
        menu: 'Consulta', 
        url: ['/consulta'], 
        logo: 'fa-search',
      }
      
    ]
	}



}

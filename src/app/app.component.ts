import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-angular';

  constructor(private _authService: AuthService){
		this.listenLogin()
	}

  listenLogin(){
		this._authService
			.authEmitter
			.subscribe( status =>{
				
				if( !status ){
					this._authService.authEmitter.unsubscribe
				}
				this.isLoggedIn()
			})
	}


  isLoggedIn(){
		return this._authService.isLoggedIn()
	}

}

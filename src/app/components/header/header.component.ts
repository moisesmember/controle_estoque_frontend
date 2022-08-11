import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService: AuthService,private _router: Router, private _ngZone: NgZone) { }

  ngOnInit(): void {
  }

  getName(){
		return this._authService.getName()
	}

	getReducedName(){
		let nameArray = this._authService.getName().split(' ')
		return `${nameArray[0]} ${nameArray[ nameArray.length - 1 ]}`
	}

	logout(){
		this._authService.logout()
		this._authService.avisoLogin(false)
		
		this._ngZone.run(() => this._router.navigateByUrl( '/login' ) )
		
	}


}

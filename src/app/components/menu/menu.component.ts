import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Menu } from './menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menus: Menu[] = []
  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this.obterListaMenu()
  }

  getName(){
    return this._authService.getName()
  }

  obterListaMenu(){
		this.menus = this._authService.obterMenus()
  }

}

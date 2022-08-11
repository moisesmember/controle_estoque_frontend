import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Usuario } from './usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({
    dsLogin: new FormControl(null, {validators: [Validators.required]}),
    dsSenha: new FormControl(null, {validators: [Validators.required]})
  })
  constructor(private _authService: AuthService, private _router: Router){}

  ngOnInit(): void {
    
  }

  hasError(field: string){
    return this.formGroup.controls[field].invalid  && (this.formGroup.controls[field].touched || this.formGroup.controls[field].dirty)
  }

  logar(){
    this._authService
        .login( this.formGroup.value )
        .subscribe((user: Usuario)=>{
            
        })
    
  }

  isLoggedIn() {
    return this._authService.isLoggedIn()
  }

}

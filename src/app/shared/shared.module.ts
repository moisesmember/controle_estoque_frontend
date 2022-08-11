import { CommonModule, registerLocaleData } from "@angular/common";
import localePt from '@angular/common/locales/pt' 
import { ModuleWithProviders, NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "../components/footer/footer.component";
import { HeaderComponent } from "../components/header/header.component";
import { MenuComponent } from "../components/menu/menu.component";
import { LoginComponent } from "../pages/login/login.component";

import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ProdutoService } from "../service/produto.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModalConfirmComponent } from "../modal/modal-confirm/modal-confirm.component";
import { AuthInterceptor } from "../pages/login/auth.interceptor";
import { LoggedInGuard } from "../pages/login/loggedIn.guard";

registerLocaleData(localePt, 'pt-BR')
@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MenuComponent,
        LoginComponent,
        ModalConfirmComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AutocompleteLibModule,
        HttpClientModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HeaderComponent,
        FooterComponent,
        MenuComponent,
        LoginComponent,
        AutocompleteLibModule,
        HttpClientModule,
        ModalConfirmComponent,

    ]
})

export class SharedModule{
    static forRoot(): ModuleWithProviders<SharedModule>{
        return {
            ngModule: SharedModule,
            providers: [
                ProdutoService,
                LoggedInGuard,
                {provide: LOCALE_ID, useValue: 'pt-BR'},                
                {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
            ]
        }
    }

}
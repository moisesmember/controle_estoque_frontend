import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "src/app/service/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginService = this.injector.get(AuthService)        
        if(loginService.isLoggedIn()){
            const authRequest = request.clone({
                setHeaders: {'x-access-token': `${localStorage.getItem('token')}`}
            })
            return next.handle(authRequest)        
        }
        return next.handle(request)
    }
}
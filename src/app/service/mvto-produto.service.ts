import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MvtoProduto } from '../pages/entrada/mvto-produto.model';

@Injectable({
  providedIn: 'root'
})
export class MvtoProdutoService {
  private _API: string
  constructor(private _http: HttpClient) {
    this._API = `${environment.host}/api/v1/mvto-produto`
  }

  sendMvtoEstoque(item: MvtoProduto): Observable<MvtoProduto>{
    return this._http.post<MvtoProduto>(`${this._API}/multiple-create`, item)

  }
}

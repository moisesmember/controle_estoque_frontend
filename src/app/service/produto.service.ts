import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Produto } from '../pages/entrada/produto.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {saveAs} from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private _API: string
  constructor(private _http: HttpClient) {
    this._API = `${environment.host}/api/v1/produto`
  }

  findAll(search?: string): Observable<Produto[]> {
    let params: HttpParams | undefined
    if(search){
      params = new HttpParams().append('q', search)
    }
    return this._http.get<Produto[]>(`${this._API}`, {params: params})
  }

  findById(id: number): Observable<Produto>{
    return this._http.get<Produto>(`${this._API}/${id}`)
  }

  consulta(values: any): Observable<Produto[]>{
    return this._http.patch<Produto[]>(`${this._API}`, values)
  }

  download(values: any){
    return this._http.post(`${this._API}/pdf` ,values, {responseType: 'blob'})
  }  
  


}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PercentualCritico } from '../pages/percentual-critico/percentual-critico.model';

@Injectable({
  providedIn: 'root'
})
export class PercentualCriticoService {
  private _API: string
  constructor(private _http: HttpClient) { 
    this._API = `${environment.host}/api/v1/percentual-critico`
  }

  findById(): Observable<PercentualCritico>{
    return this._http.get<PercentualCritico>(`${this._API}/1`)
  }

  update(values: PercentualCritico): Observable<PercentualCritico>{
    return this._http.put<PercentualCritico>(`${this._API}/1`, values)
  }
}

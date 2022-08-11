import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paciente } from '../pages/saida/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private _API: string
  constructor(private _http: HttpClient) {
    this._API = `${environment.host}/api/v1/paciente`
  }

  getById(cdPaciente: number ): Observable<Paciente>{
    return this._http.get<Paciente>(`${this._API}/${cdPaciente}`)
  }
}

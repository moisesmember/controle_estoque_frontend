import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PercentualCriticoService } from 'src/app/service/percentual-critico.service';
import { PercentualCritico } from './percentual-critico.model';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-percentua-critico',
  templateUrl: './percentual-critico.component.html',
  styleUrls: ['./percentual-critico.component.css'],
  animations: [
		trigger('frameAppeared', [
		  state('ready', style({opacity: 1})),
		  transition('void => ready', [
			style({opacity: 0, transform: 'translate(-30px, -10px)'}),
			animate('300ms 0s ease-in-out')
		  ])
		]),
		trigger('campoInput',[
		  state('ready', style({width: '30px'})),
		  state('hidden', style({width: '0', opacity: 0})),
		  transition('* => *', [        
			animate('300ms 0s ease-in-out')
		  ])
		])
	  ]
})
export class PercentualCriticoComponent implements OnInit {
  frameState = 'ready'
  formGroup: FormGroup
  title = 'Atualizar Percentual Crítico '
  constructor(private _percentualCriticoService: PercentualCriticoService) { }

  ngOnInit(): void {
	this.formGroup = new FormGroup({
		valorPercentual: new FormControl(null, {validators: [Validators.required]})
	})

	this.getValue()
  }

	getValue(){
		this._percentualCriticoService
			.findById()
			.subscribe((percentual: PercentualCritico)=>{
				console.log('percentual', percentual);
				
				this.formGroup.controls['valorPercentual'].setValue(percentual.valorPercentual)
			})
	}

	update(){
		this._percentualCriticoService
			.update(this.formGroup.value)
			.subscribe((percentual: PercentualCritico)=>{
				Swal.fire(
					'Salvo!',
					'Valor atualizado com sucesso!',
					'success'
			  	)
			})
	}


}

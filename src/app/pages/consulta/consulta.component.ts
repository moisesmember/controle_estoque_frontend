import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, from } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

import Swal from 'sweetalert2';

import { ProdutoService } from 'src/app/service/produto.service';
import { Produto } from '../entrada/produto.model';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

import { Router } from '@angular/router';
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
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
export class ConsultaComponent implements OnInit {

  frameState = 'ready'
	produtoForm: FormGroup
	searchControl: FormControl
	keyword = 'dsProduto';
	produtos: Produto[] = []
	produtosEnviar: Produto[] = []
	closeResult = '';
	title = 'Consulta'
	dataTable: any;
	isPrint = false
	valuesParam = {}
	blob: any
	isGerando = false
	msgPrint = 'Imprimir'
	constructor(private _fb: FormBuilder,
				private _produtoService: ProdutoService,
				private _authService: AuthService,
				private chRef: ChangeDetectorRef,
				private _router: Router
		) { }
	
	ngOnInit(): void {
		const table: any = $('table');
				this.dataTable = table.DataTable(
					{
						searching: false,
						lengthMenu: [10,15],
						language: {
							sInfo:  "Mostrando registros de _START_ à _END_ de total de _TOTAL_ registros",
							oPaginate: {
								sFirst:    "Primeiro",
								sLast:    "Último",
								sNext:    "Próximo",
								sPrevious: "Anterior"
							},
						}
					});
		this.searchControl = this._fb.control('')
		this.produtoForm = this._fb.group({
			cdProduto: new FormControl(null,{validators: [Validators.required]}),
			searchControl: this.searchControl,
			percentual: new FormControl(0, {validators: [Validators.required, Validators.min(1)]})
		})

		this.searchControl.valueChanges
          .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(searchTerm => {
              //this.produtoForm.controls['cdProduto'].setValue(null)
              if(searchTerm.length > 3){
                return this._produtoService
                    .findAll(searchTerm)
                    .pipe(
                    catchError(error => from([])))   // evita quebra da aplicação caso der erro
                    
                }else return []
                
				}
						
        	)
			  
              
        ).subscribe(produtos => this.produtos = produtos)
    
	}
	
	selectEvent(item: Produto) {
		console.log('selectEvent', item);
		
		this.produtoForm.controls['cdProduto'].setValue(item.cdProduto)
	}
	
	onChangeSearch(search: string) {
		console.log('onChangeSearch', search);
		
		
	}
	buscarPorCodigo(){
		const value = this.produtoForm.controls['searchControl'].value
		console.log(!isNaN(Number(value)));
    
		if( !isNaN(Number(value)) ){
			if(Number(value) > 0){
        this._produtoService.findById(Number(value))
          .subscribe((response: Produto)=>{
            this.produtoForm.controls['cdProduto'].setValue(response.cdProduto)
            this.produtoForm.controls['searchControl'].setValue(response.dsProduto)
			console.log('buscarPorCodigo');
			
          })
      }
		}
		
	}
	

	closeAutocomplete(){
		this.produtos = []	
    	this.produtoForm.controls['cdProduto'].setValue(null)
	}

	incluir(){
		console.log(this.produtoForm.value);
		const { cdProduto, percentual, searchControl } = this.produtoForm.value
		let values = {}
		console.log('form', this.produtoForm.value);
		
		if( cdProduto && (percentual > 0)){
			console.log('cdProduto', cdProduto);
			
			values = {...values, cdProduto, percentual }
		}else if( (searchControl.length > 0) && percentual > 0){
		
		values = {...values, dsProduto: searchControl, percentual }
		}else if( cdProduto ){
		
		values = {...values, cdProduto }
		}else if( searchControl.length > 0 ){
		
		values = {...values, dsProduto: searchControl }
		}else if( percentual > 0 ){
		
		values = {...values, percentual }
		}
		this.valuesParam = values
		this._produtoService.consulta(values)
			.subscribe((produtos: Produto[])=>{
				
				this.produtosEnviar = produtos

				localStorage.setItem('produtos', JSON.stringify(this.produtosEnviar))

				this.chRef.detectChanges();

				
			})
    

		//this.limparCampos()
		
	}

	limparCampos(){
		this.produtoForm.controls['cdProduto'].setValue(null)
		this.produtoForm.controls['searchControl'].setValue(null)
		this.produtoForm.controls['percentual'].setValue(null)
	}

	remover(index: number){
		this.produtosEnviar.splice(index, 1);
	}

	

	alerta(index: number, qtdMvtoProduto: number){
		const produto = this.produtosEnviar[index]
		Swal.fire({
			title: 'Deseja corrigir a quantidade?',
			text: `Você já adicionou o item ${produto.dsProduto}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Fechar',
			confirmButtonText: 'Sim, atualize-o!'
		  }).then((result) => {
			if (result.isConfirmed) {				
				this.produtosEnviar[index].qtdMvtoProduto = qtdMvtoProduto
			
			}
		  })
	}

	perguntaRemover(index: number){
		const produto = this.produtosEnviar[index]
		Swal.fire({
			title: 'Deseja realmente remover?',
			text: `Você irá remover o item ${produto.dsProduto} da lista`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Fechar',
			confirmButtonText: 'Sim, remova-o!'
		  }).then((result) => {
			if (result.isConfirmed) {				
				this.remover(index)
			}
		  })
	}

	imprimir(){
		this.msgPrint = 'Gerando'
		this.isGerando = true
		this._produtoService
			.download(this.valuesParam)
			.subscribe((response: any )=>{
				this.blob = new Blob([response], {type: 'application/pdf'});

				var downloadURL = window.URL.createObjectURL(response);
				var link = document.createElement('a');
				link.href = downloadURL;
				link.download = "relatorio-produtos.pdf";
				link.click();
				this.isGerando = false
				this.msgPrint = 'Imprimir'
			})
			
	}

	
}

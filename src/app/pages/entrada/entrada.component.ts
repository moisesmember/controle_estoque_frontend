import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { from } from 'rxjs';
import {switchMap, tap, debounceTime, distinctUntilChanged, catchError} from 'rxjs/operators'
import { AuthService } from 'src/app/service/auth.service';
import { ProdutoService } from 'src/app/service/produto.service';
import { Produto } from './produto.model';
import { MvtoProduto } from './mvto-produto.model';
import { MvtoProdutoService } from 'src/app/service/mvto-produto.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
	selector: 'app-entrada',
	templateUrl: './entrada.component.html',
	styleUrls: ['./entrada.component.css'],
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
export class EntradaComponent implements OnInit {
	frameState = 'ready'
	produtoForm: FormGroup
	searchControl: FormControl
	keyword = 'dsProduto';
	produtos: Produto[] = []
	produtosEnviar: Produto[] = []
	closeResult = '';
	title = 'Entrada de Estoque'
	
	constructor(private _fb: FormBuilder,
				private _produtoService: ProdutoService,
				private _authService: AuthService,
				private _mvtoProdutoService: MvtoProdutoService
		) { }
	
	ngOnInit(): void {
		this.searchControl = this._fb.control('')
		this.produtoForm = this._fb.group({
			tpMvtoProduto: new FormControl('D'),
			cdProduto: new FormControl(null,{validators: [Validators.required]}),
			searchControl: this.searchControl,
			qtdMvtoProduto: new FormControl(0, {validators: [Validators.required, Validators.min(1)]})
		})

		this.searchControl.valueChanges
          .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(searchTerm => {
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
		this.produtoForm.controls['cdProduto'].setValue(item.cdProduto)
	}
	
	onChangeSearch(search: string) {
		console.log('onChangeSearch');
		
		
	}
	buscarPorCodigo(){
		const value = this.produtoForm.controls['searchControl'].value
		
		if( !isNaN(Number(value)) ){
			console.log('buscar');
			
			this._produtoService.findById(Number(value))
				.subscribe((response: Produto)=>{
					this.produtoForm.controls['cdProduto'].setValue(response.cdProduto)
					this.produtoForm.controls['searchControl'].setValue(response.dsProduto)
				})
		}
		
	}
	

	closeAutocomplete(){
		this.produtos = []	
	}

	incluir(){
		const { cdProduto, qtdMvtoProduto, searchControl } = this.produtoForm.value
		const produto: Produto = {
			cdProduto, qtdMvtoProduto, dsProduto: searchControl
		}

		const index = this.produtosEnviar.findIndex( produto => produto.cdProduto == cdProduto )

		if( index > -1 ){
			this.alerta(index, qtdMvtoProduto)			
		}else{
			this.produtosEnviar.push(produto)
		}

		this.limparCampos()
		
	}

	limparCampos(){
		this.produtoForm.controls['cdProduto'].setValue(null)
		this.produtoForm.controls['searchControl'].setValue(null)
		this.produtoForm.controls['qtdMvtoProduto'].setValue(0)
	}

	remover(index: number){
		this.produtosEnviar.splice(index, 1);
	}

	confirmar(){
		const { tpMvtoProduto } = this.produtoForm.value
		const cdUsuario = this._authService.getCdUsuario()
		const items = this.produtosEnviar.map(produto => ({cdProduto: produto.cdProduto, qtdMvtoProduto: produto.qtdMvtoProduto}))
		const produtos: MvtoProduto = {
			tpMvtoProduto,
			cdUsuario,
			itmvto: items
		}

		this._mvtoProdutoService.sendMvtoEstoque(produtos)
			.subscribe(()=>{
				Swal.fire(
					'Salvo!',
					'Dados enviados com sucesso!',
					'success'
			  	).then(()=>{
					this.produtosEnviar = []
				})
			})
		
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
			  /*Swal.fire(
				'Produto!',
				'Your file has been deleted.',
				'success'
			  )*/
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

	
	
	
	
}

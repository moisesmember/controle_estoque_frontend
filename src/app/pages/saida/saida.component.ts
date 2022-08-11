import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, from } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { MvtoProdutoService } from 'src/app/service/mvto-produto.service';
import { PacienteService } from 'src/app/service/paciente.service';
import { PercentualCriticoService } from 'src/app/service/percentual-critico.service';
import { ProdutoService } from 'src/app/service/produto.service';
import Swal from 'sweetalert2';
import { MvtoProduto } from '../entrada/mvto-produto.model';
import { Produto } from '../entrada/produto.model';
import { PercentualCritico } from '../percentual-critico/percentual-critico.model';
import { Paciente } from './paciente.model';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.component.html',
  styleUrls: ['./saida.component.css'],
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
export class SaidaComponent implements OnInit {

  frameState = 'ready'
	produtoForm: FormGroup
	searchControl: FormControl
	keyword = 'dsProduto';
	produtos: Produto[] = []
	produtosEnviar: Produto[] = []
	closeResult = '';
  	nomePaciente: string = ""
	title = 'Saída de Estoque'
	percent: number
	estoqueCritico: boolean = false
	produto: Produto 
	constructor(private _fb: FormBuilder,
				private _produtoService: ProdutoService,
				private _authService: AuthService,
				private _mvtoProdutoService: MvtoProdutoService,
				private _pacienteService: PacienteService,
				private _percentualCriticoService: PercentualCriticoService
		) { }
	
	ngOnInit(): void {
		this.searchControl = this._fb.control('')
		this.produtoForm = this._fb.group({
      		cdPaciente: new FormControl(null, {validators: [Validators.required]}),
			nmPaciente: new FormControl(null, {validators: [Validators.required]}),
			tpMvtoProduto: new FormControl('S'),
			cdProduto: new FormControl(null,{validators: [Validators.required]}),
			searchControl: this.searchControl,
			qtdMvtoProduto: new FormControl(0, {validators: [Validators.required, Validators.min(1)]})
		})

		this.searchControl.valueChanges
          .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(searchTerm => this._produtoService
              .findAll(searchTerm)
              .pipe(
                catchError(error => from([])))   // evita quebra da aplicação caso der erro            
              )
              
          ).subscribe(produtos => this.produtos = produtos)

		this.getPercentualCritico()
	}

	getPercentualCritico(){
		this._percentualCriticoService
			.findById()
			.subscribe((percentual: PercentualCritico)=>{
				this.percent = percentual.valorPercentual / 100
			})
	}

	
	
	selectEvent(item: Produto) {
		this.produtoForm.controls['cdProduto'].setValue(item.cdProduto)
		this.produto = item
		this.calcPercentual()
	}

	verificarEstoque(val: any){
		
		this.calcPercentual( Number(this.produto.qtdAtual) - Number(val))
	}
	
	
	onChangeSearch(search: string) {
		
		
	}
	buscarPorCodigo(){
		const value = this.produtoForm.controls['searchControl'].value
		
		if( !isNaN(Number(value)) ){
			console.log('buscar');
			
			this._produtoService.findById(Number(value))
				.subscribe((response: Produto)=>{
					this.produto = response
					this.produtoForm.controls['cdProduto'].setValue(response.cdProduto)
					this.produtoForm.controls['searchControl'].setValue(response.dsProduto)
					this.calcPercentual(  )
				})
		}
		
	}

	calcPercentual( qtde = 0 ){
		const produto = JSON.parse( JSON.stringify( this.produto )  )
		const calc = Number(produto.qtdReferencia) * this.percent
		produto.qtdAtual = qtde > 0 ? qtde : produto.qtdAtual
		this.estoqueCritico = false
		if( Number(produto.qtdAtual) <= calc  ){
			this.estoqueCritico = true
		}
		
	}
	onFocused(e: any) {
		console.log(e);
		
		// do something
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
		this.produto = {}
		
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
					this.limparTodosCampos()
				})
			})
		
	}

	limparTodosCampos(){
		this.produtoForm.controls['nmPaciente'].setValue(null)
		this.produtoForm.controls['cdPaciente'].setValue(null)
		this.produtoForm.controls['cdProduto'].setValue(null)
		this.produtoForm.controls['searchControl'].setValue(null)
		this.produtoForm.controls['qtdMvtoProduto'].setValue(0)
		this.nomePaciente = ""
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

	buscarPaciente(){
		const { cdPaciente } = this.produtoForm.value
		this._pacienteService.getById( cdPaciente )	
			.subscribe( (paciente: Paciente) => {
				this.nomePaciente = paciente.nmPaciente
				this.produtoForm.controls['nmPaciente'].setValue(paciente.nmPaciente)
			})	
	}
	

}

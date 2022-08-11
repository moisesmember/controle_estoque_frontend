import { Produto } from "./produto.model"

export interface MvtoProduto {
    tpMvtoProduto: string
    cdUsuario: number
    cdPaciente?: number
    itmvto: Array<Produto>
    
}
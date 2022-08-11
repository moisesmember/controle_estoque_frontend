import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SaidaComponent } from "./saida.component";


const ROUTES: Routes = [
    { path: '', component: SaidaComponent },
]

@NgModule({
    declarations: [SaidaComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class SaidaModule{}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ConsultaComponent } from "./consulta.component";


const ROUTES: Routes = [
    { path: '', component: ConsultaComponent },
]

@NgModule({
    declarations: [ConsultaComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class ConsultaModule{}
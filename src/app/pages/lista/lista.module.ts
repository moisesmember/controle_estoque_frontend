import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ListaComponent } from "./lista.component";


const ROUTES: Routes = [
    { path: '', component: ListaComponent },
]


@NgModule({
    declarations: [ListaComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class ListaModule{}
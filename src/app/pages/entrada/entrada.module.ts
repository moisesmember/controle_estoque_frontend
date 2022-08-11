import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { EntradaComponent } from "./entrada.component";
;

const ROUTES: Routes = [
    { path: '', component: EntradaComponent },
]

@NgModule({
    declarations: [EntradaComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class EntradaModule{}
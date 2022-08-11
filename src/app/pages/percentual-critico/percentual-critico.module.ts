import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { PercentualCriticoComponent } from "./percentual-critico.component";



const ROUTES: Routes = [
    { path: '', component: PercentualCriticoComponent },
]

@NgModule({
    declarations: [PercentualCriticoComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class PercentualCriticoModule{}
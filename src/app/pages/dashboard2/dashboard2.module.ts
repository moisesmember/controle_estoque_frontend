import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { Dashboard2Component } from "./dashboard2.component";

const ROUTES: Routes = [
    { path: '', component: Dashboard2Component },
]


@NgModule({
    declarations: [Dashboard2Component],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class Dashboard2Module{}
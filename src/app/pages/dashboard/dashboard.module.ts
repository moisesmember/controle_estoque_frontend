import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardComponent } from "./dashboard.component";

const ROUTES: Routes = [
    { path: '', component: DashboardComponent },
]


@NgModule({
    declarations: [DashboardComponent],
    imports: [SharedModule, RouterModule.forChild(ROUTES)]
})
export class DashboardModule{}
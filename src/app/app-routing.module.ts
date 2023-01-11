import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game/game.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/game', pathMatch: 'full'},
    { path: 'game', component: GameComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Board2Component } from "./board2/board2.component";
import { GameComponent } from "./game/game.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/board2', pathMatch: 'full'},
    { path: 'game', component: GameComponent},
    { path: 'board2', component: Board2Component },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
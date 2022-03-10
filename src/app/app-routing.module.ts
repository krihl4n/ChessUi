import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardCanvasComponent } from "./board-canvas/board-canvas.component";
import { GameComponent } from "./game/game.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/board', pathMatch: 'full'},
    { path: 'game', component: GameComponent},
    { path: 'board', component: BoardCanvasComponent }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
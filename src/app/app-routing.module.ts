import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Board2Component } from "./board2/board2.component";
import { BoardCanvasComponent } from "./board-canvas/board-canvas.component";
import { GameComponent } from "./game/game.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/board2', pathMatch: 'full'},
    { path: 'game', component: GameComponent},
    { path: 'board', component: BoardCanvasComponent },
    { path: 'board2', component: Board2Component },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
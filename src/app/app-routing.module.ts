import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardCanvasComponent } from "./board-canvas/board-canvas.component";
import { GameComponent } from "./game/game.component";
import { SvgTestComponent } from "./svg-test/svg-test.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/svg-test', pathMatch: 'full'},
    { path: 'game', component: GameComponent},
    { path: 'board', component: BoardCanvasComponent },
    { path: 'svg-test', component: SvgTestComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
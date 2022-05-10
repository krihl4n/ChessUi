import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardCanvasWithCssAnimationsComponent } from "./board-canvas-with-css-animations/board-canvas-with-css-animations.component";
import { BoardCanvasComponent } from "./board-canvas/board-canvas.component";
import { GameComponent } from "./game/game.component";
import { SvgTestComponent } from "./svg-test/svg-test.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/svg-test', pathMatch: 'full'},
    { path: 'game', component: GameComponent},
    { path: 'board', component: BoardCanvasComponent },
    { path: 'svg-test', component: SvgTestComponent},
    { path: 'board2', component: BoardCanvasWithCssAnimationsComponent },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
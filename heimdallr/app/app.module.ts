import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found';
import { DummyService } from './dummy.service';

const ROUTES: Routes = [
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [
        BrowserModule, 
        RouterModule.forRoot(ROUTES, {useHash: true, enableTracing: true}),
    ],
    declarations: [AppComponent, NotFoundComponent],
    providers: [DummyService],
    bootstrap: [AppComponent],
})
export class AppModule {}
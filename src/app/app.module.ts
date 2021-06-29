import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CocktailAddComponent } from './cocktailAdd/cocktailAdd.component';
import { CocktailQueueComponent } from './cocktailQueue/cocktailQueue.component';

@NgModule({
  declarations: [
    AppComponent,
    CocktailQueueComponent,
    CocktailAddComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

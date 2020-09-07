import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPrototypeComponent } from './prototype/main-prototype/main-prototype.component';
import { HttpClientModule } from '@angular/common/http';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './main/shared/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    MainPrototypeComponent,
    MainLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:44329'],
        disallowedRoutes: [],
      },
    }),
  ],
  exports: [
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

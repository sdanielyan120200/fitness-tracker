import { NgModule } from "@angular/core";
import { AuthRouingModule } from "./auth-routing.module";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { Sharedmodule } from "../shared/shared.module";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
    ],
    imports: [
        AngularFireAuthModule,
        ReactiveFormsModule,
        Sharedmodule,
        AuthRouingModule
    ]
})
export class AuthModule { }
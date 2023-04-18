import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Store } from "@ngrx/store";

import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import * as fromRoot from "../app.reducer";
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router,
        private auth: AngularFireAuth,
        private trainingServcie: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) { }

    initAuthListener() {
        this.auth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.trainingServcie.cancelSubs();
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading());
        })
            .catch(error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar(error.message, undefined, 5000);
            });
    }

    login(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading());
        })
            .catch(error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar(error.message, undefined, 5000);
            });
    }

    logout() {
        this.auth.signOut();
    }
}
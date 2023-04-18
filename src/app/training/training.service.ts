import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store'

import { Exercise } from "./exercise.model";
import { UIService } from "../shared/ui.service";
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable({ providedIn: 'root' })
export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) { }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...(doc.payload.doc.data() as Object)
                    };
                });
            }))
            .subscribe(
                (exercises: Exercise[]) => {
                    this.store.dispatch(new UI.StopLoading());
                    this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                }, error => {
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar('Fetching Exercises failed, please try again later.', undefined, 5000);
                }));
    };

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId))
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
            this.addDatatoDatabase({
                ...exercise,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
            this.addDatatoDatabase({
                ...exercise,
                duration: exercise.duration * (progress / 100),
                calories: exercise.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });;
    }

    fetchCompletedorCancelledExercises() {
        this.fbSubs.push(this.db.collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: any) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            }));
    }

    cancelSubs() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    private addDatatoDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise)
    }
}
import { NgModule } from "@angular/core";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { Sharedmodule } from "../shared/shared.module";
import { TrainingRoutingModule } from "./training-routing.module";
import { StoreModule } from "@ngrx/store";

import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { StopTrainingComponent } from "./current-training/stop-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingsComponent } from "./past-trainings/past-trainings.component";
import { TrainingComponent } from "./training.component";
import { trainingReducer } from "./training.reducer";

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingsComponent,
        StopTrainingComponent,
    ],
    imports: [
        Sharedmodule,
        AngularFirestoreModule,
        TrainingRoutingModule,
        StoreModule.forFeature('training', trainingReducer)
    ]
})
export class TrainingModule { }
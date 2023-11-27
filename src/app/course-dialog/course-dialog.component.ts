import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialog,  MatDialogConfig,  MatDialogRef} from '@angular/material/dialog';
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
    

    form = this.fb.group({
        description:[this.cacca.description]
    })
    constructor(private fb: FormBuilder, 
                @Inject(MAT_DIALOG_DATA) public cacca: Course, 
                private dialogRef:MatDialogRef<CourseDialogComponent>) {}
    
    ngOnInit(){}
    close(){
        this.dialogRef.close()
    }
    save(){
        this.dialogRef.close(this.form.value)
    }
    
}
export function openDialog(matDialog:MatDialog,course:Course){
    const config = new MatDialogConfig()
    config.disableClose=true
    config.autoFocus= true                            
    config.data = course
    config.panelClass = 'modal-panel'
    config.backdropClass = 'backdrop-modal-panel'
    const merda = matDialog.open(CourseDialogComponent,config)
    return merda.afterClosed()
}


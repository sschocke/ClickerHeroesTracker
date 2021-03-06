import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { LogInDialogComponent } from "../logInDialog/logInDialog";
import { RegisterDialogComponent } from "../registerDialog/registerDialog";
import { AuthenticationService, IUserInfo } from "../../services/authenticationService/authenticationService";
import { UploadService } from "../../services/uploadService/uploadService";
import { SettingsService, PlayStyle } from "../../services/settingsService/settingsService";

@Component({
    selector: "upload",
    templateUrl: "./uploadDialog.html",
})
export class UploadDialogComponent implements OnInit {
    public errorMessage: string;

    public isLoading: boolean;

    public userInfo: IUserInfo;

    public playStyles: PlayStyle[] = ["idle", "hybrid", "active"];

    public encodedSaveData = "";

    public playStyle: PlayStyle = "idle";

    public addToProgress = true;

    public LogInDialogComponent = LogInDialogComponent;

    public RegisterDialogComponent = RegisterDialogComponent;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly uploadService: UploadService,
        public activeModal: NgbActiveModal,
        private readonly router: Router,
        private readonly settingsService: SettingsService,
    ) { }

    public ngOnInit(): void {
        this.authenticationService
            .userInfo()
            .subscribe(userInfo => this.userInfo = userInfo);

        this.settingsService
            .settings()
            .subscribe(settings => this.playStyle = settings.playStyle);
    }

    public upload(): void {
        if (!this.encodedSaveData) {
            this.errorMessage = "Save data is required";
            return;
        }

        this.isLoading = true;
        this.uploadService.create(this.encodedSaveData, this.addToProgress, this.playStyle)
            .then(uploadId => {
                return this.router.navigate(["/uploads", uploadId]);
            })
            .then(() => {
                this.activeModal.close();
                this.isLoading = false;
            })
            .catch((error: HttpErrorResponse) => {
                this.errorMessage = error.status >= 400 && error.status < 500
                    ? "The uploaded save was not valid"
                    : "An unknown error occurred";
            });
    }

    public uploadFile(event: Event): void {
        let fileInput = event.target as HTMLInputElement;
        let fileList = fileInput.files;
        if (fileList.length > 0) {
            let reader = new FileReader();
            let file: File = fileList[0];
            reader.onload = () => this.encodedSaveData = reader.result as string;
            reader.readAsText(file);
        }
    }
}

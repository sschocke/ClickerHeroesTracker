import { Component } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { LogInDialogComponent } from "../logInDialog/logInDialog";
import { UserService } from "../../services/userService/userService";

@Component({
    selector: "resetPasswordDialog",
    templateUrl: "./resetPasswordDialog.html",
})
export class ResetPasswordDialogComponent {
    public errors: string[];

    public isLoading: boolean;

    public email = "";

    public code = "";

    public password = "";

    public confirmPassword = "";

    public codeSent = false;

    constructor(
        private readonly userService: UserService,
        private readonly modalService: NgbModal,
        public activeModal: NgbActiveModal,
    ) { }

    public sendCode(): void {
        this.errors = null;
        this.isLoading = true;
        this.userService.resetPassword(this.email)
            .then(() => {
                this.isLoading = false;
                this.codeSent = true;
            })
            .catch((errors: string[]) => {
                this.errors = errors;
            });
    }

    public resetPassword(): void {
        this.errors = null;
        this.isLoading = true;
        this.userService.resetPasswordConfirmation(this.email, this.password, this.code)
            .then(() => {
                this.isLoading = false;
                this.activeModal.close();
                this.modalService.open(LogInDialogComponent);
            })
            .catch((errors: string[]) => {
                this.errors = errors;
            });
    }
}

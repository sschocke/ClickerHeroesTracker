import { Component, OnInit, Input } from "@angular/core";
import { UserService, IUploadSummaryListResponse } from "../../services/userService/userService";
import { Decimal } from "decimal.js";

interface IUploadViewModel {
    id: number;
    saveTime: Date;
    uploadTime: Date;
    ascensionNumber: number;
    zone: number;
    souls: Decimal;
}

@Component({
    selector: "uploadsTable",
    templateUrl: "./uploadsTable.html",
})
export class UploadsTableComponent implements OnInit {
    public uploads: IUploadViewModel[];
    public isError: boolean;
    public isLoading: boolean;
    public totalUploads: number;

    @Input()
    public count: number;

    @Input()
    public paginate: boolean;

    private _userName: string;
    private _page = 1;
    private _isInitialized = false;

    public get page(): number {
        return this._page;
    }

    public set page(page: number) {
        this._page = page;
        if (this._isInitialized) {
            this.populateUploads();
        }
    }

    public get userName(): string {
        return this._userName;
    }

    @Input()
    public set userName(userName: string) {
        this._userName = userName;
        if (this._isInitialized) {
            this.populateUploads();
        }
    }

    constructor(private readonly userService: UserService) { }

    public ngOnInit(): void {
        this.populateUploads();
        this._isInitialized = true;
    }

    private populateUploads(): void {
        this.isError = false;
        this.isLoading = true;
        this.userService
            .getUploads(this.userName, this.page, this.count)
            .then(response => this.handleData(response))
            .catch(() => this.isError = true);
    }

    private handleData(response: IUploadSummaryListResponse): void {
        if (!response || !response.uploads) {
            this.isError = true;
            return;
        }

        this.isLoading = false;
        this.uploads = [];

        let uploads = response.uploads;
        for (let upload of uploads) {
            this.uploads.push({
                id: upload.id,
                saveTime: new Date(upload.saveTime),
                uploadTime: new Date(upload.timeSubmitted),
                ascensionNumber: upload.ascensionNumber,
                zone: upload.zone,
                souls: new Decimal(upload.souls),
            });
        }

        if (response.pagination) {
            this.totalUploads = response.pagination.count;
        }
    }
}

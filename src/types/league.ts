import { IDocument } from "./document";

export interface ILeague extends IDocument{
    active: boolean;
    name: string;
    directorId: string;
    endDate: string;
    startDate: string;
    playerLimit: number;
}
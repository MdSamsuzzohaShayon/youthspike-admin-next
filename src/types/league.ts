import { IError } from ".";
import { IDocument } from "./document";

export interface ILeague extends IDocument {
  name: string;
  divisions: string;
  nets: number;
  rounds: number;
  netVariance: number;
  homeTeam: string;
  autoAssign: boolean;
  autoAssignLogic: string;
  timeout: number;
  passcode: string;
  coachPassword: string;
  location: string;
  rosterLock: string;
  startDate: string;
  endDate: string;
  playerLimit: number;
  active: boolean;
  sponsors: string[];
}

export interface ILeagueAdd {
  name: string;
  divisions: string;
  nets: number;
  rounds: number;
  netVariance: number;
  homeTeam: string;
  autoAssign: boolean;
  autoAssignLogic: string;
  timeout: number;
  passcode: string;
  coachPassword: string;
  location: string;
  rosterLock: string;
  startDate: string;
  endDate: string;
  playerLimit: number;
  active: boolean;
  directorId?: string;
  // sponsors: File[];
}

export interface ILeagueAddProps {
  update: boolean;
  setActErr: (state: IError) => void;
  setIsLoading: (state: boolean) => void;
  prevLeague?: ILeague;
}

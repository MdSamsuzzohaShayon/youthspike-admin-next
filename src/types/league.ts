import { IDocument } from "./document";

export interface ILeague extends IDocument {
  active: boolean;
  name: string;
  directorId: string;
  endDate: string;
  startDate: string;
  playerLimit: number;
}

export interface ILeagueAddProps {
  update: boolean;
}

interface ISponsor {
  _id?: string;
  name: string;
  logo: string;
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
  // sponsors: File[];
}

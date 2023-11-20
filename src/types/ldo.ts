import { IDirector } from ".";
import { IDirectorItem } from "./user";

export interface ILDO{
    name: string;
    logo: string;
    director?: IDirector;
  }

  export interface ILDOItem{
    _id: string;
    name: string;
    logo: string;
    director?: IDirectorItem;
  }
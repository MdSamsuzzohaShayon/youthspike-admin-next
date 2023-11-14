export interface IMenuItem {
  id: number;
  imgName: string;
  text: string;
  link: string;
}

export interface ITextInputProps {
  lw?: string;
  rw?: string;
  extraCls?: string;
  lblTxt?: string;
  name: string;
  required: boolean;
  defaultValue: string | number;
  handleInputChange: (e: React.SyntheticEvent) => void;
}

export interface INumberInputProps {
  lw?: number;
  rw?: number;
  extraCls?: string;
  lblTxt?: string;
  name: string;
  required: boolean;
  defaultValue: number;
  handleInputChange: (e: React.SyntheticEvent) => void;
}

export interface IOption {
  value: string;
  text?: string;
}

export interface ISelectInputProps {
  lw?: string;
  rw?: string;
  extraCls?: string;
  lblTxt?: string;
  name: string;
  optionList: IOption[];
  defaultValue?: string | number;
  handleSelect: (e: React.SyntheticEvent) => void;
}

export interface IButtonProps {
  handleClickEvent: (e: React.SyntheticEvent) => void;
  bg?: string;
  text?: string;
}

import React from 'react';
import { ITextInputProps } from '@/types';

const TextInput = (props: ITextInputProps) => {
    return (
        <div className={`input-group w-full flex justify-between items-center ${props.extraCls}`}>
            <label htmlFor={props.name} className={`capitalize ${props.lw}`}>{props.lblTxt ? props.lblTxt : props.name}</label>
            <input onChange={props.handleInputChange}
                id={props.name} name={props.name}
                className={`border border-gray-300 bg-transparent outline-none px-2 rounded-full h-10 text-center ${props.rw ? props.rw : "w-20"}`} type="text"
                defaultValue={props.defaultValue} required={props.required} />
        </div>
    )
}

export default TextInput;
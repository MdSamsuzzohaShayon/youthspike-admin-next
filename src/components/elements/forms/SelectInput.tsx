import React from 'react';
import { ISelectInputProps } from '@/types';

const SelectInput = (props: ISelectInputProps) => {
    const selectStyle: React.CSSProperties = {};

    if (!props.rw) selectStyle.width = '19%';
    return (
        <div className={`input-group w-full flex justify-between items-center ${props.extraCls}`}>
            <label htmlFor={props.name} className={`capitalize ${props.lw}`}>{props.lblTxt ? props.lblTxt : props.name}</label>
            <select onChange={props.handleSelect} name={props.name} id={props.name} defaultValue={props.defaultValue ? props.defaultValue : props.optionList[0].value} className={`form-control ${props.rw}`} style={selectStyle} >
                {props.optionList.map((o, i) => (
                    <option value={o.value} key={i} className='capitalize'>{o.text ? o.text : o.value}</option>
                ))}
            </select>
        </div>
    )
}

export default SelectInput;
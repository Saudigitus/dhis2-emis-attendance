import {
    ReactFinalForm,
    InputFieldFF,
    composeValidators,
    hasValue,
    string
} from '@dhis2/ui'
import React from 'react'
import style from "./fields.module.css";
import { FormFieldsProps } from '../../../types/form/GenericFieldsTypes';
import classNames from 'classnames';

const { Field } = ReactFinalForm

const VALIDATOR = composeValidators(string, hasValue)

function InputText(props: FormFieldsProps) {
    return (
        <Field
            {...props}
            component={InputFieldFF}
            validate={(Boolean(props.required)) && VALIDATOR}
            type="text"
            required
            label={null}
            className={classNames(style.textfield, props?.style && style.opacity)}
            disabled={props.disabled}
        />
    )
}

export default InputText

import React, { Fragment, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps } from 'react-native';
import Spacer from './Spacer';

interface IProps extends TextInputProps {
    label: string;
}

const CustomInput = ({ label, ...restProps }: IProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const setBlur = () => setIsFocused(false);
    const setFocus = () => setIsFocused(true);

    const combinedStyles = [
        styles.input,
        isFocused && styles.focusedInput,
        restProps.style
    ];

    return (
        <Fragment>
            <Text>{label}</Text>
            <Spacer height={10} />
            <TextInput
                onBlur={setBlur}
                onFocus={setFocus}
                style={combinedStyles}
                onSubmitEditing={setBlur}
                {...restProps}
            />
        </Fragment>
    )
}

export default CustomInput;

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: "#CECECE",
    },
    focusedInput: {
        borderColor: 'gray',
        borderWidth: 1.5,
    }
});
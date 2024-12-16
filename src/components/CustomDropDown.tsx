import React, { Fragment, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Spacer from './Spacer';

interface IProps<T> {
    label: string;
    placeholder: string;
    value: string | number;
    searchPlaceholder: string;
    setValue: (item: T) => void;
    data: Array<T & { id: number; name: string; }>;
}

const CustomDropDown = <T,>(props: IProps<T>) => {
    const [isFocused, setIsFocused] = useState(false);

    const setBlur = () => setIsFocused(false);

    const setFocused = () => setIsFocused(true);

    const handleOnChange = (item: T) => {
        props.setValue(item);
        setIsFocused(false);
    }

    return (
        <Fragment>
            <Text>{props.label}</Text>
            <Spacer height={10} />
            <Dropdown
                search
                maxHeight={300}
                data={props.data}
                valueField="id"
                labelField="name"
                searchField='name'
                onBlur={setBlur}
                onFocus={setFocused}
                onChange={handleOnChange}
                value={props.value as string}
                inputSearchStyle={styles.inputSearchStyle}
                placeholderStyle={styles.placeholderStyle}
                searchPlaceholder={props.searchPlaceholder}
                selectedTextStyle={styles.selectedTextStyle}
                placeholder={!isFocused ? props.placeholder : '...'}
                style={[styles.dropdown, isFocused && styles.focusedInput]}
            />
        </Fragment>
    )
}

export default CustomDropDown;

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#CECECE',
        paddingHorizontal: 8,
    },
    focusedInput: {
        borderWidth: 1.5,
        borderColor: 'gray',
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
})
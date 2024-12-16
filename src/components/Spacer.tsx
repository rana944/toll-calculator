import React from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
    height: number;
    width?: number;
}

export default function Spacer(props: IProps) {
    const $height = { height: props.height };
    const $width = { width: props.width || props.width || 0 };
    return (
        <View style={[$height, $width]} />
    )
}
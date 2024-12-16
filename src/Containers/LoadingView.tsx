import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IProps {
    isLoading: boolean;
    style?: ViewStyle;
    children: React.ReactNode;
}

const LoadingView = (props: IProps) => {
    return (
        <SafeAreaView style={props.style}>
            {props.isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator  color={'#000'} size={'large'} />
                </View>
            )}
            {props.children}
        </SafeAreaView>
    )
}

export default LoadingView;

const styles = StyleSheet.create({
    overlay: {
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }
})
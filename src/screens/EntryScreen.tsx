import React, { useState } from 'react';
import Spacer from '../components/Spacer';
import CustomInput from '../components/CustomInput';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import CustomDropDown from '../components/CustomDropDown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, interchanges, numberPlateFormatter } from '../utils/Helper';
import { createTrip } from '../services/TollService';
import LoadingView from '../Containers/LoadingView';
import { useNavigation } from '@react-navigation/native';

type TDropDownItem = typeof interchanges[0];

const EntryScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [numberPlate, setNumberPlate] = useState('');
    const [entryPoint, setEntryPoint] = useState<number>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);

    const hideDatePicker = () => setDatePickerVisibility(false);

    const onDropDownSelect = (item: TDropDownItem) => setEntryPoint(item.id);

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        setSelectedDate(date);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const tripDetails = await createTrip({
                'tripStatus': 'Active',
                'numberPlate': numberPlate,
                'entryInterchange': interchanges.find(res => res.id === entryPoint!)?.name!,
                'entryDateTime': formatDate(selectedDate),
            });
            console.log("Trip Details", tripDetails);

            // Example Trip Details
            // {"_id": "675fdc536297b503e8bd8817", "entryDateTime": "Dec 16, 2024 at 12:52 PM", "entryInterchange": 1, "numberPlate": "AVB-244", "tripStatus": "Active"

            navigation.navigate('Exit Screen', { tripDetails, startTime: selectedDate });
        } catch (e: any) {
            Alert.alert(e || '');
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoadingView isLoading={loading} style={styles.container}>
            <View>
                <Text style={styles.title}>Begin your journey !!</Text>
                <Spacer height={40} />
                <CustomDropDown<TDropDownItem>
                    data={interchanges}
                    label='Entry Point'
                    value={entryPoint}
                    setValue={onDropDownSelect}
                    searchPlaceholder="Search..."
                    placeholder={'Select entry point'}
                />
                <Spacer height={20} />
                <CustomInput
                    maxLength={7}
                    label='Number Plate'
                    placeholder="LLL-NNN"
                    autoCapitalize="characters"
                    onChangeText={setNumberPlate}
                    value={numberPlateFormatter(numberPlate)}
                />
                <Spacer height={20} />
                <CustomInput
                    editable={false}
                    focusable={false}
                    label='Entry Time'
                    onPress={showDatePicker}
                    value={formatDate(selectedDate)}
                    placeholder='Please type here ...'
                />
                <DateTimePickerModal
                    mode='datetime'
                    date={selectedDate}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    isVisible={isDatePickerVisible}
                />
            </View>

            <Button title='Submit' disabled={!numberPlate.length || !entryPoint} onPress={handleSubmit} />
        </LoadingView>
    )
}

export default EntryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: "#CECECE",
    },
});
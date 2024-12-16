import React, { useState } from 'react';
import Spacer from '../components/Spacer';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { baseRate, distanceBetweenTwoInterchanges, distanceRate, formatDate, interchanges, nationalHolidays, numberPlateFormatter, weekendMultiplier } from '../utils/Helper';
import CustomInput from '../components/CustomInput';
import CustomDropDown from '../components/CustomDropDown';
import LoadingView from '../Containers/LoadingView';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { deleteTrip, updateTripDetails } from '../services/TollService';

type TDropDownItem = typeof interchanges[0];

const ExitScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const [numberPlate, setNumberPlate] = useState(route?.params?.tripDetails?.numberPlate);
    const [exitPoint, setExitPoint] = useState<number>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [tripDetails, setTripDetails] = useState<Record<string, string | number>>({ ...route.params?.tripDetails as any })

    const showDatePicker = () => setDatePickerVisibility(true);

    const hideDatePicker = () => setDatePickerVisibility(false);

    const onDropDownSelect = (item: TDropDownItem) => {
        if (item.name !== tripDetails?.entryInterchange) {
            setExitPoint(item.id)
        } else {
            Alert.alert('Please select different interchange')
        }
    };

    const handleConfirm = (date: Date) => {
        hideDatePicker();
        setSelectedDate(date);
    };

    const handleSubmit = async () => {
        /**
         * 1. Calculate the toll
         * 2. Send PUT request to update the trip details
         * 3. Fetch the Trip Details
         * 4. Delete the trip and navigate to top, if user clicks on Start again
         */

        const distanceTraveled = distanceBetweenTwoInterchanges(tripDetails?.entryInterchange as string, interchanges.find(res => res.id === exitPoint)?.name as string);

        // Entry time of the vehicle
        const entryTime = (route.params as any)?.startTime as Date;

        // Determine the day of the week
        const dayOfWeek = entryTime.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Distance charges
        let distanceCharges = distanceTraveled * distanceRate;

        // Weekend multipiler 1.5X
        if (isWeekend) {
            distanceCharges *= weekendMultiplier;
        }

        // Base toll
        let totalToll = baseRate + distanceCharges;

        // Check for special discounts
        const isNationalHoliday = nationalHolidays.includes(
            entryTime.toISOString().slice(5, 10) // Extract MM-DD
        );

        let isEvenNumberPlateDiscountValid = false;
        let isOddNumberPlateDiscountValid = false;

        // National Day 50 % discount
        if (isNationalHoliday) {
            totalToll *= 0.5; // 50% discount
        } else if (!isWeekend) {
            // Extracting number part from number plate 
            const numberPart = parseInt(numberPlate.split("-")[1], 10);

            // checking if number part is even
            const isEven = numberPart % 2 === 0;

            // Monday or Wednesday, even plate
            isEvenNumberPlateDiscountValid = (dayOfWeek === 1 || dayOfWeek === 3) && isEven;

            // Tuesday or Thursday, odd plate
            isOddNumberPlateDiscountValid = (dayOfWeek === 2 || dayOfWeek === 4) && !isEven;

            // Calculation of discounts based on given critera
            if (isEvenNumberPlateDiscountValid) {
                totalToll *= 0.9; // 10% discount
            } else if (isOddNumberPlateDiscountValid) {
                totalToll *= 0.9; // 10% discount
            }
        }

        const totalCost = Math.round(totalToll * 100) / 100; // Round to 2 decimal places

        const updatedTripDetails = {
            ...tripDetails,
            tripStatus: 'Completed',
            exitInterchange: interchanges.find(res => res.id === exitPoint)?.name as string,
            exitDateTime: formatDate(selectedDate),

            // Toll calculation, will be later displayed after completing the trip
            baseRate: baseRate,
            distanceCost: distanceTraveled * distanceRate,
            discount: [isNationalHoliday ? '50 % national day off' : '', isEvenNumberPlateDiscountValid || isOddNumberPlateDiscountValid ? '10% number plate discount' : ''],
            other: isWeekend ? '1.5x' : '',

            // Total trip cost
            totalCostTrip: totalCost,
        }

        try {
            setLoading(true);
            await updateTripDetails(
                tripDetails?._id as string,
                updatedTripDetails
            )

            setTripDetails({ ...updatedTripDetails })
        } catch (e: any) {
            Alert.alert(e || '');
        } finally {
            setLoading(false);
        }
    }

    const onRecalculate = () => {
        deleteTrip(tripDetails?._id);
        navigation.dispatch(StackActions.popToTop());
    }

    if (tripDetails.tripStatus === 'Completed') {
        return (
            <LoadingView isLoading={false} style={styles.container}>
                <View>
                    <Text style={styles.title}>Break Down of Cost</Text>
                    <Spacer height={20} />
                    <Text style={styles.label}>Base Rate: {tripDetails?.baseRate}</Text>
                    <Spacer height={10} />
                    <Text style={styles.label}>Distance Cost: {tripDetails?.distanceCost?.toFixed(0)} Rs.</Text>
                    <Spacer height={10} />
                    <Text style={styles.label}>Sub-Total: {(Number(tripDetails?.baseRate) + Number(tripDetails?.distanceCost)).toFixed(0)} Rs.</Text>
                    <Spacer height={10} />
                    <Text style={styles.label}>Discount/Other: {(tripDetails?.discount || []).filter(res => res !== '').join(', ')} {tripDetails?.other ? ` / ${tripDetails?.other}` : '' }</Text>
                    <Spacer height={10} />
                    <Text style={styles.label}>TOTAL TO BE CHARGED: {tripDetails?.totalCostTrip?.toFixed(0)} Rs.</Text>
                </View>
                <Button title='Re-Calculate' onPress={onRecalculate} />
            </LoadingView>
        )
    }

    return (
        <ScrollView>
            <LoadingView isLoading={loading} style={styles.container}>
                <Text style={styles.title}>Complete your journey !!</Text>
                <Spacer height={40} />
                <View>
                    <CustomDropDown<TDropDownItem>
                        data={interchanges}
                        label='Exit Point'
                        value={exitPoint}
                        setValue={onDropDownSelect}
                        searchPlaceholder="Search..."
                        placeholder={'Select exit point'}
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
                        label='Exit Time'
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

                <Button title='Calculate' disabled={!numberPlate.length || !exitPoint} onPress={handleSubmit} />
            </LoadingView>
        </ScrollView>
    )
}

export default ExitScreen;

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
    label: {
        fontSize: 16,
    },
});
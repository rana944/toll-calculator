import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntryScreen from '../screens/EntryScreen';
import ExitScreen from '../screens/ExitScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator screenOptions={{ header: undefined, headerShown: false }}>
        <Stack.Screen name='Entry Screen' component={EntryScreen} />
        <Stack.Screen name='Exit Screen' component={ExitScreen} />
    </Stack.Navigator>
)

export default AppNavigator;
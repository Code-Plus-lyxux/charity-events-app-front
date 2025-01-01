import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import icons from './constants/icons';
// Import screens
import Welcome from './screens/welcome/welcome';
import Onboarding from './screens/welcome/onboarding';
import Login from './screens/auth/Login';
import ResetPassword from './screens/auth/Reset_password';
import SignUp from './screens/auth/Sign_up';
import ForgotPassword from './screens/auth/Forgot_password';
import Home from './screens/tabs/home';
import MyEvents from './screens/tabs/MyEvents';
import ProfilePage from './screens/profile/Profile_page'
import UserProfile from './screens/tabs/UserProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
        return (
                <Tab.Navigator
                        screenOptions={({ route }) => ({
                                headerShown: false,
                                tabBarIcon: ({ focused }) => {
                                        let iconSource;
                                        if (route.name === 'Home') iconSource = icons.Home;
                                        if (route.name === 'MyEvents') iconSource = icons.Calendar;
                                        if (route.name === 'UserProfile') iconSource = icons.Profile;

                                        return (
                                                <Image
                                                        source={iconSource}
                                                        style={{
                                                                height: 24,
                                                                width: 24,
                                                                tintColor: focused ? '#00B894' : 'gray',
                                                        }}
                                                />
                                        );
                                },
                                tabBarActiveTintColor: '#00B894',
                                tabBarInactiveTintColor: 'gray',
                                tabBarShowLabel: false,
                        })}
                >
                        <Tab.Screen name="Home" component={Home} />
                        <Tab.Screen name="MyEvents" component={MyEvents} />
                        <Tab.Screen name="UserProfile" component={UserProfile} />
                </Tab.Navigator>
        );
};

const App = () => {

        const isTesting = false; // Set this to true for testing purposes
        const testScreen = 'Tabs'; // Set this to the screen you want to test

        return (
                <NavigationContainer>
                        <Stack.Navigator
                                initialRouteName={isTesting ? testScreen : "Welcome"}
                                screenOptions={{ headerShown: false }}
                        >
                                <Stack.Screen
                                        name="Welcome"
                                        component={Welcome}
                                        options={{
                                                headerShown: false,
                                        }} />
                                <Stack.Screen
                                        name="Onboarding"
                                        component={Onboarding}
                                        options={{
                                                headerShown: false,
                                        }} />
                                <Stack.Screen
                                        name="Login"
                                        component={Login} options={{
                                                headerShown: false,
                                        }} />
                                <Stack.Screen
                                        name="ResetPassword"
                                        component={ResetPassword}
                                />
                                <Stack.Screen
                                        name="ForgotPassword"
                                        component={ForgotPassword}
                                />
                                <Stack.Screen
                                        name="SignUp"
                                        component={SignUp}
                                />
                                <Stack.Screen
                                        name="MyEvents"
                                        component={MyEvents}
                                />
                                <Stack.Screen
                                        name="ProfilePage"
                                        component={ProfilePage}
                                />
                                <Stack.Screen
                                        name="UserProfile"
                                        component={UserProfile}
                                />
                                <Stack.Screen
                                        name="Tabs"
                                        component={TabNavigator}
                                />
                        </Stack.Navigator>
                </NavigationContainer>
        );
};



export default App;

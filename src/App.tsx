import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import Welcome from './screens/welcome/welcome';
import Onboarding from './screens/welcome/onboarding';
import Login from './screens/auth/Login';
import ResetPassword from './screens/auth/Reset_password';
import SignUp from './screens/auth/Sign_up';
import ForgotPassword from './screens/auth/Forgot_password';
import Home from './screens/(tabs)/home';
import MyEvents from './screens/(tabs)/MyEvents';
import ProfilePage from './screens/profile/Profile_page'
import AddEvent from './screens/add_event/Add_event'


const Stack = createNativeStackNavigator();

const App = () => {

  const isTesting = false; // Set this to true for testing purposes
  const testScreen = 'AddEvent'

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
          }}/>
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
                name="Home" 
                component={Home}
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
                name="AddEvent" 
                component={AddEvent} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
  
export default App;

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
import ProfilePage from './screens/profile/Profile_page'


const Stack = createNativeStackNavigator();

const App = () => {

  const isTesting = true; // Set this to true for testing purposes
  const testScreen = 'ForgotPassword'

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
                name="ProfilePage" 
                component={ProfilePage} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};
  
export default App;

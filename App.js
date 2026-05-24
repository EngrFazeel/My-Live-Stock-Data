import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import store from './Src/Redux/store';
import SweetAlertProvider from './Src/Utils/SweetAlert';
import { restoreAuth } from './Src/Redux/Slices/authSlice';

import Welcome      from './Src/Screen/Welcome';
import Onboard1     from './Src/Onboarding/Onboard1';
import Onboard2     from './Src/Onboarding/Onboard2';
import Onboard3     from './Src/Onboarding/Onboard3';
import Choice       from './Src/Screen/Choice';
import Login        from './Src/Screen/Login';
import Signup       from './Src/Screen/Signup';
import Category     from './Src/Screen/Category';
import Guest        from './Src/Screen/Guest/Guest';
import Category2    from './Src/Screen/Category2';
import Scan         from './Src/Screen/Guest/Scan';
import Setting      from './Src/Screen/Guest/Setting';
import Result       from './Src/Screen/Result';
import Home         from './Src/Screen/Home';
import Profile      from './Src/Screen/Profile';
import Chat         from './Src/Screen/Chat';
import Addanimal    from './Src/Screen/Addanimal';
import Scansave     from './Src/Screen/Scansave';

import Sale           from './Src/Screen/Drawar/Sale';
import MyTransfers    from './Src/Screen/Drawar/MyTransfers';
import AppInfo        from './Src/Screen/Drawar/AppInfo';
import Contactus      from './Src/Screen/Drawar/Contactus';
import Editprofile    from './Src/Screen/Drawar/Editprofile';
import PrivacyPolicy  from './Src/Screen/Drawar/PrivacyPolicy';
import TermsCondition from './Src/Screen/Drawar/TermsCondition';
import Setting3       from './Src/Screen/Drawar/Setting3';
import SaleAnimal     from './Src/Screen/Drawar/Sale';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Guest tab navigator ──────────────────────────────────────────────────────
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={tabOpts}>
      <Tab.Screen name="HomeTab" component={Guest}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Scan" component={Scan}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="line-scan" size={size} color={color} /> }} />
      <Tab.Screen name="Setting" component={Setting}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="face-man-profile" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

// ─── Authenticated tab navigator ──────────────────────────────────────────────
function Main() {
  return (
    <Tab.Navigator screenOptions={tabOpts}>
      <Tab.Screen name="HomeTab" component={Home}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Sale" component={SaleAnimal}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="sell" size={size} color={color} /> }} />
      <Tab.Screen name="Scan" component={Scan}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="line-scan" size={size} color={color} /> }} />
      <Tab.Screen name="Profile" component={Profile}
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome5 name="user-circle" size={size} color={color} /> }} />
      <Tab.Screen name="Chat" component={Chat}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="support-agent" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

// ─── AppContent — lives inside Provider so hooks work ─────────────────────────
function AppContent() {
  const dispatch = useDispatch();
  const { restored } = useSelector((s) => s.auth);

  // Restore tokens from AsyncStorage once on every app launch
  useEffect(() => {
    dispatch(restoreAuth());
  }, []);

  // Show a spinner until restoration is done so navigation renders with correct state
  if (!restored) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3dac40" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome"       component={Welcome} />
        <Stack.Screen name="Home"          component={Main} />
        <Stack.Screen name="Onboard1"      component={Onboard1} />
        <Stack.Screen name="Onboard2"      component={Onboard2} />
        <Stack.Screen name="Onboard3"      component={Onboard3} />
        <Stack.Screen name="Choice"        component={Choice} />
        <Stack.Screen name="Category"      component={Category} />
        <Stack.Screen name="Category2"     component={Category2} />
        <Stack.Screen name="Login"         component={Login} />
        <Stack.Screen name="Signup"        component={Signup} />
        <Stack.Screen name="Result"        component={Result} />
        <Stack.Screen name="Guest"         component={MyTabs} />
        <Stack.Screen name="Addanimal"     component={Addanimal} />
        <Stack.Screen name="Scansave"      component={Scansave} />

        {/* Drawer screens */}
        <Stack.Screen name="Sale"          component={Sale} />
        <Stack.Screen name="MyTransfers"   component={MyTransfers} />
        <Stack.Screen name="AppInfo"       component={AppInfo} />
        <Stack.Screen name="Contactus"     component={Contactus} />
        <Stack.Screen name="Editprofile"   component={Editprofile} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsCondition" component={TermsCondition} />
        <Stack.Screen name="Setting3"      component={Setting3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <SweetAlertProvider />
      <AppContent />
    </Provider>
  );
}

// ─── Shared tab style ─────────────────────────────────────────────────────────
const tabOpts = {
  headerShown:       false,
  tabBarStyle:       { backgroundColor: '#1e8527ff', height: 50, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
  tabBarLabelStyle:  { fontSize: 15, fontWeight: '600' },
  tabBarActiveTintColor: '#fff',
};

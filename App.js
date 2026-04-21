import React, { Component } from 'react'
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView,Image } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';



import Welcome from './Src/Screen/Welcome';
import Onboard1 from './Src/Onboarding/Onboard1';
import Onboard2 from './Src/Onboarding/Onboard2';
import Onboard3 from './Src/Onboarding/Onboard3';
import Choice from './Src/Screen/Choice';
import Login  from './Src/Screen/Login';
import Signup from './Src/Screen/Signup';
import Category from './Src/Screen/Category';
import Guest from './Src/Screen/Guest/Guest';
import Category2 from './Src/Screen/Category2';
import Scan from './Src/Screen/Guest/Scan';
import Setting from './Src/Screen/Guest/Setting';
import Result from './Src/Screen/Result';
import Adduser from './Src/Screen/Adduser';
import Home from './Src/Screen/Home';
import Profile from './Src/Screen/Profile';
import Settings from './Src/Screen/Settings';
import Chat from './Src/Screen/Chat';
import Addanimal from './Src/Screen/Addanimal';
import Scansave from './Src/Screen/Scansave';




import Sale from './Src/Screen/Drawar/Sale';
import AppInfo from './Src/Screen/Drawar/AppInfo';
import Contactus from './Src/Screen/Drawar/Contactus';
import Editprofile from './Src/Screen/Drawar/Editprofile';
import PrivacyPolicy from './Src/Screen/Drawar/PrivacyPolicy';
import TermsCondition from './Src/Screen/Drawar/TermsCondition';
import Setting3 from './Src/Screen/Drawar/Setting3';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Drawertab() {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}
      drawerContent={
        (props) => {
          return (
            <SafeAreaView>
              <ScrollView>
              <View
                style={{
                  height: 170,
                  width: '85%',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  // backgroundColor: 'cyan',
                  alignSelf: 'center'
                }}>
                <TouchableOpacity 
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor:'#3dac40',
                    borderRadius: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-start'
                  }}>
                  <MaterialIcons name="arrow-back-ios" color={'white'} size={30} />
                </TouchableOpacity>
                <View
                  style={{
                    width: '98%',
                    height: 55,
                    backgroundColor: '#3dac40',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    borderRadius: 10
                  }}>
                  <Image source={require('./Src/Assets/my.jpg')}
                    style={{
                      height: 40,
                      width: 40,
                    }}>
                  </Image>
                  <View
                    style={{
                      width: '75%',
                      height: 40,
                      // backgroundColor: 'pink',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '400',
                        color: 'white',
                      }}>
                      User Name
                    </Text>
                    
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '400',
                    color: 'black',
                    alignSelf: 'flex-start'
                  }}>
                  Main Menu
                </Text>
              </View>
              <DrawerItemList {...props} />
              </ScrollView>
            </SafeAreaView>
          )
        }
      }>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <EvilIcons name="user" color={'black'} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Show Log"
        component={Sale}
        options={{
          drawerLabel: 'Show Log',
          drawerIcon: ({ size }) => (
            <AntDesign name="eyeo" color={'black'} size={size} />
          ),
        }}
      />
     
     <Drawer.Screen
        name="Setting"
        component={Setting}
        options={{
          drawerLabel: 'Setting',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={'black'} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function MyTabs () {
  return(
    <Tab.Navigator
    screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:'#1e8527ff',height:50,borderTopRightRadius:20,borderTopLeftRadius:20,},
    tabBarLabelStyle:{fontSize:15, fontWeight:'600'},
    tabBarActiveTintColor: "#fff", }}>
        <Tab.Screen name="HomeTab"  component={Guest}
       options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />)}}/>
        <Tab.Screen name="Scan" component={Scan}
        options={{ tabBarIcon:({ color, size })=>(<MaterialCommunityIcons name="line-scan" size={size} color={color}/>)}}/>
        <Tab.Screen name="Setting" component={Setting}
        options={{ tabBarIcon:({ color, size })=>(<MaterialCommunityIcons name="face-man-profile" size={size} color={color}/>)}}/>
    </Tab.Navigator>
  )
}

// function Main () {
//   return(
//     <Tab.Navigator
//     screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:'#1e8527ff',height:50,borderTopRightRadius:20,borderTopLeftRadius:20,},
//     tabBarLabelStyle:{fontSize:15, fontWeight:'600'},
//     tabBarActiveTintColor: "#fff", }}>
//         <Tab.Screen name="Home"  component={Home}
//        options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />)}}/>
//         <Tab.Screen name="Settings" component={Settings}
//         options={{ tabBarIcon:({ color, size })=>(<Ionicons name="settings" size={size} color={color}/>)}}/>
//         <Tab.Screen name="Scan" component={Scan}
//         options={{ tabBarIcon:({ color, size })=>(<MaterialCommunityIcons name="line-scan" size={size} color={color}/>)}}/>
//           <Tab.Screen name="Profile" component={Profile}
//         options={{ tabBarIcon:({ color, size })=>(<FontAwesome5 name="user-circle" size={size} color={color}/>)}}/>
//           <Tab.Screen name="Chat" component={Chat}
//         options={{ tabBarIcon:({ color, size })=>(<Entypo name="chat" size={size} color={color}/>)}}/>
//     </Tab.Navigator>
//   )
// }

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
        {/* <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Onboard1" component={Onboard1} />
        <Stack.Screen name="Onboard2" component={Onboard2} />
        <Stack.Screen name="Onboard3" component={Onboard3} />
        <Stack.Screen name="Choice" component={Choice} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Category2" component={Category2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="Adduser" component={Adduser} />
        <Stack.Screen name="Guest" component={MyTabs} /> */}
        <Stack.Screen name="Home7" component={Drawertab} />
        <Stack.Screen name="Adduser" component={Adduser} /> 
        {/* <Stack.Screen name="Home" component={MyTabs} /> */}
        {/* <Stack.Screen name="Home" component={Main} /> */}
        <Stack.Screen name="Drawertab" component={Drawertab} />
        <Stack.Screen name="Addanimal" component={Addanimal} />
        <Stack.Screen name="Scansave" component={Scansave} />






        {/* Drawar */}
        <Stack.Screen name="Sale" component={Sale} />
        <Stack.Screen name="AppInfo" component={AppInfo} />
        <Stack.Screen name="Contactus" component={Contactus} />
        <Stack.Screen name="Editprofile" component={Editprofile} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsCondition" component={TermsCondition} />
        <Stack.Screen name="Setting3" component={Setting3} />



        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
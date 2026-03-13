// import React, { Component } from 'react';
// import { Text, View, StatusBar, Image, StyleSheet } from 'react-native';
// import { StackActions } from '@react-navigation/native';
// import { Color } from '../Colors/Color';
// import { color } from '../Color';

// export default class Splash extends Component {
//   state = {
//     isVisible: true,
//   };

//   componentDidMount() {
//     setTimeout(() => {
//       this.setState({ isVisible: false });
//       this.navigateToHome();
//     }, 4000);
//   }

//   navigateToHome = () => {
//     const { navigation } = this.props;
//     navigation.dispatch(StackActions.replace('Onboard1'));
//   };

//   render() {
//     const { isVisible } = this.state;

//     return (
//       <View 
//       style={{
//         height:1000,
//         width:'100%',
//         backgroundColor:color.Secondry,
//         justifyContent:'center',
//         alignItems:'center',
//       }}>
//         <StatusBar
//           backgroundColor= 'transparent'
//           barStyle="light-content"
//           translucent
//         />
//         {isVisible && (
//           <View>
//               <Image
//                 source={require('../Assets/Splash.png')}
//                 style={{
//                     height:600,
//                     width:280
//                 }}
//             ></Image>
//           </View>
//         )}
//       </View>
//     );
//   }
// }





import React, { Component } from 'react';
import { Text, View, StatusBar, Image, StyleSheet, Dimensions } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { color } from '../Color';

const { width, height } = Dimensions.get('window');

export default class Splash extends Component {
  state = {
    isVisible: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isVisible: false });
      this.navigateToHome();
    }, 4000);
  }

  navigateToHome = () => {
    const { navigation } = this.props;
    navigation.dispatch(StackActions.replace('Onboard1'));
  };

  render() {
    const { isVisible } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        ></StatusBar>

        {isVisible && (
          <Image
            source={require('../Assets/Splash.png')}
            style={styles.image}
            resizeMode="contain"
          ></Image>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.Secondry,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,  
    height: height * 0.7,

  },
});
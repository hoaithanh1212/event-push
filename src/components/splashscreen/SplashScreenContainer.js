import React, {Component} from 'react';
import {View, Image, AsyncStorage} from 'react-native';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {pushNav, resetNav} from "../../actions/navigate";
import {RouteKey} from "../../contants/route-key";
import {Images} from '../../theme/images';
import Configure from "../../contants/configure";

class SplashScreen extends Component {

  componentWillMount() {
    this.showSplashScreen = setInterval(() => {
      this.handleDirection();
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.showSplashScreen);
  }

  handleDirection = async() => {
    try {
      const accessToken = await AsyncStorage.getItem(Configure.ACCESS_TOKEN);
      if (accessToken !== null) {
        this.props.resetNav(RouteKey.DashBoard)
      } else {
        this.props.pushNav(RouteKey.MainDrawer)
      }
    } catch (error) {
      console.log(error);
      this.props.pushNav(RouteKey.MainDrawer)
    }
  };

  render() {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={Images.logoIcon}
        style={{width: 170, height: 170}}
        resizeMode="contain" />
    </View>
  }
}

export default connect(
  state => ({}), dispatch => bindActionCreators({pushNav, resetNav}, dispatch)
)(SplashScreen);
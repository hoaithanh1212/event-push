import React, {Component} from "react";
import {View, Text, TouchableOpacity, Image, StyleSheet} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Images} from "../../../theme/images";
import {FontNames} from '../../../theme/fonts';
import {AppColors} from '../../../theme/colors';

class UserProfileHeader extends Component {
  render() {
    let {title, leftIcon, leftAction, rightTitle, rightAction} = this.props
    return (
      <View style={styles.container}>
        <View style={{flexDirection: "row", height: 60}}>
          {leftIcon && <TouchableOpacity onPress={() => leftAction && leftAction()} style={styles.leftContainer}>
            <Image style={{width: 20, height: 20, marginLeft: 15}} source={leftIcon} resizeMode="contain" />
          </TouchableOpacity>}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title && title.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => rightAction && rightAction()} style={styles.rightContainer}>
            <Text style={{color: '#128ff9', fontSize: 16, fontFamily: FontNames.RobotoBold}}>{rightTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.breakLine} />
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(UserProfileHeader);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    backgroundColor:AppColors.backgroundColor
  },
  leftContainer: {
    flex: 2, justifyContent: 'center'
  },
  titleContainer: {
    flex: 6, alignItems: 'center', justifyContent: 'center'
  },
  title: {
    fontFamily: FontNames.ArialBoldMTArialBold, fontSize: 16, fontWeight: 'bold'
  },
  rightContainer: {
    flex: 2, alignItems: 'center', justifyContent: 'center'
  },
  breakLine: {
    height: 1, backgroundColor: 'rgba(180, 180, 180, 0.5)'
  }
});

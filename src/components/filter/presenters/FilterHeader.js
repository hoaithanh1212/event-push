import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Images } from "../../../theme/images";
import {FontNames} from '../../../theme/fonts';

class FilterHeader extends Component {
  render() {
    let {title, leftAction, rightAction} = this.props
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", height: 60 }}>
          <TouchableOpacity onPress={() => leftAction && leftAction()} style={styles.leftContainer}>
            <Image style={{width: 20, height: 20, marginLeft: 15}} source={Images.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title && title.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => rightAction && rightAction()} style={styles.rightContainer}>
            <Text style={{color: '#128ff9', fontSize: 16, fontFamily: FontNames.RobotoBold}}>APPLY</Text>
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
)(FilterHeader);

const styles = StyleSheet.create({
  container: {
    marginTop: 25
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

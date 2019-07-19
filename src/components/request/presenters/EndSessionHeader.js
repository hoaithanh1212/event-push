import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Images } from "../../../theme/images";
import {FontNames} from '../../../theme/fonts';
import {AppColors} from '../../../theme/colors';

class EndSessionHeader extends Component {
  render() {
    let {title, leftAction} = this.props
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", height: 60 }}>
          <TouchableOpacity onPress={() => leftAction && leftAction()} style={styles.leftContainer}>
            <Image style={{width: 25, height: 25}} source={Images.closeTinyIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title && title.toUpperCase()}</Text>
          </View>
          <View style={styles.rightContainer} />
        </View>
        <View style={styles.breakLine} />
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(EndSessionHeader);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    backgroundColor:AppColors.backgroundColor
  },
  leftContainer: {
    flex: 2, alignItems: 'center', justifyContent: 'center'
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

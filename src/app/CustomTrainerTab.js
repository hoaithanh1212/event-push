/**
 * Created by Hong HP on 3/8/19.
 */
import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {RoleType} from '../contants/profile-field';
import {RouteKey} from '../contants/route-key';
import {FontNames} from '../theme/fonts';

export class CustomTrainerTab extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {navigation} = this.props
    const selectedTabIndex = navigation.state.index
    return <View style={styles.container}>
      <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: selectedTabIndex === 0 ? '#e3f2ff' : '#fff'}]}
                        onPress={() => {
                          navigation.navigate(RouteKey.ListTrainer)
                        }}
      >
        <Text style={[styles.labelStyle, {color: selectedTabIndex === 0 ? '#128ff9' : '#9d9d9d'}]}>TRAINER</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: selectedTabIndex === 1 ? '#e3f2ff' : '#fff'}]}
                        onPress={() => {
                          navigation.navigate(RouteKey.SkillSet)
                        }}
      >
        <Text style={[styles.labelStyle , {color: selectedTabIndex === 1 ? '#128ff9' : '#9d9d9d'}]}>SKILLSET</Text>
      </TouchableOpacity>
    </View>
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 12
  },
  buttonContainer: {
    height: 30,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelStyle: {
    fontSize: 12,
    fontFamily: FontNames.RobotoBold
  }
})
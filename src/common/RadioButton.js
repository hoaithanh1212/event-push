/**
 * Created by Hong HP on 3/18/19.
 */

import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';

export default class RadioButton extends React.Component {
  constructor() {
    super()
  }
  render() {
    const {isChecked, onSelected, size = 16} = this.props
    return <TouchableOpacity onPress={() => {
      onSelected()
    }}
                             activeOpacity={1}
    >
      <Image style={{width: size, height: size, tintColor: isChecked ? '#128ff9' : '#808080'}}
        source={isChecked ? require('../assets/images/radio_checked.png') : require('../assets/images/radio_unchecked.png')}/>
    </TouchableOpacity>
  }
}
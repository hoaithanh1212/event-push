import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class Row extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const {style, children, ...viewProps} = this.props;
    return (
      <View {...viewProps} style={[styles.row, {flexDirection: 'row'}, style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',  }
});
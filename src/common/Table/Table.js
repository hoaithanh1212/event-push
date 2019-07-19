import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes, FlatList, ScrollView, SectionList
} from 'react-native';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        {this.props.children}
      </View >
    );
  }
}

export class TableWrapper extends Component {

  render() {
    const {children, style} = this.props;
    return <View style={style}>{children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
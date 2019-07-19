/**
 * Created by Hong HP on 3/7/19.
 */

import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, FlatList, Image} from 'react-native';
import {connect} from 'react-redux';
import SearchInput from '../../common/SearchInput';
import {Images} from '../../theme/images';
import {getTrainerAction} from '../../actions/user';
import {bindActionCreators} from 'redux';
import {pushNav} from '../../actions/navigate';
import {RouteKey} from '../../contants/route-key';
import {FontNames} from '../../theme/fonts';

var get = require('lodash.get');

class ListTrainerScreen extends React.Component {
  constructor() {
    super()
  }

  goToTrainerInfoScreen = (item) => {
    this.props.pushNav(RouteKey.TrainerDetailScreen, {
      trainerInfo: item
    })
  }

  renderItem = ({item, index}) => {
    return <TouchableOpacity
      key={index.toString()}
      style={styles.itemContainer}
      onPress={() => {
        this.goToTrainerInfoScreen(item)
      }}>
      <Text style={{fontSize: 16, fontFamily: FontNames.RobotoRegular, color: '#333333'}}>{get(item, 'name', '')}</Text>
    </TouchableOpacity>
  }

  render() {
    const {trainers} = this.props
    return <View style={styles.container}>
      <View style={{backgroundColor: '#fff', height: 44, flexDirection: 'row', marginVertical: 10, marginHorizontal: 12}}>
        <SearchInput/>
        <TouchableOpacity style={styles.buttonAdd}
                          onPress={() => {
                            this.props.pushNav(RouteKey.CreateTrainer)
                          }}
        >
          <Image source={Images.addIcon} style={{width: 25, height: 25}}/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trainers}
        extraData={this.state}
        renderItem={this.renderItem}
        keyExtractor={item => item.email}
        onEndReachedThreshold={0.01}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonAdd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  itemContainer: {
    borderRadius: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#d9d9d9',
    marginLeft: 12
  }
})

export default connect(state => ({
  trainers: state.user.trainers
}), dispatch => (bindActionCreators({
  pushNav
}, dispatch)))(ListTrainerScreen)
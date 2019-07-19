/**
 * Created by Hong HP on 3/7/19.
 */

import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {Images} from '../../theme/images';
import {RouteKey} from '../../contants/route-key';
import SearchInput from '../../common/SearchInput';
import {bindActionCreators} from 'redux';
import {getSkillSets} from '../../actions/skillSet';
import {FontNames} from '../../theme/fonts';
var get = require('lodash.get');
class SkillSetScreen extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.getSkillSets()
  }

  renderItem = ({item, index}) => {
    return <TouchableOpacity
      key={item.Id}
      style={styles.itemContainer}
      onPress={() => console.log('press children')}>
      <Text style={{fontSize: 16, fontFamily: FontNames.RobotoRegular, color: '#333333'}}>{get(item, 'name', '')}</Text>
    </TouchableOpacity>
  }

  render() {
    const {skillSets} = this.props
    return <View style={styles.container}>
      <View style={{backgroundColor: '#fff', height: 44, flexDirection: 'row', marginVertical: 10, marginHorizontal: 12}}>
        <SearchInput/>
        {/*<TouchableOpacity style={styles.buttonAdd}*/}
                          {/*onPress={() => {*/}
                            {/*this.props.pushNav(RouteKey.CreateTrainer)*/}
                          {/*}}*/}
        {/*>*/}
          {/*<Image source={Images.addIcon} style={{width: 25, height: 25}}/>*/}
        {/*</TouchableOpacity>*/}
      </View>
      <FlatList
        data={skillSets}
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
    flex: 1
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
  skillSets: state.skillSet.skillSets
}),
  dispatch => (bindActionCreators({
    getSkillSets,
  }, dispatch)))(SkillSetScreen)

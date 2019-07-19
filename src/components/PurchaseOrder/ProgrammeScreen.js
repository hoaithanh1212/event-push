/**
 * Created by Hong HP on 4/22/19.
 */


import React, {useEffect} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {getListPOProgramme} from '../../actions/poAction';
import {ProgrammeItem} from './component/ProgrammeItem';
import {RouteKey} from '../../contants/route-key';


function ProgrammeScreen(props) {
  const {listProgramme} = props

  useEffect(() => {
    props.getListPOProgramme()
  }, [])

  return <View style={styles.container}>
    <FlatList
      style={{paddingHorizontal: 20}}
      data={listProgramme}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => <ProgrammeItem data={item}
                                                    onPress={() => {
                                                      props.navigation.navigate(RouteKey.POProgrammeDetail, {
                                                        program: item
                                                      })
                                                    }}
      />}
    />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default connect(state => ({
  listProgramme: state.purchaseOrder.listProgramme
}), dispatch => ({
  getListPOProgramme: () => dispatch(getListPOProgramme())
}))(ProgrammeScreen)
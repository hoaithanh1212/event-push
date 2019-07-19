/**
 * Created by Hong HP on 4/23/19.
 */


import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {getListSPByProgramme} from '../../actions/poAction';
import {FontNames} from '../../theme/fonts';
import SearchInput from '../../common/SearchInput';
import {RouteKey} from '../../contants/route-key';


POProgrammeDetail.navigationOptions = ({navigation}) => {
  let program = navigation.getParam('program')
  return {
    headerTitle: !!program ? program.menuName : 'PROGRAMME'
  }
}

let program = ''

function POProgrammeDetail(props) {

  const [listUserSpSearch, setListUserSpSearch] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  useEffect(() => {
    program = props.navigation.getParam('program')
    props.getListSPByProgramme(program.type)
  }, [])

  function searchUserSP(text) {
    if (!text) {
      setIsSearch(false)
    } else {
      let listUserSpSearch = props.listSP.filter(item => !!item.name && item.name.toLowerCase().includes(text.toLowerCase()))
      setIsSearch(true)
      setListUserSpSearch(listUserSpSearch)
    }
  }

  return <View style={styles.container}>
    <View style={{height: 44, marginTop: 16}}>
      <SearchInput changeText={(text) => {
        searchUserSP(text)
      }}
                   placeholder={'Search SP'}
                   containerStyle={{backgroundColor: '#f2f2f2', marginHorizontal: 20}}
      />
    </View>
    <FlatList
      data={isSearch ? listUserSpSearch : props.listSP}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => <TouchableOpacity style={styles.itemWrapper}
                                                       onPress={() => {
                                                         props.navigation.navigate(RouteKey.PurchaseOrderDetails, {
                                                           programType: program.type,
                                                           userSpId: item.id,
                                                           userSP: item.name
                                                         })
                                                       }}
      >
        <Text style={[styles.textStyle, {flex: 1}]}>{item.name}</Text>
        <Text style={styles.textStyle}>{item.totalUnit}</Text>
      </TouchableOpacity>}
    />

  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9',
    paddingVertical: 10,
    marginHorizontal: 20
  },
  textStyle: {
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: '#333333'
  }
})

export default connect(state => ({
  listSP: state.purchaseOrder.listSP
}), dispatch => ({
  getListSPByProgramme: programType => dispatch(getListSPByProgramme(programType))
}))(POProgrammeDetail)
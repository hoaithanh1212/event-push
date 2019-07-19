/**
 * Created by Hong HP on 3/1/19.
 */


import React from 'react';
import {FlatList, TextInput, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Images} from '../theme/images';

export default class AutoCompleteComponent extends React.Component {

  constructor() {
    super()
  }

  render() {
    const {hideResults, data, onChangeText, value, placeholder, renderItem, style, editable} = this.props
    return <View style={[style, {width: '100%', maxHeight: 400}]}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', borderRadius: 5,
        paddingRight: 10,
        borderWidth: StyleSheet.hairlineWidth
      }}>
        <TextInput style={styles.textInput}
                   onChangeText={onChangeText}
                   placeholder={placeholder}
                   value={value}
                   editable={editable}
        />
        {editable && !!value && <TouchableOpacity
          style={{
            width: 15,
            height: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 7.5,
            backgroundColor: '#acacac'
          }}
          onPress={() => onChangeText('')}>
          <Image source={Images.closeWIcon} style={{width: 8, height: 8}}
                 resizeMode={'contain'}
          />
        </TouchableOpacity>}
      </View>
      {!hideResults && !!data &&
      <FlatList
        style={styles.listItem}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />}
    </View>
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 44,
    paddingHorizontal: 5,
    flex: 1
  },
  listItem: {
    backgroundColor: '#FFF',
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth
  }
})
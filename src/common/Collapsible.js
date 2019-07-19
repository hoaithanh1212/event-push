import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, FlatList } from "react-native";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { FontNames } from "../theme/fonts";
import { Images } from "../theme/images";
import { AppColors } from "../theme/colors";
import {RouteKey} from "../contants/route-key";
import {pushNav,replaceNav} from '../actions/navigate';
import {filterDataAction, filterDateRangeAction, clearRequestData} from "../actions/request";

var get = require("lodash.get");

class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: true
    };
  }

  onResetFilter = () => {
    let programs = this.props.lstFilterData.programs.map(program => {
      if (!program.selected) {
        program.selected = true;
      }
      return program;
    });

    let status = this.props.lstFilterData.status.map(stt => {
      if (!stt.selected) {
        stt.selected = true;
      }
      return stt;
    });

    let districts = this.props.lstFilterData.districts.map(district => {
      if (!district.selected) {
        district.selected = true;
      }
      return district;
    });

    let grcs = this.props.lstFilterData.grcs.map(grc => {
      if (!grc.selected) {
        grc.selected = true;
      }
      return grc;
    });
    
    let divisions = this.props.lstFilterData.divisions.map(division => {
      if (!division.selected) {
        division.selected = true;
      }
      return division;
    });

    let lstFilterData = {
      programs: programs,
      districts: districts,
      grcs: grcs,
      divisions: divisions,
      status: status,
      isActFilterProgram: false,
      isActFilterStatus: false,
      isActFilterDistrict: false,
      isActFilterDivision: false,
      isActFilterGRC: false
    };

    let lstFilterRangeData = {
      endDate: '',
      range: '',
      startDate: ''
    };
    this.props.filterDataAction(lstFilterData);
    this.props.filterDateRangeAction(lstFilterRangeData);
  };

  render() {
    let { title, items, onPress, leftIcon } = this.props;

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            items && items ?
              this.setState({isActive: !this.state.isActive})
              : onPress && onPress();
          }}
        >
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <Image
                style={styles.leftIcon}
                source={leftIcon}
                resizeMode="contain"
              />
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.rightContainer}>
              {items && items.length > 0 ? (
                <Image
                  style={{ width: 20, height: 20 }}
                  source={this.state.isActive ? Images.downIcon : Images.upIcon}
                  resizeMode="contain"
                />
              ) : (
                  <View />
                )}
            </View>
          </View>
        </TouchableOpacity>
        {
          this.state.isActive ? <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return <TouchableOpacity
                style={{height: 40, justifyContent: 'center'}}
                key={{index}}
                onPress={() => {
                  this.props.clearRequestData();
                  if (item.routeName === RouteKey.ListRequest) {
                    this.onResetFilter();
                    this.props.replaceNav(item.routeName);
                  
                  } else {
                    this.props.pushNav(item.routeName);
                  }
                }}>
                <Text style={{
                  fontFamily: FontNames.RobotoRegular, fontSize: 16,
                  color: AppColors.black60TextColor, marginLeft: 50
                }}>{item && item.label}</Text>
              </TouchableOpacity>

            }} /> : <View />
        }
      </View>
    );
  }
}

export default connect(state => ({
  lstFilterData: state.request.filterData,
}),
  dispatch => (bindActionCreators({
    pushNav,
    replaceNav,
    filterDataAction,
    filterDateRangeAction,
    clearRequestData
  }, dispatch))
)(Collapsible)

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50
  },
  leftContainer: {
    height: 50,
    flex: 8,
    alignItems: "center",
    flexDirection: "row"
  },
  rightContainer: {
    height: 50,
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  leftIcon: {
    marginLeft: 15,
    marginRight: 15,
    width: 20,
    height: 20,
    tintColor: '#000'
  },
  title: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 16
  }
});

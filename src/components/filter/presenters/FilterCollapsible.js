import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { FontNames } from "../../../theme/fonts";
import { Images } from "../../../theme/images";
import { AppColors } from "../../../theme/colors";
import CheckBox from "../../../common/Checkbox";

var get = require("lodash.get");

class FilterCollapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: true
    };
  }

  render() {
    let { title, items, isSelected, onSelectedAll, onDeselectAll } = this.props;

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.leftContainer} onPress={() => {
            this.setState({ isActive: !this.state.isActive });
          }} >
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
          {items && items.length > 0 && (
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              activeOpacity={0.9}
              onPress={() => {
                this.setState({ isActive: !this.state.isActive });
              }}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={this.state.isActive ? Images.downIcon : Images.upIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {this.state.isActive && items && items.length > 0 && (
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <TouchableOpacity
              onPress={() => {
                onSelectedAll(title, true);
              }}
              style={{
                justifyContent: "center",
                width: 90,
                height: 30
              }}
            >
              <Text style={{ color: "#128ff9", fontSize: 14 }}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDeselectAll(title, false);
              }}
              style={{
                justifyContent: "center",
                width: 90,
                height: 30
              }}
            >
              <Text style={{ color: "#e04949", fontSize: 14 }}>
                Deselect All
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {this.state.isActive ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{ height: 40, flexDirection: "row", paddingLeft: 15 }}
                  key={{ index }}
                  onPress={() => {
                    isSelected(title, item);
                  }}
                >
                  <CheckBox
                    normalIcon={Images.blankIcon}
                    highlightIcon={Images.checked2Icon}
                    active={item.selected}
                    onPress={() => {
                      isSelected(title, item);
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: FontNames.RobotoRegular,
                      fontSize: 16,
                      color: AppColors.black60TextColor,
                      marginLeft: 10
                    }}
                  >
                    {item.name
                      ? item.name
                      : item.description || item.nameStatus}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(FilterCollapsible);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50
  },
  leftContainer: {
    height: 40,
    flex: 8,
    alignItems: "center",
    flexDirection: "row"
  },
  rightContainer: {
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  leftIcon: {
    marginLeft: 15,
    marginRight: 15,
    width: 20,
    height: 20
  },
  title: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 16,
    color: "#333333"
  }
});

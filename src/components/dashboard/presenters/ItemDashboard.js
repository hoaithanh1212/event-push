import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RouteKey } from "../../../contants/route-key";
import { Images } from "../../../theme/images";
import { FontNames } from "../../../theme/fonts";
import moment from "moment";

export default class ItemDashboard extends Component {
  constructor(props) {
    super(props);
  }

  checkDate() {
    let { item } = this.props;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var today = dd + "/" + mm + "/" + yyyy;

    let itemDate = Date.parse(moment(item.startDate, "DD/MM/YYYY"));
    let currentDate = Date.parse(moment(today, "DD/MM/YYYY"));
    if (itemDate == currentDate) {
      return "Today";
    }
    if (itemDate - currentDate <= 86400000) {
      return "Tomorrow";
    } else {
      let strDate = moment(moment(item.startDate, "DD/MM/YYYY")).format(
        "ddd, DD/MM/YYYY"
      );
      return strDate;
    }
  }

  render() {
    let { item, index, today, onPressItem } = this.props;
    return (
      <TouchableOpacity
        style={{ flex: 1, marginLeft: 5, marginRight: 5, marginBottom: 10 }}
        activeOpacity={0.5}
        onPress={() => {onPressItem && onPressItem()}}
        key={index}
      >
        <View
          style={{
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Text
            style={{
              marginTop: 5,
              fontFamily: FontNames.RobotoMedium,
              fontSize: 12,
              color: today ? "#7ed321" : "#128ff9"
            }}
          >
            {this.checkDate()}
          </Text>
          <Text
            style={{
              marginTop: 5,
              fontFamily: FontNames.RobotoMedium,
              fontSize: 12,
              color: today ? "#7ed321" : "#128ff9"
            }}
          >
            {item.startTime}
          </Text>
          <Text
            style={{
              marginTop: 5,
              fontFamily: FontNames.RobotoMedium,
              fontSize: 12,
              color: "#666666"
            }}
          >
            {item.programTypeName}
          </Text>
          <View
            style={{
              width: 40,
              height: 1,
              backgroundColor: "#d8d8d8",
              marginTop: 5,
              marginBottom: 5
            }}
          />
          <Image
            source={Images.trainerIcon}
            style={{ width: 16, height: 13 }}
          />
          <Text
            style={{
              marginTop: 5,
              fontFamily: FontNames.RobotoMedium,
              fontSize: 11,
              color: "#666666"
            }}
          >
            {item.userPartnerName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

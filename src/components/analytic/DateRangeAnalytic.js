import React, {Component} from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Images} from "../../theme/images";
import {FontNames} from "../../theme/fonts";
import {AppColors} from "../../theme/colors";
import FilterHeader from "../filter/presenters//FilterHeader";
import DateTimeInputWithTitle from "../../common/DateTimeInputWithTitle";
import moment from "moment";
import {Message} from "../../common/Message";
import {showMessage} from "../../common/Message";
var get = require("lodash.get");

class DateRangeAnalytic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    const navParams = this.props.navigation.state.params
    if (navParams && navParams.startDate !== '') {
      this.setState({startDate: navParams.startDate, endDate: navParams.endDate})
    }
  }

  formatDate = date => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    }
    return "";
  };

  render() {
    return (
      <View style={styles.container}>
        <FilterHeader
          title={"SET DATE RANGE"}
          leftAction={() => {
            this.props.navigation.goBack();
          }}
          rightAction={() => {
            if (
              Date.parse(moment(this.state.startDate, "DD/MM/YYYY")) > Date.parse(moment(this.state.endDate, "DD/MM/YYYY"))
            ) {
              showMessage("End Date must be greater than Start Date");
            } else {
              this.props.navigation.state.params.returnData(this.state.startDate, this.state.endDate);
              this.props.navigation.goBack();
            }
          }}
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={{marginLeft: -24, marginRight: -24}}>
              <Message />
            </View>
            <Text
              style={{
                color: AppColors.registerTitleColor,
                fontSize: 14,
                fontFamily: FontNames.RobotoBold,
                marginTop: 30,
                marginBottom: 5
              }}
            >
              CUSTOM RANGE
            </Text>
            <DateTimeInputWithTitle
              placeholder={"Start Date"}
              mode={"date"}
              tailIcon={Images.dateIcon}
              changeText={text => {
                this.setState({startDate: this.formatDate(text)});
              }}
              date={this.state.startDate}
            />
            <DateTimeInputWithTitle
              placeholder={"End Date"}
              mode={"date"}
              tailIcon={Images.dateIcon}
              changeText={text => {
                this.setState({endDate: this.formatDate(text)});
              }}
              date={this.state.endDate}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
  }),
  dispatch =>
    bindActionCreators(
      {
        
      },
      dispatch
    )
)(DateRangeAnalytic);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 10
  },
  button: {
    backgroundColor: AppColors.lightGray1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  },
  buttonText: {
    color: AppColors.grayTextColor,
    fontFamily: FontNames.RobotoBold,
    fontSize: 12
  }
});

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  processColor,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { HorizontalBarChart, CombinedChart } from "react-native-charts-wrapper";
var get = require("lodash.get");

class ChartFullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        markerColor: processColor("gray"),
        textColor: processColor("white"),
        markerFontSize: 14
      },
      data: {},

      showChart1: false,
      showChart2: false,
      showChart3: false,
      showChart4Sub1: false,
      showChart4Sub2: false,
      showChart5: false
    };
  }

  componentDidMount() {
    const navParams = this.props.navigation.state.params;
    if (navParams && navParams.startDate !== "") {
      this.setState({
        showChart1: get(navParams, "showChart1", false),
        showChart2: get(navParams, "showChart2", false),
        showChart3: get(navParams, "showChart3", false),
        showChart4Sub1: get(navParams, "showChart4Sub1", false),
        showChart4Sub2: get(navParams, "showChart4Sub2", false),
        showChart5: get(navParams, "showChart5", false),

        data: navParams.data
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showChart1 && (
          <HorizontalBarChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            marker={this.state.marker}
            scaleXEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
        {this.state.showChart2 && (
          <CombinedChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            yAxis={this.state.data.yAxis}
            marker={this.state.marker}
            scaleYEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
        {this.state.showChart3 && (
          <CombinedChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            marker={this.state.marker}
            yAxis={this.state.data.yAxis}
            scaleYEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
        {this.state.showChart4Sub1 && (
          <HorizontalBarChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            marker={this.state.marker}
            scaleXEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
        {this.state.showChart4Sub2 && (
          <HorizontalBarChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            marker={this.state.marker}
            scaleXEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
        {this.state.showChart5 && (
          <HorizontalBarChart
            style={styles.chart}
            data={this.state.data.data}
            xAxis={this.state.data.xAxis}
            legend={this.state.legend}
            marker={this.state.marker}
            scaleXEnabled={false}
            animation={{ durationX: 1000 }}
            chartDescription={{ text: "" }}
          />
        )}
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)(ChartFullScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  chart: {
    flex: 1,
    margin: 10
  }
});

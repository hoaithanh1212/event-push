import React, { Component } from "react";
import { StyleSheet, Text, View, processColor, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DrawerActions } from "react-navigation";
import DashBoardHeader from "../dashboard/presenters/DashBoardHeader";
import { RouteKey } from "../../contants/route-key";
import { Images } from "../../theme/images";
import { FontNames } from "../../theme/fonts";
import DropdownWithoutBorder from '../../common/DropdownWithoutBorder';
import {
  chartGrc,
  chart2,
  chart3,
  chart4sub1,
  chart4sub2,
  chart5,
  getLeaderShipBoards,
  getDivisionByGrc
} from "../../services/requestService";
import { filterUser } from "../../services/userService";
import { HorizontalBarChart, CombinedChart } from "react-native-charts-wrapper";
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import moment from 'moment';
import { pushNav } from "../../actions/navigate";
import DropdownAutocomplete from '../../common/DropdownAutocomplete';
import {FIELD_TYPE, FREQUENCY_TYPE, QUARTERLY_PERIOD} from '../../contants/profile-field';

var get = require("lodash.get");

export const FIELD_TYPE_NOT_PARTNER = [
  {
    name: 'GRC',
    value: 1,
  }, {
    name: 'Division',
    value: 2,
  }
]

const ALL_GRC_ITEM = {
  id: '',
  name: 'All GRC'
}

const ALL_DIVISION_ITEM = {
  id: '',
  name: 'All Division'
}

class AnalyticContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDivision: [],
      listGrc: [],
      listPartner: [],

      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        markerColor: processColor("gray"),
        textColor: processColor("white"),
        markerFontSize: 14
      },
      dataGRCL1: {},
      dataGRCL2: {},
      dataGRCL3: {},
      dataATCL1: {},
      dataATCL2: {},
      dataCancelCount: {},

      showChart1: false,
      showChart2: false,
      showChart3: false,
      showChart4Sub1: false,
      showChart4Sub2: false,
      showChart5: false,

      partners: [],

      startDate: '',
      endDate: '',

      chart1FieldType: FIELD_TYPE[0],
      chart2FieldType: FIELD_TYPE[0],
      chart3FieldType: FIELD_TYPE[0],
      chart4Sub1FieldType: FIELD_TYPE[0],
      chart4Sub2FieldType: FIELD_TYPE[0],
      chart5FieldType: FIELD_TYPE[0],
      
      chart1ChildTitle: 'All GRC',
      chart1ChildData: [],
      chart1ChildItem: {},

      chart2GRCTitle: 'Select GRC',
      chart2ChildGRCData: [],
      chart2ChildGRCItem: {},

      chart2DivisionTitle: 'Select Division',
      chart2DivisionData: [],
      chart2DivisionItem: {},

      chart3ChildTitle: 'GRC',
      chart3ChildData: [],
      chart3ChildItem: {},
      chart3FrequencyType: FREQUENCY_TYPE[0],

      chart4Sub2ChildTitle: 'GRC',
      chart4Sub2ChildData: [],
      chart4Sub2ChildItem: {},

      chart5GRCTitle: 'Select GRC',
      chart5GRCData: [],
      chart5GRCItem: {},

      chart5DivisionTitle: 'Select Division',
      chart5DivisionData: [],
      chart5DivisionItem: {},

      quarterlyPeriod1: '',
      quarterlyPeriod2: ''
    };
  }

  quarterlyPeriod = (monthBefore30days, yearBefore30days, month, year) => {
    let quarterlyPeriod1 = ''
    let quarterlyPeriod2 = ''
    
    QUARTERLY_PERIOD.Q1.map(item => {
      if (item == monthBefore30days) {
        quarterlyPeriod1 = 'Q1'
      }
      if (item == month) {
        quarterlyPeriod2 = 'Q1'
      }
    })

    QUARTERLY_PERIOD.Q2.map(item => {
      if (item == monthBefore30days) {
        quarterlyPeriod1 = 'Q2'
      }
      if (item == month) {
        quarterlyPeriod2 = 'Q2'
      }
    })

    QUARTERLY_PERIOD.Q3.map(item => {
      if (item == monthBefore30days) {
        quarterlyPeriod1 = 'Q3'
      }
      if (item == month) {
        quarterlyPeriod2 = 'Q3'
      }
    })

    QUARTERLY_PERIOD.Q4.map(item => {
      if (item == monthBefore30days) {
        quarterlyPeriod1 = 'Q4'
      }
      if (item == month) {
        quarterlyPeriod2 = 'Q4'
      }
    })
    this.setState({quarterlyPeriod1: quarterlyPeriod1 + ' - ' + yearBefore30days, quarterlyPeriod2: quarterlyPeriod2 + ' - ' + year})
  }

  componentDidMount() {
    let date = this.formatDate(moment(new Date()));
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    let before30days = this.formatDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    let monthBefore30days = new Date(new Date().setDate(new Date().getDate() - 30)).getMonth() + 1;
    let yearBefore30days = new Date(new Date().setDate(new Date().getDate() - 30)).getFullYear();

    this.quarterlyPeriod(monthBefore30days, yearBefore30days, month, year);

    let listChart1GRC = [];
    listChart1GRC.push(ALL_GRC_ITEM);
    let newGRCs = this.props.grcs.sort((a,b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      else if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      return 0;
    });
    newGRCs.map(item => {
      // if (item.name !== 'Testing GRC' && item.name !== 'Mountbatten SMC' && item.name !== 'MACPHERSON SMC'
      //     && item.name !== 'YUHUA SMC' && item.name !== 'PIONEER SMC' && item.name !== 'BUKIT BATOK SMC') {
        listChart1GRC.push(item);
      // }
    })

    let listChart2Division = [];
    listChart2Division.push(ALL_DIVISION_ITEM);
    let newDivision = this.props.divisions.sort((a,b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      else if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      return 0;
    });
    newDivision.map(item => {
      listChart2Division.push(item);
    })

    this.setState({startDate: before30days, endDate: date,
      chart1ChildData: listChart1GRC, chart1ChildItem: listChart1GRC.length > 0 ? listChart1GRC[0] : {},

      chart2ChildGRCData: this.props.grcs, chart2ChildGRCItem: this.props.grcs.length > 0 ? this.props.grcs[0] : {},
      chart2DivisionData: listChart2Division, chart2DivisionItem: listChart2Division.length > 0 ? listChart2Division[0] : {},
      chart5GRCData: this.props.grcs, chart5GRCItem: this.props.grcs.length > 0 ? this.props.grcs[0] : {},
      chart5DivisionData: listChart2Division, chart5DivisionItem: listChart2Division.length > 0 ? listChart2Division[0] : {},
      // chart3ChildData: this.props.grcs, chart3ChildItem: this.props.grcs.length > 0 ? this.props.grcs[0] : {},
      // chart4Sub2ChildData: this.props.grcs, chart4Sub2ChildItem: this.props.grcs.length > 0 ? this.props.grcs[0] : {}
    });

    this.getChart1(before30days, date, get(this.state.chart1ChildItem, 'id', ''));
    this.getChart2(before30days, date, this.state.chart2FieldType.value, this.props.grcs.length > 0 ? this.props.grcs[0].id : '');
    // this.getChart3(before30days, date, this.state.chart3FieldType.value, this.props.grcs.length > 0 ? this.props.grcs[0].id : '', this.state.chart3FrequencyType.value);
    // this.getChart4Sub1(before30days, date, this.state.chart4Sub1FieldType.value);
    // this.getChart4Sub2(before30days, date, this.state.chart4Sub2FieldType.value, this.props.grcs.length > 0 ? this.props.grcs[0].id : '');
    this.getChart5(before30days, date, this.state.chart5FieldType.value, this.props.grcs.length > 0 ? this.props.grcs[0].id : '');

    this.getDivisionByGrc(this.props.grcs.length > 0 && this.props.grcs[0].id, 2);
    this.getDivisionByGrc(this.props.grcs.length > 0 && this.props.grcs[0].id, 5);
    this.getPartner();
    this.getLeaderShipBoards(before30days, date);
  }

  returnData(startDate, endDate) {
    if (startDate && startDate !== '') {
      if (startDate !== this.state.startDate || endDate !== this.state.endDate) {
        let month = moment(startDate, 'DD/MM/YYYY').format('M');
        let year = moment(startDate, 'DD/MM/YYYY').format('YYYY');

        let monthBefore30days = moment(endDate, 'DD/MM/YYYY').format('M');
        let yearBefore30days = moment(endDate, 'DD/MM/YYYY').format('YYYY')

        this.quarterlyPeriod(monthBefore30days, yearBefore30days, month, year);
        
        this.setState({startDate: startDate, endDate: endDate});
        
        this.getChart1(startDate, endDate, get(this.state.chart1ChildItem, 'id', ''));
        this.getChart2(startDate, endDate, this.state.chart2FieldType.value, this.state.chart2FieldType.value === 1 ? get(this.state.chart2ChildGRCItem, 'id', '') : get(this.state.chart2DivisionItem, 'id', ''));
        // this.getChart3(startDate, endDate, this.state.chart3FieldType.value, get(this.state.chart3ChildItem, 'id', ''), this.state.chart3FrequencyType.value);
        // this.getChart4Sub1(startDate, endDate, this.state.chart4Sub1FieldType.value);
        // this.getChart4Sub2(startDate, endDate, this.state.chart4Sub2FieldType.value, get(this.state.chart4Sub2ChildItem, 'id', ''));
        this.getChart5(startDate, endDate, this.state.chart5FieldType.value, this.state.chart5FieldType.value === 1 ? get(this.state.chart5GRCItem, 'id', '') : get(this.state.chart5DivisionItem, 'id', ''));

        this.getLeaderShipBoards(startDate, endDate);
      }
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <DashBoardHeader
        title={"analytics"}
        leftAction={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightAction={() => {
          navigation.navigate(RouteKey.UserProfile);
        }}
      />
    )
  });

  getPartner = () => {
    filterUser('Partner').then(response => {
      if (response.statusCode === 200) {
        this.setState({partners: response.data && response.data.list})
      }
    });
  };

  getDivisionByGrc = (grcId, chartInfo) => {
    getDivisionByGrc(grcId).then(response => {
      if (response.statusCode === 200) {
        let listChart2Division = [];
        listChart2Division.push(ALL_DIVISION_ITEM);
        let newDivision = response.data && response.data.list.sort((a,b) => {
          if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
          else if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
          return 0;
        });
        newDivision.map(item => {
          listChart2Division.push(item);
        })
        if (chartInfo === 2)
          this.setState({chart2DivisionData: listChart2Division, chart2DivisionItem: listChart2Division.length > 0 ? listChart2Division[0] : {}})
        else
          this.setState({chart5DivisionData: listChart2Division, chart5DivisionItem: listChart2Division.length > 0 ? listChart2Division[0] : {}})
      }
    });
  };

  getLeaderShipBoards = (startDate, endDate) => {
    getLeaderShipBoards(startDate, endDate).then(response => {
      console.log('get LeaderShipBoards', response);
      if (response.statusCode === 200) {
        if (response.data) {
          this.setState({listDivision: response.data.listDivision, listGrc: response.data.listGrc, listPartner: response.data.listPartner})
        }
      }
    });
  };

  getChart1 = (startDate, endDate, grcId) => {
    chartGrc(startDate, endDate, grcId).then(response => {
      if (response.statusCode === 200) {
        if (response.data && response.data.length > 0) {
          this.setState({ showChart1: true });
        } else {
          this.setState({ showChart1: false });
        }
        let valueFormatter = [];
        let values = [];
        response.data.map(item => {
          if (item && item.name.length > 23) {
            valueFormatter.push(item.name.slice(0, 23) + '...');
          } else {
            valueFormatter.push(item.name);
          }
          values.push(item.countRequestDetail);
        });
        const newDataGRCL1 = {
          data: {
            dataSets: [
              {
                values: values,
                label: '',
                config: {
                  drawValues: false,
                  color: processColor("#128ff9"),
                  barShadowColor: processColor("lightgrey"),
                  highlightAlpha: 90,
                  highlightColor: processColor("red")
                }
              }
            ],
            config: {
              barWidth: 0.7
            }
          },
          xAxis: {
            valueFormatter: valueFormatter,
            position: "BOTTOM",
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: response.data.length,
            labelCount: response.data.length
          }
        };
        this.setState({ dataGRCL1: newDataGRCL1 });
      } else {
        console.log("chart1", response.message);
      }
    });
  };

  getChart2 = (startDate, endDate, chart2FieldType, chart2ChildId) => {
    chart2(startDate, endDate, chart2FieldType, chart2ChildId).then(
      response => {
        if (response.statusCode === 200) {
          if (response.data && response.data.length > 0) {
            this.setState({ showChart2: true });
          } else {
            this.setState({ showChart2: false });
          }
          let valueFormatter = [];
          let values = [];
          let gacs = [];
          response.data.map(item => {
            if (item && item.name.length > 23) {
              valueFormatter.push(item.name.slice(0, 23) + '...');
            } else {
              valueFormatter.push(item.name);
            }
            values.push(item.countRequestDetail);
            gacs.push(item.gac);
          });
          const newDataGRCL2 = {
            xAxis: {
              valueFormatter: valueFormatter,
              position: "BOTTOM",
              granularityEnabled: true,
              granularity: 1,
              axisMaximum: response.data.length,
              axisMinimum: -1,
              labelCount: response.data.length,
              labelRotationAngle: 90
            },
            yAxis: {
              left: {
                granularityEnabled: true,
                granularity: 100,
                axisMinimum: -1
              },
              right: {
                granularityEnabled: true,
                granularity: 10,
                axisMinimum: -1
              }
            },
            data: {
              barData: {
                dataSets: [
                  {
                    values: values,
                    label: "",
                    config: {
                      drawValues: false,
                      color: processColor("#128ff9"),
                      barShadowColor: processColor("lightgrey"),
                      highlightAlpha: 90,
                      highlightColor: processColor("red")
                    }
                  }
                ]
              },
              scatterData: {
                dataSets: [
                  {
                    values: gacs,
                    label: "",
                    config: {
                      drawValues: false,
                      color: processColor("#254e70"),
                      scatterShape: "CIRCLE",
                      scatterShapeHoleRadius: 5,
                      scatterShapeHoleColor: processColor("#254e70")
                    }
                  }
                ]
              }
            }
          };
          this.setState({ dataGRCL2: newDataGRCL2 });
        } else {
          console.log("chart2", response.message);
        }
      }
    );
  };

  getChart3 = (
    startDate,
    endDate,
    chart3FieldType,
    chart3ChildId,
    frequencyType
  ) => {
    chart3(
      startDate,
      endDate,
      chart3FieldType,
      chart3ChildId,
      frequencyType
    ).then(response => {
      if (response.statusCode === 200) {
        if (response.data && response.data.length > 0) {
          this.setState({ showChart3: true });
        } else {
          this.setState({ showChart3: false });
        }
        let valueFormatter = [];
        let values1 = [];
        let values2 = [];
        response.data.map(item => {
          valueFormatter.push(item.name);
          values1.push(item.countRequestDetail1);
          values2.push(item.countRequestDetail2);
        });
        const newDataGRCL3 = {
          xAxis: {
            valueFormatter: valueFormatter,
            position: "BOTTOM",
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: response.data.length,
            axisMinimum: -1,
            labelCount: response.data.length,
            labelRotationAngle: 90
          },
          yAxis: {
            left: {
              granularityEnabled: true,
              granularity: 10,
              axisMinimum: -1
            },
            right: {
              granularityEnabled: true,
              granularity: 10,
              axisMinimum: -1
            }
          },
          data: {
            barData: {
              dataSets: [
                {
                  values: values1,
                  label: "",
                  config: {
                    drawValues: false,
                    color: processColor("#128ff9"),
                    barShadowColor: processColor("lightgrey"),
                    highlightAlpha: 90,
                    highlightColor: processColor("red")
                  }
                }
              ]
            },
            lineData: {
              dataSets: [
                {
                  values: values2,
                  label: "",
                  config: {
                    mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 2,
                    drawCircles: true,
                    circleColor: processColor("#254e70"),
                    drawCircleHole: false,
                    circleRadius: 6,
                    highlightColor: processColor("transparent"),
                    color: processColor("#254e70")
                  }
                }
              ]
            }
          }
        };
        this.setState({ dataGRCL3: newDataGRCL3 });
      } else {
        console.log("chart3", response.message);
      }
    });
  };

  getChart4Sub1 = (startDate, endDate, chart4Sub1FieldType) => {
    chart4sub1(startDate, endDate, chart4Sub1FieldType).then(response => {
      if (response.statusCode === 200) {
        if (response.data && response.data.length > 0) {
          this.setState({ showChart4Sub1: true });
        } else {
          this.setState({ showChart4Sub1: false });
        }
        let valueFormatter = [];
        let values = [];
        response.data.map(item => {
          valueFormatter.push(item.name);
          values.push(item.countRequestDetail);
        });
        const newDataATCL1 = {
          data: {
            dataSets: [
              {
                values: values,
                label: "",
                config: {
                  drawValues: false,
                  color: processColor("#3bafbf"),
                  barShadowColor: processColor("lightgrey"),
                  highlightAlpha: 90,
                  highlightColor: processColor("red")
                }
              }
            ],
            config: {
              barWidth: 0.5
            }
          },
          xAxis: {
            valueFormatter: valueFormatter,
            position: "BOTTOM",
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: response.data.length,
            labelCount: response.data.length
          }
        };
        this.setState({ dataATCL1: newDataATCL1 });
      } else {
        console.log('chart4Sub1', response.message)
      }
    });
  }

  getChart4Sub2 = (startDate, endDate, chart4Sub2FieldType, chart4Sub2ChildId) => {
    chart4sub2(startDate, endDate, chart4Sub2FieldType, chart4Sub2ChildId).then(
      response => {
        if (response.statusCode === 200) {
          if (response.data && response.data.length > 0) {
            this.setState({ showChart4Sub2: true });
          } else {
            this.setState({ showChart4Sub2: false });
          }

          let valueFormatter = [];
          let values = [];
          response.data.map(item => {
            valueFormatter.push(item.name);
            values.push(item.countRequestDetail);
          });
          const newDataATCL2 = {
            data: {
              dataSets: [
                {
                  values: values,
                  label: "",
                  config: {
                    drawValues: false,
                    color: processColor("#3bafbf"),
                    barShadowColor: processColor("lightgrey"),
                    highlightAlpha: 90,
                    highlightColor: processColor("red")
                  }
                }
              ],
              config: {
                barWidth: 0.5
              }
            },
            xAxis: {
              valueFormatter: valueFormatter,
              position: "BOTTOM",
              granularityEnabled: true,
              granularity: 1,
              axisMaximum: response.data.length,
              labelCount: response.data.length
            }
          };
          this.setState({ dataATCL2: newDataATCL2 });
        } else {
          console.log('chart4Sub2', response.message)
        }
      }
    );
  }

  getChart5 = (startDate, endDate, chart5FieldType, chart5ChildId) => {
    chart5(startDate, endDate, chart5FieldType, chart5ChildId).then(response => {
      if (response.statusCode === 200) {
        if (response.data && response.data.length > 0) {
          this.setState({ showChart5: true });
        } else {
          this.setState({ showChart5: false });
        }

        let valueFormatter = [];
        let values = [];
        response.data.map(item => {
          if (item && item.name.length > 23) {
            valueFormatter.push(item.name.slice(0, 23) + '...');
          } else {
            valueFormatter.push(item.name);
          }
          values.push(item.countRequestDetail);
        });
        const newDataCancelCount = {
          data: {
            dataSets: [
              {
                values: values,
                label: "",
                config: {
                  drawValues: false,
                  color: processColor("#e04949"),
                  barShadowColor: processColor("lightgrey"),
                  highlightAlpha: 90,
                  highlightColor: processColor("red")
                }
              }
            ],
            config: {
              barWidth: 0.5
            }
          },
          xAxis: {
            enabled: true,
            valueFormatter: valueFormatter,
            position: "BOTTOM",
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: response.data.length,
            labelCount: response.data.length,
          }
        };
        this.setState({ dataCancelCount: newDataCancelCount });
      } else {
        console.log('chart5', response.message)
      }
    });
  }

  formatDate = date => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    }
    return "";
  };

  renderDotIndicator() {
      return <PagerDotIndicator pageCount={3} />; 
  }

  onRefresh = () => {
    let {
      startDate, endDate,
      chart1FieldType,
      chart2FieldType, chart2ChildGRCItem, chart2DivisionItem,
      chart3FrequencyType, chart3FieldType, chart3ChildItem,
      chart4Sub1FieldType,
      chart4Sub2FieldType, chart4Sub2ChildItem,
      chart5FieldType, chart5GRCItem, chart5DivisionItem,} = this.state;

    this.getChart1(startDate, endDate, get(this.state.chart1ChildItem, 'id', ''));
    this.getChart2(startDate, endDate, chart2FieldType.value, chart2FieldType.value === 1 ? get(chart2ChildGRCItem, 'id', '') : get(chart2DivisionItem, 'id', ''));
    this.getChart3(startDate, endDate, chart3FieldType.value, get(chart3ChildItem, 'id', ''), chart3FrequencyType.value);
    this.getChart4Sub1(startDate, endDate, chart4Sub1FieldType.value);
    this.getChart4Sub2(startDate, endDate, chart4Sub2FieldType.value, get(chart4Sub2ChildItem, 'id', ''));
    this.getChart5(startDate, endDate, chart5FieldType.value, chart5FieldType.value === 1 ? get(chart5GRCItem, 'id', '') : get(chart5DivisionItem, 'id', ''));

    this.getLeaderShipBoards(this.state.startDate, this.state.endDate);
  };

  renderTopLeader = (title, content, list) => {
    return (
      <View style={styles.contentTopLeader} >
        <Text style={styles.topLeaderTitle}>{title}</Text>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={{flex: 1, fontFamily: FontNames.RobotoLight, color: '#000'}}>Name</Text>
          <View style={{flex: 1, alignItems: 'flex-end', fontFamily: FontNames.RobotoLight, color: '#000'}}><Text>{content}</Text></View>
        </View>
        <View style={{height: 1, backgroundColor: 'gray', marginTop: 5}}/>
        {
          list.length > 0 ? list.map((item) => {
            return (
              <View key={item.id} style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{flex: 7, fontFamily: FontNames.RobotoLight, color: '#000'}}>{item.name}</Text>
                <View style={{flex: 3, alignItems: 'flex-end', fontFamily: FontNames.RobotoLight, color: '#000'}}><Text>{item.count}</Text></View>
              </View>
            );
          }) : <View>
          <View style={{marginTop: 20, height: 40, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{flex: 1, fontFamily: FontNames.RobotoLight, color: '#000'}}>No data</Text>
          </View>
          </View>
        }
      </View>
    )
  }

  render() {
    let {grcs, divisions} = this.props;
    let {
      startDate, endDate, partners,
      chart1FieldType,
      chart1ChildData, chart1ChildItem,
      chart2ChildGRCData, chart2ChildGRCItem, chart2DivisionData, chart2DivisionItem,
      chart3FrequencyType, chart3FieldType, chart3ChildData, chart3ChildItem,
      chart4Sub1FieldType,
      chart4Sub2FieldType, chart4Sub2ChildData, chart4Sub2ChildItem,
      chart5GRCData, chart5GRCItem, chart5DivisionData, chart5DivisionItem} = this.state;

    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.dateRangeContent}>
            <View style={{flex: 1, justifyContent: 'center', height: 30}}>
              <Text style={styles.textTitle}>LEADERBOARDS</Text>
            </View>
            <TouchableOpacity 
              onPress={() => {this.props.pushNav(RouteKey.DateRangeAnalytic, { startDate: startDate, endDate: endDate, returnData: this.returnData.bind(this) })}}
              style={{height: 30, flex: 2, flexDirection: 'row', borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
              <Image
                source={Images.timeIcon}
                style={{width: 15, height: 15 }}
              />
              <Text style={{marginLeft: 10, fontFamily: FontNames.RobotoLight, color: '#000'}}>{this.state.startDate + ' - ' + this.state.endDate}</Text>
            </TouchableOpacity>
          </View>

          <IndicatorViewPager style={{marginTop: 10, height: 180}} indicator={this.renderDotIndicator()}>
            <View>
              {
                this.renderTopLeader('TOP 3 DIVISION', 'Division (Counts)', this.state.listDivision)
              }
            </View>
            <View>
              {
                this.renderTopLeader('TOP 3 SESSION', 'Session (Counts)', this.state.listGrc)
              }
            </View>
            <View>
              {
                this.renderTopLeader('TOP 3 PARTNER', 'Partner (Counts)', this.state.listPartner)
              }
            </View>
          </IndicatorViewPager>
          <View style={{marginLeft: 20, marginRight: 20}}>
            <Text style={[styles.textTitle, {marginBottom: 10}]}>Session count by GRCs</Text>
            <View style={styles.contentChart} >
              <View style={{flex: 1, alignItems: 'center'}}>  
                <Text style={{fontSize: 10, color: '#9d9d9d'}}>Session (Counts)</Text>
              </View>
              {this.state.showChart1 ? (
                <View style={styles.containerChart}>
                  <HorizontalBarChart
                    style={styles.chart}
                    data={this.state.dataGRCL1.data}
                    xAxis={this.state.dataGRCL1.xAxis}
                    legend={this.state.legend}
                    marker={this.state.marker}
                    scaleXEnabled={false}
                    animation={{ durationX: 1000 }}
                    chartDescription={{text: ""}}
                  />
                </View>
              ) : (
                <View style={{height: 60, alignItems: 'center', justifyContent: 'center'}}>
                  <Text>No data</Text>
                </View>
              )}
              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
              <View style={styles.containerInfoChart}>
                <Image
                  source={Images.timeIcon}
                  style={styles.imageTime}
                />
                <Text style={{marginLeft: 5, fontSize: 12}}>{startDate + ' - ' + endDate}</Text>
                <View style={[styles.breakLine, {marginRight: 10}]} />
                <View style={{flex: 1, flexDirection: 'row'}}>
                  {this.state.showChart1 && (<View style={{flex: 1, height: 30, flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}} onPress={() => {
                      this.props.pushNav(RouteKey.ChartFullScreen, { showChart1: true, data: this.state.dataGRCL1 })
                    }}>
                      <Image
                        source={Images.fullScreenIcon}
                        style={{width: 15, height: 15, marginRight: 10}}
                      />
                    </TouchableOpacity>
                  </View>)}
                </View>
              </View>
              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
                <View style={{flex: 1, justifyContent: 'center', marginTop: 5, marginBottom: 5, marginRight: 10}}>
                  <DropdownAutocomplete
                    placeholder={'Choose GRCs'}
                    value={chart1ChildItem}
                    data={chart1ChildData}
                    onSelected={(item) => {
                      this.setState({ chart1ChildItem: item });
                      this.getChart1(startDate, endDate, get(item, 'id', ''));
                    }}
                />
              </View>
            </View>
            <Text style={[styles.textTitle, {marginTop: 10, marginBottom: 10}]}>Session count by Programmes</Text>
            
            <View style={[styles.contentChart, {flex: 1}]} >
              {this.state.showChart2 ? <View>
                <View style={{transform: [{ rotate: '90deg'}], width: 150, position: 'absolute', top: 170, left: -60}}><Text style={{fontSize: 10, color: '#9d9d9d'}}>Session (Counts)</Text></View>
                <View style={{transform: [{ rotate: '90deg'}], width: 150, position: 'absolute', top: 170, right: -60}}><Text style={{fontSize: 10, color: '#9d9d9d'}}>Global Average</Text></View>
              </View> : <View />}
              <View style={{paddingLeft: 5, paddingRight: 10}}> 
                {this.state.showChart2 ? (
                  <View style={[styles.containerChart, {flex: 8}]}>
                    <CombinedChart
                      style={styles.chart}
                      data={this.state.dataGRCL2.data}
                      xAxis={this.state.dataGRCL2.xAxis}
                      legend={this.state.legend}
                      yAxis={this.state.dataGRCL2.yAxis}
                      marker={this.state.marker}
                      scaleYEnabled={false}
                      animation={{ durationX: 1000 }}
                      chartDescription={{text: ""}}
                    />
                  </View>
                ) : (
                  <View style={styles.containerNoData}>
                    <Text>No data</Text>
                  </View>
                )}
              </View>
              <View style={{flex: 1, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <View
                  style={{width: 15, height: 25, backgroundColor: '#128ff9', borderTopLeftRadius: 3, borderTopRightRadius: 3}}
                />
                <Text style={{marginLeft: 5}}>Session</Text>
                <View
                  style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#254e70', marginLeft: 20}}
                />
                <Text style={{marginLeft: 5}}>Global Average</Text>
              </View>
              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
              <View style={styles.containerInfoChart}>
                <Image
                  source={Images.timeIcon}
                  style={styles.imageTime}
                />
                <Text style={{marginLeft: 5, fontSize: 12}}>{startDate + ' - ' + endDate}</Text>
                <View style={styles.breakLine} />
                {this.state.showChart2 && (
                  <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={() => {
                    this.props.pushNav(RouteKey.ChartFullScreen, { showChart2: true, data: this.state.dataGRCL2 })
                  }}>
                    <Image
                      source={Images.fullScreenIcon}
                      style={{width: 15, height: 15, marginRight: 10}}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center', marginTop: 5, marginBottom: 5 }}>
                  <DropdownAutocomplete
                    placeholder={'Choose GRCs'}
                    value={chart2ChildGRCItem}
                    data={chart2ChildGRCData}
                    onSelected={(item) => {
                      this.setState({ chart2ChildGRCItem: item, chart2FieldType: FIELD_TYPE[0] });
                      this.getChart2(startDate, endDate, 1, get(item, 'id', ''));
                      this.getDivisionByGrc(get(item, 'id', ''), 2);
                    }}
                  />
                </View>
                <View style={{backgroundColor: '#f2f2f2', width: 1, marginLeft: 10}} />
                  <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>
                    <DropdownAutocomplete
                      placeholder={'Choose Divisions'}
                      value={chart2DivisionItem}
                      data={chart2DivisionData}
                      onSelected={(item) => {
                        this.setState({ chart2DivisionItem: item, chart2FieldType: FIELD_TYPE[1] });
                        if (item.id === '')
                          this.getChart2(startDate, endDate, 1, get(chart2ChildGRCItem, 'id', ''));
                        else
                          this.getChart2(startDate, endDate, 2, get(item, 'id', ''));
                      }}
                    />
                </View>
              </View>
            </View>
            
            <Text style={[styles.textTitle, {marginTop: 10, marginBottom: 10}]}>Cancellation Count by Partner</Text>
            <View style={styles.contentChart} >
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 10, color: '#9d9d9d'}}>Activity (Counts)</Text>
              </View>
              {this.state.showChart5 ? (
                <View style={styles.containerChart}>
                  <HorizontalBarChart
                    style={styles.chart}
                    data={this.state.dataCancelCount.data}
                    xAxis={this.state.dataCancelCount.xAxis}
                    legend={this.state.legend}
                    marker={this.state.marker}
                    scaleXEnabled={false}
                    animation={{ durationX: 1000 }}
                    chartDescription={{text: ""}}
                  />
                </View>
              ) : (
                <View style={styles.containerNoData}>
                  <Text>No data</Text>
                </View>
              )}
              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
              <View style={styles.containerInfoChart}>
                <Image
                  source={Images.timeIcon}
                  style={styles.imageTime}
                />
                <Text style={{marginLeft: 5, fontSize: 12}}>{this.state.startDate + ' - ' + this.state.endDate}</Text>
                <View style={styles.breakLine} />
                {this.state.showChart5 && (
                  <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={() => {
                    this.props.pushNav(RouteKey.ChartFullScreen, { showChart5: true, data: this.state.dataCancelCount })
                  }}>
                    <Image
                      source={Images.fullScreenIcon}
                      style={{width: 15, height: 15, marginRight: 10}}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{backgroundColor: '#f2f2f2', height: 1}} />
              <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'center', marginTop: 5, marginBottom: 5 }}>
                    <DropdownAutocomplete
                      placeholder={'Choose GRCs'}
                      value={chart5GRCItem}
                      data={chart5GRCData}
                      onSelected={(item) => {
                        this.setState({ chart5GRCItem: item, chart5FieldType: FIELD_TYPE[0] });
                        this.getChart5(startDate, endDate, 1, get(item, 'id', ''));
                        this.getDivisionByGrc(get(item, 'id', ''), 5);
                      }}
                    />
                </View>
                <View style={{backgroundColor: '#f2f2f2', width: 1, marginLeft: 10}} />
                  <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>
                    <DropdownAutocomplete
                      placeholder={'Choose Divisions'}
                      value={chart5DivisionItem}
                      data={chart5DivisionData}
                      onSelected={(item) => {
                        this.setState({ chart5DivisionItem: item, chart5FieldType: FIELD_TYPE[1] });
                        if (item.id === '')
                          this.getChart5(startDate, endDate, 1, get(chart5GRCItem, 'id', ''));
                        else
                          this.getChart5(startDate, endDate, 2, get(item, 'id', ''));
                      }}
                    />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connect(
  state => ({
    grcs: state.app.grcs,
    divisions: state.app.divisions,
  }),
  dispatch => bindActionCreators({
    pushNav
  }, dispatch)
)(AnalyticContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  content: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20
  },
  dateRangeContent: {
    flexDirection: 'row', marginLeft: 20, marginRight: 20
  },
  textTitle: {
    color: '#333333', fontSize: 12, fontFamily: FontNames.RobotoBold
  },
  contentTopLeader: {
    borderRadius: 10, backgroundColor: 'white', padding: 10, marginLeft: 20, marginRight: 20
  },
  topLeaderTitle: {
    color: '#128ff9', fontSize: 12, fontFamily: FontNames.RobotoMedium
  },
  contentChart: {
    borderRadius: 10, backgroundColor: 'white', paddingTop: 10
  },
  containerChart: {
    height: 500
  },
  chart: {
    flex: 1,
    margin: 10
  },
  breakLine: {
    backgroundColor: '#f2f2f2', width: 1, height: 40, marginLeft: 10
  },
  containerInfoChart: {
    height: 40, alignItems: 'center', flexDirection: 'row'
  },
  imageTime: {
    width: 15, height: 15, marginLeft: 10
  },
  containerNoData: {
    flex: 8, height: 60, alignItems: 'center', justifyContent: 'center'
  }
});

// chart 3
// <Text style={[styles.textTitle, {marginTop: 10, marginBottom: 10}]}>Programme Comparision</Text>
//             <View style={styles.contentChart} >
//               {this.state.showChart3 ? 
//                 <View style={{transform: [{ rotate: '90deg'}], width: 150, position: 'absolute', top: 170, left: -60}}><Text style={{fontSize: 10, color: '#9d9d9d'}}>Programme (Counts)</Text></View>
//                 : <View />
//               }
//               <View style={{paddingLeft: 5, paddingRight: 5}}>
//                 {this.state.showChart3 ? (
//                   <View style={styles.containerChart}>
//                     <CombinedChart
//                       style={styles.chart}
//                       data={this.state.dataGRCL3.data}
//                       xAxis={this.state.dataGRCL3.xAxis}
//                       legend={this.state.legend}
//                       marker={this.state.marker}
//                       yAxis={this.state.dataGRCL3.yAxis}
//                       scaleYEnabled={false}
//                       animation={{ durationX: 1000 }}
//                       chartDescription={{text: ""}}
//                     />
//                   </View>
//                 ) : (
//                   <View style={styles.containerNoData}>
//                     <Text>No data</Text>
//                   </View>
//                 )}
//               </View>
//               <View style={{flex: 1, height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
//                 <View
//                   style={{width: 15, height: 25, backgroundColor: '#128ff9', borderTopLeftRadius: 3, borderTopRightRadius: 3}}
//                 />
//                 <Text style={{marginLeft: 5}}>{this.state.quarterlyPeriod2}</Text>
//                 <Image
//                   source={Images.lineIcon}
//                   style={{width: 20, height: 20, marginLeft: 20}}
//                 />
//                 <Text style={{marginLeft: 5}}>{this.state.quarterlyPeriod1}</Text>
//               </View>
//               <View style={{backgroundColor: '#f2f2f2', height: 1}} />
//               <View style={styles.containerInfoChart}>
//                 <Image
//                   source={Images.timeIcon}
//                   style={styles.imageTime}
//                 />
//                 <Text style={{marginLeft: 5, fontSize: 12}}>{startDate + ' - ' + endDate}</Text>
//                 <View style={[styles.breakLine, {marginRight: 10}]} />
//                 <View style={{width: 100, height: 30, justifyContent: 'center' }}>
//                   <DropdownWithoutBorder
//                     item={chart3FrequencyType}
//                     placeholder={'Quarterly'}
//                     dataSource={FREQUENCY_TYPE}
//                     fieldShow={'name'}
//                     value={chart3FrequencyType.name}
//                     title={'Frequency Type'}
//                     fieldCompare={'name'}
//                     onSelected={(item) => {
//                       this.setState({chart3FrequencyType: item})
//                       this.getChart3(startDate, endDate, chart3FieldType.value, chart3ChildItem.id, item.value);
//                     }}
//                   />
//                 </View>
//                 <View style={styles.breakLine} />
//                 {this.state.showChart3 && (
//                   <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={() => {
//                     this.props.pushNav(RouteKey.ChartFullScreen, { showChart3: true, data: this.state.dataGRCL3 })
//                   }}>
//                     <Image
//                       source={Images.fullScreenIcon}
//                       style={{width: 15, height: 15, marginRight: 10}}
//                     />
//                   </TouchableOpacity>
//                 )}
//               </View>

              
//               <View style={{backgroundColor: '#f2f2f2', height: 1}} />
//               <View style={{flexDirection: 'row'}}>
//                 <View style={{width: 100, marginLeft: 10 }}>
//                   <DropdownWithoutBorder
//                     item={chart3FieldType}
//                     placeholder={'GRC'}
//                     dataSource={FIELD_TYPE}
//                     fieldShow={'name'}
//                     value={chart3FieldType.name}
//                     fieldCompare={'name'}
//                     title={'Field Type'}
//                     onSelected={(item) => {
//                       let childData = [];
//                       let childItem = {};
//                       switch (item.value) {
//                         case 1: {
//                           if (grcs.length > 0) {
//                             childData = grcs;
//                             childItem = grcs[0];
//                           }
//                           break;
//                         }
//                         case 2: {
//                           if (divisions.length > 0) {
//                             childData = divisions;
//                             childItem = divisions[0];
//                           }
//                           break;
//                         }
//                         case 3: {
//                           if (partners.length > 0) {
//                             childData = partners;
//                             childItem = partners[0];
//                           }
//                           break;
//                         }
//                         default:
//                           break;
//                       }
//                       this.setState({chart3FieldType: item, chart3ChildTitle: item.name, chart3ChildData: childData, chart3ChildItem: childItem});
//                       this.getChart3(startDate, endDate, item.value, get(childItem, 'id', ''), chart3FrequencyType.value);
//                     }}
//                   />
//                 </View>
//                 <View style={{backgroundColor: '#f2f2f2', width: 1, marginLeft: 10}} />
//                   <View style={{flex: 1, justifyContent: 'center', marginLeft: 10 }}>
//                   <DropdownAutocomplete
//                       placeholder={'Choose ' + this.state.chart3ChildTitle}
//                       value={chart3ChildItem}
//                       data={chart3ChildData}
//                       onSelected={(item) => {
//                         this.setState({chart3ChildItem: item});
//                         this.getChart3(startDate, endDate, chart3FieldType.value, get(item, 'id', ''), chart3FrequencyType.value);
//                       }}
//                     />
//                 </View>
//               </View>
//             </View>

// chart4Sub1
// <Text style={[styles.textTitle, {marginTop: 10, marginBottom: 10}]}>Activity Count by Division/Partner</Text>
//             <View style={styles.contentChart} >
//               <View style={{flex: 1, alignItems: 'center'}}>  
//                 <Text style={{fontSize: 10, color: '#9d9d9d'}}>Activity (Counts)</Text>
//               </View>
//               {this.state.showChart4Sub1 ? (
//                 <View style={styles.containerChart}>
//                   <HorizontalBarChart
//                     style={styles.chart}
//                     data={this.state.dataATCL1.data}
//                     xAxis={this.state.dataATCL1.xAxis}
//                     legend={this.state.legend}
//                     marker={this.state.marker}
//                     scaleXEnabled={false}
//                     animation={{ durationX: 1000 }}
//                     chartDescription={{text: ""}}
//                   />
//                 </View>
//               ) : (
//                 <View style={styles.containerNoData}>
//                   <Text>No data</Text>
//                 </View>
//               )}
//               <View style={{backgroundColor: '#f2f2f2', height: 1}} />
//               <View style={styles.containerInfoChart}>
//                 <Image
//                   source={Images.timeIcon}
//                   style={styles.imageTime}
//                 />
//                 <Text style={{marginLeft: 5, fontSize: 12}}>{this.state.startDate + ' - ' + this.state.endDate}</Text>
//                 <View style={[styles.breakLine, {marginRight: 10}]} />
//                 <View style={{flex: 1, flexDirection: 'row'}}>
//                   <View style={{flex: 7, height: 30, justifyContent: 'center' }}>
//                     <DropdownWithoutBorder
//                       item={chart4Sub1FieldType}
//                       placeholder={'GRC'}
//                       dataSource={FIELD_TYPE}
//                       fieldShow={'name'}
//                       value={chart4Sub1FieldType.name}
//                       title={'Field Type'}
//                       fieldCompare={'name'}
//                       onSelected={(item) => {
//                         this.setState({chart4Sub1FieldType: item})
//                         this.getChart4Sub1(startDate, endDate, item.value);
//                       }}
//                     />
//                   </View>
//                   {this.state.showChart4Sub1 && (<View style={{flex: 3, flexDirection: 'row', height: 30, justifyContent: 'center'}}>
//                     <View style={styles.breakLine} />
//                     <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
//                       this.props.pushNav(RouteKey.ChartFullScreen, { showChart4Sub1: true, data: this.state.dataATCL1 })
//                     }}>
//                       <Image
//                         source={Images.fullScreenIcon}
//                         style={{width: 15, height: 15, marginRight: 10}}
//                       />
//                     </TouchableOpacity>
//                   </View>)}
//                 </View>
//               </View>
//             </View>

// chart4Sub2
// <Text style={[styles.textTitle, {marginTop: 10, marginBottom: 10}]}>Activity Count by specific Division/Partner</Text>
//             <View style={styles.contentChart} >
//               <View style={{flex: 1, alignItems: 'center'}}>  
//                 <Text style={{fontSize: 10, color: '#9d9d9d'}}>Activity (Counts)</Text>
//               </View>
//               {this.state.showChart4Sub2 ? (
//                 <View style={styles.containerChart}>
//                   <HorizontalBarChart
//                     style={styles.chart}
//                     data={this.state.dataATCL2.data}
//                     xAxis={this.state.dataATCL2.xAxis}
//                     legend={this.state.legend}
//                     marker={this.state.marker}
//                     scaleXEnabled={false}
//                     animation={{ durationX: 1000 }}
//                     chartDescription={{text: ""}}
//                   />
//                 </View>
//               ) : (
//                 <View style={styles.containerNoData}>
//                   <Text>No data</Text>
//                 </View>
//               )}
//               <View style={{backgroundColor: '#f2f2f2', height: 1}} />
//               <View style={styles.containerInfoChart}>
//                 <Image
//                   source={Images.timeIcon}
//                   style={styles.imageTime}
//                 />
//                 <Text style={{marginLeft: 5, fontSize: 12}}>{this.state.startDate + ' - ' + this.state.endDate}</Text>
//                 <View style={styles.breakLine} />
//                 {this.state.showChart4Sub2 && (
//                   <TouchableOpacity style={{flex: 1, alignItems: 'flex-end'}} onPress={() => {
//                     this.props.pushNav(RouteKey.ChartFullScreen, { showChart4Sub2: true, data: this.state.dataATCL2 })
//                   }}>
//                     <Image
//                       source={Images.fullScreenIcon}
//                       style={{width: 15, height: 15, marginRight: 10}}
//                     />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={{backgroundColor: '#f2f2f2', height: 1}} />
//               <View style={{flexDirection: 'row'}}>
//                 <View style={{width: 100, marginLeft: 10 }}>
//                 <DropdownWithoutBorder
//                   item={chart4Sub2FieldType}
//                   placeholder={'GRC'}
//                   dataSource={FIELD_TYPE}
//                   fieldShow={'name'}
//                   value={chart4Sub2FieldType.name}
//                   fieldCompare={'name'}
//                   title={'Field Type'}
//                   onSelected={(item) => {
//                     let childData = [];
//                     let childItem = {};
//                     switch (item.value) {
//                       case 1: {
//                         if (grcs.length > 0) {
//                           childData = grcs;
//                           childItem = grcs[0];
//                         }
//                         break;
//                       }
//                       case 2: {
//                         if (divisions.length > 0) {
//                           childData = divisions;
//                           childItem = divisions[0];
//                         }
//                         break;
//                       }
//                       case 3: {
//                         if (partners.length > 0) {
//                           childData = partners;
//                           childItem = partners[0];
//                         }
//                         break;
//                       }
//                       default:
//                         break;
//                     }
//                     this.setState({chart4Sub2FieldType: item, chart4Sub2ChildTitle: item.name, chart4Sub2ChildData: childData, chart4Sub2ChildItem: childItem});
//                     this.getChart4Sub2(startDate, endDate, item.value, get(childItem, 'id', ''));
//                   }}
//                 />
//               </View>
//               <View style={{backgroundColor: '#f2f2f2', width: 1, marginLeft: 10}} />
//               <View style={{flex: 1, justifyContent: 'center', marginLeft: 10 }}>
//                 <DropdownAutocomplete
//                   placeholder={'Choose ' + this.state.chart4Sub2ChildTitle}
//                   value={chart4Sub2ChildItem}
//                   data={chart4Sub2ChildData}
//                   onSelected={(item) => {
//                     this.setState({chart4Sub2ChildItem: item});
//                     this.getChart4Sub2(startDate, endDate, chart4Sub2FieldType.value, get(item, 'id', ''));
//                   }}
//                 />
//               </View>
//               </View>
//             </View>

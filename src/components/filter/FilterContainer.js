import React, {Component} from "react";
import {ScrollView, StyleSheet, View, TouchableOpacity, Text} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import FilterHeader from "./presenters/FilterHeader";
import FilterCollapsible from "./presenters/FilterCollapsible";
import {filterDataAction, getRequestsAction} from "../../actions/request";
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
var get = require('lodash.get');

const PROGRAMME_TYPE = "Programme Type";
const STATUS = "Status";
const DISTRICT = "District";
const GRC = "GRC";
const DIVISION = "Division";

class FilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      status: [],
      districts: [],
      grcs: [],
      divisions: [],

      isActFilterProgram: false,
      isActFilterStatus: false,
      isActFilterDistrict: false,
      isActFilterDivision: false,
      isActFilterGRC: false,
      
      search: ""
    };
  }

  componentDidMount() {
    let {lstFilterData, filterDataAction} = this.props;

    let lstPrograms = [];
    let lstDistricts = [];
    let lstGrcs = [];
    let lstDivisions = [];
    let lstStatus = [];

    let isActFilterProgram = false;
    let isActFilterDistrict = false;
    let isActFilterDivision = false;
    let isActFilterGRC = false;
    let isActFilterStatus = false;

    if (lstFilterData) {
      if (lstFilterData.programs) {
        lstPrograms = lstFilterData.programs,
        lstStatus = lstFilterData.status,
        lstDistricts = lstFilterData.districts,
        lstGrcs = lstFilterData.grcs,
        lstDivisions = lstFilterData.divisions,
        isActFilterProgram = lstFilterData.isActFilterProgram,
        isActFilterDistrict = lstFilterData.isActFilterDistrict,
        isActFilterDivision = lstFilterData.isActFilterDivision,
        isActFilterGRC = lstFilterData.isActFilterGRC,
        isActFilterStatus = lstFilterData.isActFilterStatus
      } else {
        lstPrograms = this.props.programTypes.map(program => {
          return {...program, selected: true};
        });

        lstDistricts = this.props.districts.map(district => {
          return {...district, selected: true};
        });

        lstGrcs = this.props.grcs.map(grc => {
          return {...grc, selected: true};
        });

        lstDivisions = this.props.divisions.map(division => {
          return {...division, selected: true};
        });

        lstStatus = this.props.status.map(st => {
          return {...st, selected: true};
        });

        lstFilterData = {
          programs: lstPrograms,
          districts: lstDistricts,
          grcs: lstGrcs,
          divisions: lstDivisions,
          status: lstStatus,
          isActFilterProgram: isActFilterProgram,
          isActFilterDistrict: isActFilterDistrict,
          isActFilterDivision: isActFilterDivision,
          isActFilterGRC: isActFilterGRC,
          isActFilterStatus: isActFilterStatus
        };
        filterDataAction(lstFilterData);
      }
      this.setState({
        programs: lstPrograms,
        districts: lstDistricts,
        grcs: lstGrcs,
        divisions: lstDivisions,
        status: lstStatus,
        isActFilterProgram: isActFilterProgram,
        isActFilterDistrict: isActFilterDistrict,
        isActFilterDivision: isActFilterDivision,
        isActFilterGRC: isActFilterGRC,
        isActFilterStatus: isActFilterStatus
      });
    }
  }

  isSelected = (type, item) => {
    switch (type) {
      case PROGRAMME_TYPE: {
        let columnsSetting = this.state.programs.map(program => {
          if (program.description == item.description) {
            program.selected = !program.selected;
          }
          return program;
        });
        this.setState({programs: columnsSetting});
        break;
      }
      case STATUS: {
        let columnsSetting = this.state.status.map(stt => {
          if (stt.nameStatus == item.nameStatus) {
            stt.selected = !stt.selected;
          }
          return stt;
        });
        this.setState({status: columnsSetting});
        break;
      }
      case DISTRICT: {
        let columnsSetting = this.state.districts.map(district => {
          if (district.name == item.name) {
            district.selected = !district.selected;
          }
          return district;
        });
        this.setState({districts: columnsSetting});
        break;
      }
      case GRC: {
        let columnsSetting = this.state.grcs.map(grc => {
          if (grc.name == item.name) {
            grc.selected = !grc.selected;
          }
          return grc;
        });
        this.setState({grcs: columnsSetting});
        break;
      }
      case DIVISION: {
        let columnsSetting = this.state.divisions.map(division => {
          if (division.name == item.name) {
            division.selected = !division.selected;
          }
          return division;
        });
        this.setState({divisions: columnsSetting});
        break;
      }
      default:
        break;
    }
  };

  getIdsForSearching = (data) => {
    let ids = []
    data.filter((item) => item.selected)
      .map((item, index) => {
        ids.push(item.id)
      })

    return ids
  }

  searchRequest = (state) => {

    // let grcIds = this.getIdsForSearching(get(state, 'grcs', []))
    // let districtsIds = this.getIdsForSearching(get(state, 'districts', []))
    // let programsIds = this.getIdsForSearching(get(state, 'programs', []))
    // let divsionsIds = this.getIdsForSearching(get(state, 'divisions', []))

    let status = []
    get(this.state, 'status', [])
      .filter(item => item.selected)
      .map((item) => {
        return status.push(item.type)
      })

    // let startDate = get(this.props, 'filterDateRange.startDate', '')
    // let endDate = get(this.props, 'filterDateRange.endDate', '')

    let isActFilterProgram = false;
    let isActFilterDistrict = false;
    let isActFilterDivision = false;
    let isActFilterGRC = false;
    let isActFilterStatus = false;

    this.state.programs.filter((item) => !item.selected)
      .map((item, index) => {
        isActFilterProgram = true;
      })

    this.state.districts.filter((item) => !item.selected)
      .map((item, index) => {
        isActFilterDistrict = true;
      })

    this.state.divisions.filter((item) => !item.selected)
      .map((item, index) => {
        isActFilterDivision = true;
      })

    this.state.grcs.filter((item) => !item.selected)
      .map((item, index) => {
        isActFilterGRC = true;
      })

    this.state.status.filter((item) => !item.selected)
      .map((item, index) => {
        isActFilterStatus = true;
      })

    let lstFilterData = {
      programs: this.state.programs,
      status: this.state.status,
      districts: this.state.districts,
      grcs: this.state.grcs,
      divisions: this.state.divisions,
      isActFilterProgram: isActFilterProgram,
      isActFilterDistrict: isActFilterDistrict,
      isActFilterDivision: isActFilterDivision,
      isActFilterGRC: isActFilterGRC,
      isActFilterStatus: isActFilterStatus
    };
    this.props.filterDataAction(lstFilterData);

    // this.props.getRequestsAction(isActFilterProgram ? programsIds : [],
    //   isActFilterGRC ? grcIds : [],
    //   isActFilterDistrict ? districtsIds : [],
    //   isActFilterDivision ? divsionsIds : [],
    //   isActFilterStatus ? status : [],
    //   startDate, endDate, searchDetail, 0, true)
  }

  onSearchFilter = (text, type) => {
    const {programs, status, districts, grcs, divisions} = this.state;
    const regex = new RegExp(`${text.trim()}`, 'i');
    if (text === '') {
      if (type == PROGRAMME_TYPE) {
        return programs;
      }
      if (type == STATUS) {
        return status;
      }
      if (type == DISTRICT) {
        return districts;
      }
      if (type == GRC) {
        return grcs;
      }
      if (type == DIVISION) {
        return divisions;
      }
    }

    if (type == PROGRAMME_TYPE) {
      return programs.filter(program => program.description.search(regex) >= 0);
    }
    if (type == STATUS) {
      return status.filter(st => st.nameStatus.search(regex) >= 0);
    }
    if (type == DISTRICT) {
      return districts.filter(district => district.name.search(regex) >= 0);
    }
    if (type == GRC) {
      return grcs.filter(grc => grc.name.search(regex) >= 0);
    }
    if (type == DIVISION) {
      return divisions.filter(division => division.name.search(regex) >= 0);
    }
  }

  onChangeSelectedWithType = (type, value) => {
    switch (type) {
      case PROGRAMME_TYPE: {
        let lstPrograms = this.state.programs.map(program => {
          return {...program, selected: value};
        });
        this.setState({programs: lstPrograms});
        break;
      }
      case STATUS: {
        let lstStatus = this.state.status.map(st => {
          return {...st, selected: value};
        });
        this.setState({status: lstStatus});
        break;
      }
      case DISTRICT: {
        let lstDistricts = this.state.districts.map(district => {
          return {...district, selected: value};
        });
        this.setState({districts: lstDistricts});
        break;
      }
      case GRC: {
        let lstGrcs = this.state.grcs.map(grc => {
          return {...grc, selected: value};
        });
        this.setState({grcs: lstGrcs});
        break;
      }
      case DIVISION: {
        let lstDivisions = this.state.divisions.map(division => {
          return {...division, selected: value};
        });
        this.setState({divisions: lstDivisions});
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {search} = this.state;

    const programs = this.onSearchFilter(search, PROGRAMME_TYPE);
    const districts = this.onSearchFilter(search, DISTRICT);
    const grcs = this.onSearchFilter(search, GRC);
    const divisions = this.onSearchFilter(search, DIVISION);
    const status = this.onSearchFilter(search, STATUS);

    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <FilterHeader
          title={"filter"}
          leftAction={() => {
            this.props.navigation.goBack();
          }}
          rightAction={() => {
            this.searchRequest(this.state)
            let value = '';

            const navParams = this.props.navigation.state.params
            if (navParams && get(navParams, 'dashboardstatus', '')) {
              value = get(navParams, 'dashboardstatus', '')
            }
            
            setTimeout(() => {
              this.props.navigation.state.params.onGoBack(value);
            this.props.navigation.goBack();
            }, 1000)
          }}
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={{marginTop: 10, marginBottom: 5}}>
              <TextInputWithoutTitle
                placeholder="Search Filter Item"
                value={search}
                changeText={text => {
                  this.setState({search: text})
                }}
              />


            </View>
            <FilterCollapsible
              title={PROGRAMME_TYPE}
              items={programs.length === 1 && comp(search, programs[0].description) ? [] : programs}
              isSelected={this.isSelected}
              onSelectedAll={this.onChangeSelectedWithType}
              onDeselectAll={this.onChangeSelectedWithType}
            />
            <View style={styles.breakLine} />
            <FilterCollapsible
              title={STATUS}
              items={status.length === 1 && comp(search, status[0].nameStatus) ? [] : status}
              isSelected={this.isSelected}
              onSelectedAll={this.onChangeSelectedWithType}
              onDeselectAll={this.onChangeSelectedWithType}
            />
            <View style={styles.breakLine} />
            <FilterCollapsible
              title={DISTRICT}
              items={districts.length === 1 && comp(search, districts[0].name) ? [] : districts}
              isSelected={this.isSelected}
              onSelectedAll={this.onChangeSelectedWithType}
              onDeselectAll={this.onChangeSelectedWithType}
            />
            <View style={styles.breakLine} />
            <FilterCollapsible
              title={GRC}
              items={grcs.length === 1 && comp(search, grcs[0].name) ? [] : grcs}
              isSelected={this.isSelected}
              onSelectedAll={this.onChangeSelectedWithType}
              onDeselectAll={this.onChangeSelectedWithType}
            />
            <View style={styles.breakLine} />
            <FilterCollapsible
              title={DIVISION}
              items={divisions.length === 1 && comp(search, divisions[0].name) ? [] : divisions}
              isSelected={this.isSelected}
              onSelectedAll={this.onChangeSelectedWithType}
              onDeselectAll={this.onChangeSelectedWithType}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    programTypes: state.app.programTypes,
    districts: state.app.districts,
    grcs: state.app.grcs,
    divisions: state.app.divisions,
    status: state.app.availableRequestStatus,
    lstFilterData: state.request.filterData,
    columns: state.request.columns,
    filterDateRange: state.request.filterDateRange,
    searchKey: state.request.searchKey
  }),
  dispatch =>
    bindActionCreators(
      {
        filterDataAction,
        getRequestsAction
      },
      dispatch
    )
)(FilterContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 10,
    marginBottom: 10
  },
  breakLine: {
    height: 1,
    backgroundColor: "rgba(180, 180, 180, 0.5)"
  }
});
import React, {Component} from "react";
import {
    View, FlatList, ScrollView, Text, Platform, StyleSheet, TouchableOpacity,
    TouchableHighlight,Alert
} from "react-native";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {from, of, Subject} from 'rxjs';
var get = require('lodash.get');

import {pushNav} from '../../actions/navigate';
import {Message} from "../../common/Message";
import AssignRequestHeader from './presenters/AssignRequestHeader';
import Autocomplete from 'react-native-autocomplete-input';
import {getTrainers, assignRequest, getFacilitator} from '../../services/requestService';
import Configure from '../../contants/configure';
import {RoleType} from '../../contants/profile-field';
import {FontNames} from "../../theme/fonts";
import {AppColors} from "../../theme/colors";
import {assignRequestForTrainerAction, getRequestsAction} from '../../actions/request';
import {getSkillSets} from '../../services/skillSetService';
import {isEmpty} from '../../utils/utils';
import {showMessage} from '../../common/Message';
import {RouteKey} from "../../contants/route-key";

class AssignRequestContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trainers: [],
            selectedTrainer: null,
            selectedTrainers: [],
            skillSets: [],
            isConfirm: false,
            isAssignFacilitator: false
        };
    }

    componentDidMount() {
        let requestId = get(this.props, "selectedRequests[0]", "")
        let data = get(this.props, "data", [])
        let currentRequest = data.find(item => item.id === requestId)
        let spId = get(currentRequest, 'spId', "")

        let isAssignFacilitator = false;
        const navParams = this.props.navigation.state.params
        if (navParams && get(navParams, 'isAssignFacilitator', '')) {
            isAssignFacilitator = get(navParams, 'isAssignFacilitator', '')
        }

        isAssignFacilitator ? spId && this.getFacilitator(spId) : spId && this.getTrainers(spId) 
        this.getSkillSets()
        this.setState({isAssignFacilitator: isAssignFacilitator})
    }

    getFacilitator = (id) => {
        console.log('ID--->', id)
        from(getFacilitator(id))
            .subscribe(res => {
                if (res.statusCode === 200) {
                    console.log('xxxxxx', res.data)
                    this.setState({trainers: get(res, "data", [])})
                }
            }, err => {}, () => {

            })
    }

    getTrainers = (id) => {
        console.log('ID--->', id)
        from(getTrainers(id))
            .subscribe(res => {
                if (res.statusCode === 200) {
                    console.log('xxxxxx', res.data)
                    this.setState({trainers: get(res, "data", [])})
                }
            }, err => {}, () => {

            })
    }

    getSkillSets = () => {
        from(getSkillSets())
            .subscribe(res => {
                if (res.statusCode === 200) {
                    this.setState({skillSets: get(res, "data.list", [])})
                }
            }, err => {}, () => {

            })
    }

    filterTrainer = (text) => {
        this.setState({selectedTrainer: null})
        let items = this.state.trainers
            .filter(item => item.name.indexOf(text) !== -1)
        this.setState({selectedTrainers: items})
    }

    renderRow = (label, value, key) => {
        return <View style={{flexDirection: 'row', marginTop: 5}} key={key}>
            <Text style={{
                width: 150,
                fontFamily: FontNames.RobotoBold,
                fontSize: 15, color: AppColors.grayTextColor
            }}>{label}</Text>
            <Text style={{
                flex: 1,
                fontFamily: FontNames.RobotoRegular,
                fontSize: 15, color: AppColors.grayTextColor
            }}>{value}</Text>
        </View>
    }

    assignTrainerAction = (trainerId, ids) => {
        console.log('assign', trainerId, ids)
        assignRequest(trainerId, ids).then((res) => {
            if (res.statusCode === 200) {
                Alert.alert('Alert', 'The request have been successfully assigned', [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ])
                this.getData(0, true)
                this.props.pushNav(RouteKey.ListRequest)
            } else {
                showMessage(get(res, "message", ""))
            }
        })
    }

    getIdsForSearching = (data) => {
        let ids = []
        data.filter((item) => item.selected)
            .map((item) => {
                ids.push(item.id)
            })

        return ids
    }

    getData = (page, showLoading) => {
        let searchDetail = []

        const navParams = this.props.navigation.state.params
        if (navParams && get(navParams, 'dashboardstatus', '')) {
            let value = get(navParams, 'dashboardstatus', '')
            value && searchDetail.push({key: 'dashboardstatus', value: value})
        }
        console.log('searchDetail', searchDetail)

        this.state.keyword && this.state.columns
            .filter(item => item.selected == true)
            .map(item => {
                return searchDetail.push({
                    key: item.value,
                    value: this.state.keyword
                })
            })

        //Filter data
        let grcIds = this.getIdsForSearching(get(this.props.filterData, 'grcs', []))
        let districtsIds = this.getIdsForSearching(get(this.props.filterData, 'districts', []))
        let programsIds = this.getIdsForSearching(get(this.props.filterData, 'programs', []))
        let divsionsIds = this.getIdsForSearching(get(this.props.filterData, 'divisions', []))

        let status = []
        get(this.props.filterData, 'status', [])
            .filter(item => item.selected)
            .map((item) => {
                return status.push(item.type)
            })

        let startDate = get(this.props, 'filterDateRange.startDate', '')
        let endDate = get(this.props, 'filterDateRange.endDate', '')

        let isActFilterProgram = get(this.props.filterData, "isActFilterProgram", false)
        let isActFilterDistrict = get(this.props.filterData, "isActFilterDistrict", false)
        let isActFilterDivision = get(this.props.filterData, "isActFilterDivision", false)
        let isActFilterGRC = get(this.props.filterData, "isActFilterGRC", false)
        let isActFilterStatus = get(this.props.filterData, "isActFilterStatus", false)

        this.props.getRequestsAction(
            isActFilterProgram ? programsIds : [],
            isActFilterGRC ? grcIds : [],
            isActFilterDistrict ? districtsIds : [],
            isActFilterDivision ? divsionsIds : [],
            isActFilterStatus ? status : [],
            startDate, endDate, searchDetail, page, showLoading
            );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    <AssignRequestHeader
                        title={"Assign Request"}
                        leftAction={() => {
                            this.props.navigation.goBack();
                        }}
                        rightAction={() => {

                        }}
                    />
                    <Message />
                    <View style={{
                        backgroundColor: 'white',
                        paddingTop: 15,
                        paddingLeft: 15, paddingRight: 15,
                    }}>
                        <Text style={{
                            fontFamily: FontNames.RobotoBold,
                            fontSize: 15, color: AppColors.grayTextColor
                        }}>{this.state.isAssignFacilitator ? 'Search Facilitator Name' : 'Search Trainer Name'}</Text>

                        <Autocomplete
                            containerStyle={{zIndex: 999}}
                            placeholder={this.state.isAssignFacilitator ? 'Input Facilitator Name' : 'Input Trainer Name'}
                            inputContainerStyle={{
                                paddingLeft: 5, paddingRight: 5,
                                height: Platform.OS == 'android' ? 45 : 50,
                                borderRadius: 5,
                                justifyContent: 'center',
                                marginTop: 15
                            }}
                            listStyle={{
                                marginLeft: 0, marginRight: 0,
                                position: 'relative',
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{}}
                            data={this.state.selectedTrainers}
                            hideResults={!isEmpty(this.state.selectedTrainer)}
                            onChangeText={text => {
                                this.filterTrainer(text);
                            }}
                            renderItem={(item) => {
                                return <View><TouchableOpacity style={{backgroundColor: 'white'}}
                                    onPress={() => {
                                        let skName = []
                                        this.state.skillSets.map(sk => {
                                            item.userSkillSets.map(skItem => {
                                                if (sk.id === skItem.id) return skName.push(sk.name)
                                            })
                                        })

                                        let obj = {...item, skillSets: skName}
                                        console.log('Trainer ---->', obj)
                                        this.setState({selectedTrainer: obj, isConfirm: true})
                                    }}>
                                    <Text style={{margin: 10, fontFamily: FontNames.RobotoRegular}}>{item.name}</Text>
                                </TouchableOpacity></View>
                            }}
                        />
                    </View>
                    {this.state.selectedTrainer && <View style={{paddingLeft: 15, paddingRight: 15, paddingTop: 15}}>
                        {this.renderRow('Name', get(this.state.selectedTrainer, 'name', ''), 1)}
                        {this.renderRow('User Name', get(this.state.selectedTrainer, 'userName', ''), 2)}
                        {this.renderRow('Email', get(this.state.selectedTrainer, 'email', ''))}
                        {this.renderRow('Number Phone', get(this.state.selectedTrainer, 'numberPhone', ''), 3)}
                        <Text style={{
                            fontFamily: FontNames.RobotoBold, fontSize: 15,
                            color: AppColors.blueTitle, marginTop: 20
                        }}>SKILL SET NAMES:</Text>
                        {
                            get(this.state.selectedTrainer, 'skillSets', []).map((item, index) => {
                                return <Text style={{
                                    flex: 1,
                                    fontFamily: FontNames.RobotoRegular,
                                    fontSize: 15, color: AppColors.grayTextColor, marginTop: 5
                                }} key={index}>{`- ${item}`}</Text>
                            })
                        }

                    </View>}

                </ScrollView>
                <TouchableOpacity
                    disabled={this.state.isConfirm}
                    activeOpacity={0.9}
                    style={{
                        height: 45,
                        backgroundColor: this.state.isConfirm ? AppColors.blueBackgroundColor : AppColors.grayBackground,
                        justifyContent: 'center', alignItems: 'center'
                    }}
                    onPress={() => {
                        if (this.state.isConfirm) {
                            this.assignTrainerAction(
                                get(this.state.selectedTrainer, 'id', ''),
                                this.props.selectedRequests)
                        }
                    }}>
                    <Text style={{
                        fontFamily: FontNames.RobotoBold,
                        fontSize: 16, color: AppColors.whiteTitle
                    }}>Confirm</Text>
                </TouchableOpacity>
            </View>

        );
    }
}

export default connect(state => ({
    selectedRequests: state.request.selectedRequests,
    userInfo: state.auth.userInfo,
    filterDateRange: state.request.filterDateRange,
    filterData: state.request.filterData,
    columns: state.request.columns,
    searchKey: state.request.searchKey,
    data: state.request.requests,
}),
    dispatch => (bindActionCreators({
        assignRequestForTrainerAction,
        getRequestsAction,
        pushNav
    }, dispatch))
)(AssignRequestContainer)
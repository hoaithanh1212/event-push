import React, {Component} from "react";
import {
    View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator
} from "react-native";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Swipeout from 'react-native-swipeout';
import {from, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
var get = require('lodash.get');

import {getTrainerAction} from '../../actions/user';
import NavigationBar from '../../common/NavigationBar';
import {Images} from "../../theme/images";
import {pushNav, resetNav} from '../../actions/navigate';
import {RouteKey} from "../../contants/route-key";
import {Message} from "../../common/Message";
import {RoleType} from '../../contants/profile-field';

class RequestDetailContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            rowId: null,
            rowIndex: null,

            page: 0,
            refreshing: false,

            showApproveModal: false,
            showRejectModal: false,

            selectedDistrict: {},
            selectedGRC: {},
            selectedDivision: {},
            selectedActivity: {}
        };
    }

    availablePrivilegeForSMAndHPM = [
        {
            text: 'Approve', type: 'primary',
            onPress: () => {
                this.setState({showApproveModal: true, showRejectModal: false})
            },
        },
        {
            text: 'Reject', type: 'delete',
            onPress: () => {
                this.setState({showRejectModal: true, showApproveModal: false})
            },
        },
        {
            text: 'Edit', type: 'secondary',
            onPress: function () {alert('Edit')},
        },
    ]

    availablePrivilegeForSP = this.availablePrivilegeForSMAndHPM.concat({
        text: 'Assign', type: 'default',
        onPress: function () {alert('Assign')},
    })

    configureSwipeOut = {
        right: [],
        disabled: true,
        autoClose: true,
        backgroundColor: 'white',
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: <NavigationBar {...navigation}
            title="Manage Request"
            leftAction={() => {
                navigation.goBack()
            }}
            rightAction={() => {navigation.push(RouteKey.CreateTrainer)}}
            rightIcon={Images.addIcon}
        />
        ,
        headerLeft: null
    })

    componentDidMount() {
        this.props.getTrainerAction('', '', '', 0, true)
        this.assignAvailablePrivilegeWithRole(RoleType.HPM)
    }

    assignAvailablePrivilegeWithRole = (role) => {
        switch (role) {
            case RoleType.SP: {
                this.configureSwipeOut.right = this.availablePrivilegeForSP
                break
            }
            case RoleType.SM:
            case RoleType.HPM: {
                this.configureSwipeOut.right = this.availablePrivilegeForSMAndHPM
                break
            }
            default: {
                this.configureSwipeOut.disabled = true
                break
            }
        }
    }

    keyExtractor = (item) => item.id;

    _onPressItem = () => {
    };

    onSwipeOpen = (rowIndex, rowId) => {
        console.log('ID', rowIndex, rowId)
        this.setState({
            rowId: rowId,
            rowIndex: rowIndex
        })
    }
    onSwipeClose = (rowIndex, rowId) => {
        console.log('ID', rowIndex, rowId)
        if (rowIndex === this.state.rowIndex) {
            this.setState({rowId: null, rowIndex: null});
        }
    }

    renderItem = ({item, index}) => {
        console.log('XXXXXX--->', this.state.rowIndex, this.state.rowIndex !== item.id)
        return <Swipeout
            close={this.state.rowIndex !== index}
            right={this.configureSwipeOut.right}
            rowID={item.id}
            autoClose={true}
            backgroundColor={this.configureSwipeOut.backgroundColor}
            onClose={() => console.log('===close')}
            scroll={() => console.log('scroll event')}
            onOpen={(sectionId, rowId, direction) => this.onSwipeOpen(index, rowId)}
            onClose={(sectionId, rowId, direction) => this.onSwipeClose(index, rowId)}
        >
            <TouchableOpacity
                style={{justifyContent: 'center', marginLeft: 10}}
                onPress={() => console.log('press children')}>
                <Text style={{marginTop: 5}}><Text style={{fontWeight: 'bold'}}>ActitivyId: </Text>{get(item, "name", "")}</Text>
                <Text style={{marginTop: 5}}><Text style={{fontWeight: 'bold'}}>District: </Text>{get(item, "phoneNumber", "")}</Text>
                <Text style={{marginTop: 5, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>GRC: </Text></Text>
                <Text style={{marginTop: 5, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>Division: </Text></Text>
                <Text style={{marginTop: 5, marginBottom: 5}}><Text style={{fontWeight: 'bold'}}>Actitivy Style: </Text></Text>
            </TouchableOpacity>
        </Swipeout>

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Message />
                
            </View>
        );
    }
}

export default connect(state => ({
}),
    dispatch => (bindActionCreators({
        getTrainerAction,
        pushNav,
    }, dispatch))
)(RequestDetailContainer)


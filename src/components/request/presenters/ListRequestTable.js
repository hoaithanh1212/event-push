import React, {Component} from "react";
import {
    View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator,
    ScrollView,
    StyleSheet, Switch,
    AppRegistry,
    Dimensions,
    TextInput
} from "react-native";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Swipeout from 'react-native-swipeout';
import {from, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
var get = require('lodash.get');
import {Row, Cell, Table, TableWrapper} from '../../../common/Table';
import {Images} from "../../../theme/images";
import {FontNames} from "../../../theme/fonts";
import {AppColors} from "../../../theme/colors";
import CircleButton from "../../../common/CircleButton";
import CheckBox from "../../../common/Checkbox";
import SearchInput from '../../../common/SearchInput';
import * as ProgramTypes from '../../../contants/program-types';

export const SeparateLine = () => {
    return <View style={{borderBottomWidth: 1, borderBottomColor: AppColors.separateRowLine}} />
}

export const AlertButton = (props) => {
    let {title, titleColor, action} = props
    return <TouchableOpacity activeOpacity={0.9} style={styles.btn}
        onPress={() => {
            action && action()
        }}>
        <Text style={[styles.titleBtn, {color: titleColor}]}>{title}</Text>
    </TouchableOpacity>
}

const Triangle = (props) => {
    let {style} = props
    return (
        <View style={[styles.triangle, style]} />
    )
}

const RowAlert = (props) => {
    let {style} = props
    return <View style={[styles.rowAlert, style]}>
        <Triangle style={{position: 'absolute', left: 0, top: 13}} />
        <View style={styles.alertGroupBtn}>
            <AlertButton title={'REJECT'} titleColor={AppColors.rejectTitle} />
            <AlertButton title={'APPROVE'} titleColor={AppColors.approveTitle} />
        </View >
    </View>
}

const Alert = (props) => {
    return <View style={styles.alert}>
        <Text style={styles.contentAlert}>4 Item Selected</Text>
        <View style={styles.groupAlertBtn}>
            <AlertButton title={'REJECT'} titleColor={AppColors.rejectTitle} />
            <AlertButton title={'APPROVE'} titleColor={AppColors.approveTitle} />
        </View>
    </View>
}

export default class ListRequestTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedRowId: '',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],

            selectedFilterBtn: false,
            selectedCheckAllBtn: false,
            selectedSettingBtn: false,

            columns: []

        }
    }

    componentDidMount() {
        let convertedColumns = ProgramTypes.CPAPWithAvailableFields ? ProgramTypes.CPAPWithAvailableFields.map(item => {
            return {...item, selected: true}
        }) : []
        this.setState({columns: convertedColumns})
    }


    renderTopHeader = () => {
        return <View style={styles.topHeaderContainer}>
            <Image
                style={{width: 20, height: 20}}
                source={Images.eyeIcon}
                resizeMode="contain"
            />
            <Text style={styles.dateRangeTxt}>Date Range</Text>
            <TouchableOpacity activeOpacity={0.9} style={{}}>
                <Text style={styles.setRangeTitle}>Set Range</Text>
            </TouchableOpacity>
        </View>
    }

    renderFilterHeader = () => {
        return <View style={styles.headerContainer}>
            <SearchInput />
            <View style={styles.groupCircleBtn}>
                <CircleButton normalIcon={Images.addIcon}
                    highlightIcon={Images.addIcon}
                    action={() => {
                        this.setState({
                            selectedFilterBtn: !this.state.selectedFilterBtn,
                            selectedCheckAllBtn: false, selectedSettingBtn: false,
                            selectedRowId: ''
                        })
                    }}
                    active={this.state.selectedFilterBtn}
                />
                <CircleButton normalIcon={Images.addIcon}
                    highlightIcon={Images.addIcon}
                    action={() => {
                        this.setState({
                            selectedCheckAllBtn: !this.state.selectedCheckAllBtn,
                            selectedFilterBtn: false,
                            selectedSettingBtn: false,
                            selectedRowId: ''
                        })
                    }}
                    active={this.state.selectedCheckAllBtn}
                />
                <CircleButton normalIcon={Images.addIcon}
                    highlightIcon={Images.addIcon}
                    action={() => {
                        this.setState({
                            selectedSettingBtn: !this.state.selectedSettingBtn,
                            selectedFilterBtn: false,
                            selectedCheckAllBtn: false,
                            selectedRowId: ''
                        })
                    }}
                    active={this.state.selectedSettingBtn}
                />
            </View>
        </View>
    }

    renderAlertButton = (title, titleColor, action) => {
        return <TouchableOpacity activeOpacity={0.9} style={styles.btn}
            onPress={() => {
                action && action()
            }}>
            <Text style={[styles.titleBtn, {color: titleColor}]}>{title}</Text>
        </TouchableOpacity>
    }

    renderTable = () => {
        return <Table>
            <TableWrapper>
                <Row style={{
                    height: 56,
                    flexDirection: 'row',

                }}>
                    <Cell width={50} style={{backgroundColor: AppColors.greyishBackground}}>
                        {
                            get(this.state, "selectedCheckAllBtn", false) && <CheckBox />
                        }
                    </Cell>
                    <Cell width={75} style={{backgroundColor: AppColors.greyishBackground}}>Activity ID</Cell>
                    <TableWrapper>
                        <ScrollView horizontal={true}
                            contentContainerStyle={{flexDirection: 'row'}}
                            showsHorizontalScrollIndicator={false}>
                            {this.state.columns.map((item,index) => {
                                return item.selected && <Cell key={index} width={150} style={{alignItems: 'flex-start', padding: 10}}>{item.label}</Cell>
                            })}

                        </ScrollView>
                    </TableWrapper>

                </Row>
                <SeparateLine />
            </TableWrapper >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexDirection: 'row'}}
                onScrollEndDrag={(e) => {
                }}
            >

                <TableWrapper style={{width: 125}}>
                    <FlatList
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return <Row key={index} style={{height: 56, backgroundColor: AppColors.greyishBackground}}>
                                <Cell width={50}>
                                    {
                                        get(this.state, "selectedCheckAllBtn", false) ? <CheckBox /> : <CircleButton normalIcon={Images.eyeIcon}
                                            highlightIcon={Images.eyeIcon} size={24}
                                            action={() => {this.setState({selectedRowId: index})}}
                                            active={this.state.selectedRowId === index}
                                        />
                                    }

                                </Cell>
                                <Cell width={75}>
                                    <Text style={{
                                        fontFamily: FontNames.RobotoMedium, fontSize: 13,
                                        color: AppColors.blueTextColor
                                    }}>{index}</Text>
                                </Cell>
                            </Row>

                        }} />
                </TableWrapper>
                <TableWrapper style={{flex: 1}}>
                    {console.log('SELECTED', this.state.selectedRowId)}
                    <ScrollView horizontal={true}>
                        <FlatList
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={SeparateLine}
                            data={this.state.data}
                            extraData={this.state}
                            removeClippedSubviews={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => {
                                return <Row style={{height: 56}} key={index}>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>1</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>2</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>3</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>4</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>5</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>6</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>7</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>8</Cell>
                                    <Cell width={100} style={{alignItems: 'flex-start', padding: 10}}>9</Cell>
                                    {

                                        this.state.selectedRowId === index && <RowAlert style={{position: 'absolute', left: -5, top: 0, bottom: 0, }} />
                                    }

                                </Row>
                            }} />
                    </ScrollView>
                </TableWrapper>
            </ScrollView>
        </Table >
    }

    pressCheckBoxInColumnSetting = (value) => {
        let columnsSetting = this.state.columns.map(item => {
            if (item.value == value) item.selected = !item.selected
            return item
        })

        this.setState({columns: columnsSetting})
    }

    renderColumnSetting = () => {
        return <View style={[styles.settingContainer, {
            display: get(this.state, "selectedSettingBtn", false) ? 'flex' : 'none',
        }]}>
            <Text style={styles.selectColumnTitileSetting}>Select Data you want to show:</Text>
            <FlatList
                style={{flex: 1, marginTop: 24, }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={this.state.columns}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                    return <View style={styles.rowSetting}>
                        <CheckBox
                            active={item.selected}
                            onPress={() => this.pressCheckBoxInColumnSetting(item.value)} />
                        <Text style={{
                            fontFamily: FontNames.RobotoRegular, fontSize: 16,
                            color: AppColors.black60TextColor, marginLeft: 12
                        }}>{item.label}</Text>
                    </View>

                }} />
        </View>
    }
    render() {
        return <View style={{flex: 1}}>
            <Alert />
            {this.renderTopHeader()}
            {this.renderFilterHeader()}
            <View style={{flex: 1}}>
                {this.renderTable()}
                {this.renderColumnSetting()}
            </View>

        </View>

    }
}

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 18,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: AppColors.confirmAlertBackground,
        transform: [
            {rotate: '-90deg'}
        ],
    },
    titleBtn: {fontFamily: FontNames.RobotoBold, fontSize: 12},
    btn: {
        width: 84, height: 32, borderRadius: 3,
        backgroundColor: AppColors.backgroundColor,
        alignItems: 'center', justifyContent: 'center',
    },
    rowAlert: {
        flexDirection: 'row', width: 228, justifyContent: 'flex-end',
        alignItems: 'center', position: 'absolute', left: -5, top: 0, bottom: 0
    },
    alertGroupBtn: {
        width: 210, flexDirection: 'row', backgroundColor: AppColors.confirmAlertBackground,
        justifyContent: 'space-between', paddingLeft: 22,
        paddingTop: 12, paddingBottom: 12,
        paddingRight: 12, borderRadius: 5,
        alignItems: 'center'
    },

    topHeaderContainer: {
        flexDirection: 'row', height: 52, alignItems: 'center',
        paddingLeft: 26, paddingRight: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.17)',
    },
    headerContainer: {
        height: 76, flexDirection: 'row',
        alignItems: 'center', paddingLeft: 12, paddingRight: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.17)',
    },
    groupCircleBtn: {
        flexDirection: 'row', width: 144,
        justifyContent: 'space-between',
        marginLeft: 5
    },
    setRangeTitle: {fontFamily: FontNames.RobotoRegular, fontSize: 16, color: AppColors.blueTextColor},
    dateRangeTxt: {flex: 1, marginLeft: 10, fontFamily: FontNames.RobotoRegular, color: AppColors.grayTextColor},
    btn: {
        width: 84, height: 32, borderRadius: 3,
        backgroundColor: AppColors.backgroundColor,
        alignItems: 'center', justifyContent: 'center',
    },
    titleBtn: {fontFamily: FontNames.RobotoBold, fontSize: 12},
    alert: {
        flexDirection: 'row', height: 60, backgroundColor: AppColors.blueBackgroundColor, alignItems: 'center',
        paddingLeft: 20, paddingRight: 20
    },
    contentAlert: {
        flex: 1, fontFamily: FontNames.RobotoRegular, fontSize: 13,
        color: AppColors.whiteTitle
    },
    groupAlertBtn: {width: 175, flexDirection: 'row', justifyContent: 'space-between'},

    header: {height: 50, backgroundColor: '#537791'},
    text: {textAlign: 'center', fontWeight: '100'},
    dataWrapper: {marginTop: -1},
    row: {height: 40, backgroundColor: '#E7E6E1'},
    settingContainer: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: AppColors.backgroundColor,
        paddingLeft: 24, paddingTop: 20
    },
    selectColumnTitileSetting: {fontFamily: FontNames.RobotoRegular, fontSize: 15, color: AppColors.blackTextColor},
    rowSetting: {flexDirection: 'row', height: 36, marginBottom: 16, alignItems: 'center'}
})
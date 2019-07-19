/**
 * Created by Hong HP on 2/22/19.
 */

import React from 'react';
import {View, StyleSheet, Platform, TouchableOpacity, Text, Image, ScrollView, FlatList, Alert} from 'react-native';
import {connect} from 'react-redux';
import DropdownInput from '../../common/DropdownInput';
import Autocomplete from 'react-native-autocomplete-input';
import {getPartnerNames, showLoading} from '../../actions/app';
import {FontNames} from '../../theme/fonts';
import {AppColors} from '../../theme/colors';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import {Images} from '../../theme/images';
import {RouteKey} from '../../contants/route-key';
import {getPartnerName, newUserPartner, searchPartner, editUserPartner} from '../../services/userService';
import {
  changePartner,
  deleteRequest,
  getPartnerNameOfPartner,
  getRequest,
  submitRequest
} from '../../services/requestService';
import ConfirmationModal from '../../common/ConfirmationModalComponent'
import {RoleType} from '../../contants/profile-field';
import AutoCompleteComponent from '../../common/AutoCompleteComponent';
import moment from 'moment';
import {ProgramTypes} from '../../contants/program-types';
import TextInputWithTitle from "../../common/TextInputWithTitle";
import * as validation from "../../utils/validation";

const DAILY = 'SINGLE SESSION'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const NUTRI_WORKSHOP = 'NutritionWorkshop'
const NUTRITION_COOKING = 'NutritionCooking'
const MITY = 'MITY'
const CPAP = 'CPAP'
const FIT = 'FITplus'

class CreateNewRequestScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      partnerName: '',
      hideResults: true,
      partner: '',
      users: [],
      pocDivision: '',
      listRequest: [],
      lisPOCName: [],
      listSearch: [],
      listPartner: [],
      hideResultPocName: true,
      showAlertDelete: false,
      deleteItemId: '',
      pocName: '',
      disableEdit: false,
      showUpdated: false,
      partnerNameId: '',
      isEditPOCName: false,
      newPOCName: '',
      newPOCMobile: '',
      newPOCEmail: '',
      newDID: '',
      pocNameErr: '',
      pocEmailErr: '',
      pocMobileErr: '',
    }
  }

  componentDidMount() {
    this.getRequest()
    console.log('UserInfo: ', this.props.userInfo)
    const {userInfo} = this.props
    if (userInfo.typeRole === RoleType.Partner) {
      this.getPartnerNameOfPartner()
      this.setState({
        partner: userInfo,
        pocName: userInfo.pocName,
        disableEdit: true
      })
    }
  }

  getRequest = () => {
    getRequest().then(res => {
      console.log('getRequest', res)
      if (res.statusCode == 200) {
        let userInfo = res.data.partnerInfo
        if (!!userInfo && !!userInfo.partnerNameId) {
          this.getPartnerName(userInfo.partnerNameId)
          this.setState({
            listRequest: res.data.results.list,
            partnerName: userInfo.partnerName,
            partner: {
              email: userInfo.pocEmail,
              pocName: userInfo.pocName,
              pocMobile: userInfo.pocMobile,
              id: userInfo.userPartnerId,
            },
            partnerNameId: userInfo.partnerNameId,
            pocName: userInfo.pocName,
            pocDivision: userInfo.division,
          })
        }
      }
    })
  }

  getPartnerName = (partnerNameId) => {
    getPartnerName(partnerNameId).then(res => {
      console.log('getPartnerName', res)
      if (res.statusCode == 200) {
        this.setState({lisPOCName: res.data})
      }
    })
  }

  deleteRequest = () => {
    const {deleteItemId} = this.state
    deleteRequest(deleteItemId).then(res => {
      if (res.statusCode == 200) {
        let listRequest = this.state.listRequest.filter(item => item.id !== deleteItemId)
        this.setState({listRequest: listRequest, showAlertDelete: false})
      }
    })
  }

  onItemPartnerSelected = (partner) => {
    this.getPartnerName(partner.id)
    const {userInfo} = this.props
    if (userInfo.typeRole === RoleType.Partner) {
      this.setState({
        hideResults: true,
        partnerName: partner.name,
        pocDivision: partner.divisionName,
        partnerNameId: partner.id
      })
    } else
      this.setState({
        hideResults: true,
        partnerName: partner.name,
        pocDivision: partner.divisionName,
        pocName: '',
        partnerNameId: partner.id
      })
  }

  searchPartner = (text) => {
    searchPartner(text).then(res => {
      if (res.statusCode === 200)
        this.setState({users: res.data.list})
    })
  }

  searchPocName = (text) => {
    if (!text) {
      this.setState({listSearch: this.state.lisPOCName, hideResultPocName: false, pocName: '', isEditPOCName: false})
    } else {
      if (!!this.state.lisPOCName && this.state.lisPOCName.length > 0) {
        let listSearch = this.state.lisPOCName.filter((item) => {
          if (item.pocName.toLowerCase().includes(text.toLowerCase())) {
            return item
          }
        })
        this.setState({listSearch: listSearch, hideResultPocName: listSearch.length == 0, pocName: text})
      } else {
        this.setState({pocName: text})
      }
    }
  }

  findPartners(text) {
    if (text === '') {
      this.setState({hideResults: false, partner: {}, partnerName: text, lisPOCName: [], pocName: '', isEditPOCName: false})
    } else {
      this.setState({hideResults: false, partnerName: text})
    }
    if (this.props.userInfo.typeRole === RoleType.Partner) {
      let filter = this.state.listPartner && this.state.listPartner.filter(item => item.name.toLowerCase().includes(text.toLowerCase()))
      this.setState({users: filter})
    } else {
      this.searchPartner(text)
    }

  }

  goToAddProgramme = () => {
    const {partner, partnerNameId} = this.state
    if (!!this.state.partner || !!partnerNameId) {
      this.props.navigation.navigate(RouteKey.AddProgrammeScreen, {
        partnerInfo: partner,
        partnerNameId: partnerNameId,
        getRequest: () => {
          this.getRequest()
        }
      })
    } else {
      alert('Please select partner info.')
    }
  }

  checkSubmitRequest = () => {
    const {userInfo} = this.props;
    let isDuplicate = false;
    this.state.listRequest.map(item => {
      if (item.isDuplicate) {
        isDuplicate = true;
      }
    })
    if (userInfo && userInfo.typeRole === RoleType.DataEntry || userInfo.typeRole === RoleType.SuperAdmin || userInfo.typeRole === RoleType.PM) {
      if (isDuplicate) {
        Alert.alert(
          'Warning',
          'You have duplicate request(s), do you really want to submit?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => {
              this.submitRequest()
            }},
          ],
          {cancelable: false},
        );
      } else {
        this.submitRequest();
      }
    } else {
      this.submitRequest();
    }
  }

  submitRequest = () => {
    this.props.showLoading(true);
    submitRequest().then(res => {
      this.props.showLoading(false);
      console.log('submitRequest', res)
      if (res.statusCode == 200) {
        Alert.alert('', 'Submit request successfully.')
        const {userInfo} = this.props
        if (userInfo.typeRole !== RoleType.Partner)
          this.setState({
            partner: '',
            listRequest: [],
            lisPOCName: [],
            partnerName: '',
            pocDivision: '',
            pocName: ''
          })
        else
          this.setState({
            listRequest: [],
          })
      }
    })
  }

  goToUpdateRequest = (data) => {
    this.props.navigation.navigate(RouteKey.UpdateProgammeScreen, {
      requestData: data, getRequest: () => {
        this.getRequest()
      }
    })
  }

  changePartner = (id) => {
    changePartner(id).then((res) => {
      if (res.statusCode === 200) {
        this.setState({showUpdated: true})
        setTimeout(() => {
          this.setState({showUpdated: false})
        }, 5000)
      }
      console.log('changePartner', res)
    })
  }

  getPartnerNameOfPartner = () => {
    getPartnerNameOfPartner().then(data => {
      console.log('getPartnerNameOfPartner: ', data)
      this.setState({
        users: data.data,
        listPartner: data.data
      })
    })
  }

  onUpdatePOCInfo = () => {
    let data = {
      pocName: this.state.newPOCName,
      pocEmail: this.state.newPOCEmail,
      pocMobile: this.state.newPOCMobile,
      did: !!this.state.newDID ? this.state.newDID : '',
      partnerNameId: this.state.partner && this.state.partner.pocName ? '' : this.state.partnerNameId
    }

    let error = false;
    if (!this.state.newPOCName) {
      this.setState({ pocNameErr: "POC Name is empty" });
      error = true;
    } else {
      this.setState({ pocNameErr: "" });
    }

    if (!this.state.newPOCEmail) {
      this.setState({ pocEmailErr: "Email is empty" });
      error = true;
    } else {
      this.setState({ pocEmailErr: "" });
    }

    if (!validation.validateEmail(this.state.newPOCEmail)) {
      this.setState({ pocEmailErr: "Email is invalid" });
      error = true;
    } else {
      this.setState({ pocEmailErr: "" });
    }

    if (!this.state.newPOCMobile) {
      this.setState({ pocMobileErr: "POC Name is empty" });
      error = true;
    } else {
      this.setState({ pocMobileErr: "" });
    }

    if (!error) {
      this.props.showLoading(true);
      if (this.state.partner && this.state.partner.pocName) {
        editUserPartner(data, this.state.partner && this.state.partner.id).then(res => {
          this.props.showLoading(false);
          if (res.statusCode == 200) {
            this.setState({
              partner: {
                ...this.state.partner,
                pocMobile: this.state.newPOCMobile,
                email: this.state.newPOCEmail,
                did: this.state.newDID
              }
            })
            if (this.state.listSearch && this.state.listSearch.length > 0) {
              let newListSearch = this.state.listSearch;
              for (var i in newListSearch) {
                if (newListSearch[i].id == this.state.partner.id) {
                  newListSearch[i].pocName = this.state.newPOCName;
                  newListSearch[i].email = this.state.newPOCEmail;
                  newListSearch[i].pocMobile = this.state.newPOCMobile;
                  newListSearch[i].did = this.state.newDID;
                  break;
                }
              }
              this.setState({listSearch: newListSearch})
            }
            this.setState({isEditPOCName: false, pocName: this.state.newPOCName})
          } else {
            alert(res.message)
          }
        })
      } else {
        newUserPartner(data).then(res => {
          this.props.showLoading(false);
          if (res.statusCode == 200) {
            this.getPartnerName(this.state.partnerNameId);
            this.setState({isEditPOCName: false, pocName: '', partner: {}})
            alert('Create new POC Name successfully')
          } else {
            alert(res.message)
          }
        })
      }
    }
  }

  render() {
    const {userInfo} = this.props;
    const {partner, partnerName, showUpdated, users, pocDivision, listRequest, pocName, listSearch, hideResultPocName, disableEdit} = this.state
    return <View style={{flex: 1}}>
      <ScrollView style={styles.container}
                  bounces={false}
      >
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.title, {flex: 1}]}>Organisation Info</Text>
          {showUpdated && <Text style={{color: '#7ed321', fontSize: 12}}>Updated</Text>}
        </View>
        <View style={{height: 100}}/>
        <AutoCompleteComponent
          style={{zIndex: 999, position: 'absolute', top: 25}}
          value={partnerName}
          placeholder='Organisation Name'
          data={users}
          onChangeText={text => {
            this.findPartners(text);
          }}
          hideResults={this.state.hideResults}
          renderItem={({item, index}) => {
            return <TouchableOpacity
              onPress={() => {
                this.onItemPartnerSelected(item)
                this.setState({listPartner: [], partner: {}, hideResultPocName: true, isEditPOCName: false})
              }}>
              <Text style={{margin: 10}}>{item.name}</Text>
            </TouchableOpacity>
          }}
        />

        <AutoCompleteComponent
          style={{zIndex: 99, position: 'absolute', top: 80}}
          value={pocName}
          placeholder='POC Name'
          data={listSearch}
          editable={!disableEdit}
          onChangeText={text => {
            this.searchPocName(text);
          }}
          hideResults={hideResultPocName}
          renderItem={({item, index}) => {
            return <TouchableOpacity
              onPress={() => {
                if (!!partner) {
                  this.changePartner(item.id)
                }
                this.setState({partner: item, hideResultPocName: true, pocName: item.pocName, isEditPOCName: false})
              }}>
              <Text style={{margin: 10}}>{!!item ? item.pocName : ''}</Text>
            </TouchableOpacity>
          }}
        />
        {
          !!this.state.partnerNameId && userInfo && userInfo.typeRole !== RoleType.Partner && <View style={{marginTop: 20, alignItems: 'flex-end'}}><TouchableOpacity 
            onPress={() => {
              if (this.state.isEditPOCName) {
                this.onUpdatePOCInfo();
              } else {
                this.setState({
                  isEditPOCName: true,
                  newPOCName: this.state.pocName,
                  newPOCEmail: partner.email,
                  newPOCMobile: partner.pocMobile,
                  newDID: partner.did})
              }
            }}
            style={{
              width: 150,
              height: 30,
              alignItems: 'flex-end'
            }}
          >
            <Text style={{color: AppColors.blueBackgroundColor, fontSize: 14, fontFamily: FontNames.RobotoMedium}}>{this.state.isEditPOCName ? "Save" : this.state.partner && this.state.partner.pocName ? "Edit POC Name" : "Create POC Name"}</Text>
          </TouchableOpacity></View>
        }
        {
          this.state.isEditPOCName && <View style={{marginTop: 5}}>
            <TextInputWithTitle
              placeholder="New POC Name"
              title="New POC Name"
              changeText={value => {
                this.setState({newPOCName: value})
              }}
              value={this.state.newPOCName}
              message={this.state.pocNameErr}
            />
          </View>
        }
        {
          this.state.isEditPOCName && <View style={{marginTop: 5}}>
            <TextInputWithTitle
              placeholder="New POC Mobile"
              title="New POC Mobile"
              changeText={value => {
                this.setState({newPOCMobile: value})
              }}
              value={this.state.newPOCMobile}
              message={this.state.pocMobileErr}
            />
          </View>
        }
        {
          this.state.isEditPOCName && <View style={{marginTop: 5}}>
            <TextInputWithTitle
              placeholder="New POC Email"
              title="New POC Email"
              changeText={value => {
                this.setState({newPOCEmail: value})
              }}
              value={this.state.newPOCEmail}
              message={this.state.pocEmailErr}
            />
          </View>
        }
        {
          this.state.isEditPOCName && <View style={{marginTop: 5}}>
            <TextInputWithTitle
              placeholder="New DID"
              title="New DID"
              changeText={value => {
                if (value.length < 9)
                  this.setState({newDID: value})
              }}
              keyboardType="numeric"
              value={this.state.newDID}
            />
          </View>
        }
        <View styke={{marginVertical: 40, backgroundColor: 'red'}}>
          {
            !this.state.isEditPOCName && <TextInputHeaderTitle
              title={'POC MOBILE'}
              inputStyle={styles.textStyle}
              value={partner.pocMobile}
            />
          }
          {
            !this.state.isEditPOCName && <TextInputHeaderTitle
              title={'POC EMAIL'}
              inputStyle={styles.textStyle}
              value={partner.email}
            />
          }
          <TextInputHeaderTitle
            title={'POC DIVISION'}
            inputStyle={styles.textStyle}
            value={pocDivision}
          />
          {
            !this.state.isEditPOCName && <TextInputHeaderTitle
              title={'DID'}
              inputStyle={styles.textStyle}
              value={partner.did}
            />
          }
          <Text style={[styles.title, {marginTop: 40}]}>PROGRAMME SELECTION</Text>
        </View>
        <FlatList
          data={listRequest}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => <ProgrammeItem data={item}
                                                        deleteRequest={(deleteItemId) => this.setState({
                                                          deleteItemId,
                                                          showAlertDelete: true
                                                        })}
                                                        updateRequest={this.goToUpdateRequest}
                                                        userInfo={this.props.userInfo}
          />}
        />
        <TouchableOpacity style={styles.button}
                          onPress={() => {
                            this.goToAddProgramme()
                          }}
        >
          <Text style={{flex: 1}}>Add Programme</Text>
          <Image source={Images.addIcon} style={{width: 24, height: 24}}/>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={{
        backgroundColor: this.state.isEditPOCName ? AppColors.blueBackgroundColor : !!listRequest && listRequest.length > 0 ? AppColors.blueBackgroundColor : AppColors.gray2Background,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center'
      }}
                        onPress={() => {
                          this.state.isEditPOCName ? this.onUpdatePOCInfo() : this.checkSubmitRequest()
                        }}
                        disabled={this.state.isEditPOCName ? false : !(listRequest && listRequest.length > 0)}>
        <Text style={{color: '#fff', fontSize: 14, fontFamily: FontNames.RobotoMedium}}>{this.state.isEditPOCName ? "SAVE" : "SUBMIT"}</Text>
      </TouchableOpacity>
      <ConfirmationModal
        message={'Are your sure to delete this item?'}
        confirmAction={this.deleteRequest}
        cancelAction={() => this.setState({showAlertDelete: false})}
        show={this.state.showAlertDelete}
      />
    </View>
  }
}

class ProgrammeItem extends React.PureComponent {
  constructor() {
    super()
  }

  renderPreferredDomain = () => {
    const {data} = this.props
    return <View>
      <TextInputHeaderTitle
        title={'PREFERRED DOMAIN B'}
        inputStyle={styles.textStyle}
        value={data.preferredDomainBName}
      />
      <TextInputHeaderTitle
        title={'PREFERRED DOMAIN A OR C'}
        inputStyle={styles.textStyle}
        value={data.preferredDomainAorCName}
      />
    </View>
  }

  renderTypeNutriWorkshop = () => {
    const {data} = this.props
    return <View>
      <Text>1st Session</Text>
      <TextInputHeaderTitle
        title={'DATE'}
        inputStyle={styles.textStyle}
        value={data.startDate}
      />
      <TextInputHeaderTitle
        title={'START TIME'}
        inputStyle={styles.textStyle}
        value={data.startTime}
      />
      <TextInputHeaderTitle
        title={'ACTIVITY'}
        inputStyle={styles.textStyle}
        value={data.activityName}
      />
      <Text>2nd Session</Text>
      <TextInputHeaderTitle
        title={'DATE'}
        inputStyle={styles.textStyle}
        value={data.startDate2}
      />
      <TextInputHeaderTitle
        title={'START TIME'}
        inputStyle={styles.textStyle}
        value={data.startTime2}
      />
      <TextInputHeaderTitle
        title={'ACTIVITY'}
        inputStyle={styles.textStyle}
        value={data.activity2Name}
      />
      <Text>3rd Session</Text>
      <TextInputHeaderTitle
        title={'DATE'}
        inputStyle={styles.textStyle}
        value={data.startDate3}
      />
      <TextInputHeaderTitle
        title={'START TIME'}
        inputStyle={styles.textStyle}
        value={data.startTime2}
      />
    </View>
  }

  renderRecipe = () => {
    const {data} = this.props
    return <View>
      {data.recipe1Name && <TextInputHeaderTitle
        title={'RECIPE 1'}
        inputStyle={styles.textStyle}
        value={data.recipe1Name}
      />}
      {data.recipe2Name && <TextInputHeaderTitle
        title={'RECIPE 2'}
        inputStyle={styles.textStyle}
        value={data.recipe2Name}
      />}
    </View>
  }

  render() {
    const {data, deleteRequest, updateRequest, userInfo} = this.props;
    let checkDuplicate = false;
    if (userInfo && userInfo.typeRole === RoleType.Partner || userInfo.typeRole === RoleType.SM || userInfo.typeRole === RoleType.HPM) {
      if (data.isDuplicate) {
        checkDuplicate = true
      }
    }
    return <View style={[styles.itemContainer, {borderColor: checkDuplicate ? '#e04949' : AppColors.grayTextColor}]}>
      <View style={styles.actionWrapper}>
        {checkDuplicate && <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <Image source={Images.infoIcon} style={[styles.styleIcon, {tintColor: '#e04949'}]} resizeMode={'contain'}/>
          <Text style={{flex: 1, color: '#b00020', marginLeft: 5}}>Duplicated Programme!</Text>
        </View>}
        <TouchableOpacity style={{marginRight: 12}} onPress={() => {
          deleteRequest(data.id)
        }}>
          <Image source={Images.deleteIcon} style={[styles.styleIcon, {tintColor: '#e04949'}]} resizeMode={'contain'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          updateRequest(data)
        }}>
          <Image source={Images.editOutlineIcon} style={[styles.styleIcon, {tintColor: '#128ff9'}]}
                 resizeMode={'contain'}/>
        </TouchableOpacity>
      </View>
      <TextInputHeaderTitle
        title={'PROGRAMME TYPE'}
        inputStyle={styles.textStyle}
        value={data.programName}
      />
      {data.programType === NUTRI_WORKSHOP && this.renderTypeNutriWorkshop()}
      {data.programType !== NUTRI_WORKSHOP && data.programType !== NUTRITION_COOKING &&
      data.programType !== MITY && data.programType !== ProgramTypes.SupermarketTour &&
      data.programType !== ProgramTypes.FITplus &&
      <TextInputHeaderTitle
        title={'ACTIVITY'}
        inputStyle={styles.textStyle}
        value={data.activityName}
      />}
      {data.programType === MITY && this.renderPreferredDomain()}
      {this.renderRecipe()}
      <TextInputHeaderTitle
        title={'VENUE POSTAL CODE'}
        inputStyle={styles.textStyle}
        value={data.venuePostalCode}
      />
      <TextInputHeaderTitle
        title={'VENUE DESCRIPTION'}
        inputStyle={styles.textStyle}
        value={data.venue}
      />
      {data.programType !== NUTRI_WORKSHOP && <TextInputHeaderTitle
        title={'START TIME'}
        inputStyle={styles.textStyle}
        value={data.startTime}
      />}
      {data.programType !== NUTRI_WORKSHOP && <TextInputHeaderTitle
        title={data.repeatType == 3 ? 'START MONTH' : 'START DATE'}
        inputStyle={styles.textStyle}
        value={data.repeatType == 3 ? moment(data.startDate, 'DD/MM/YYYY').format('MM/YYYY') : data.startDate}
      />}
      {data.programType !== NUTRI_WORKSHOP && data.programType !== MITY && data.programType !== FIT &&
      <View>
        <TextInputHeaderTitle
          title={'REPEAT'}
          inputStyle={styles.textStyle}
          value={data.repeatType == 1 ? DAILY : data.repeatType == 2 ? WEEKLY : MONTHLY}
        />
        {data.repeatType !== 1 && <TextInputHeaderTitle
          title={data.repeatType == 3 ? 'END MONTH' : 'END DATE'}
          inputStyle={styles.textStyle}
          value={data.repeatType == 3 ? moment(data.endDate, 'DD/MM/YYYY').format('MM/YYYY') : data.endDate}
        />}
      </View>
      }
      <TextInputHeaderTitle
        title={'EXPECTED ATTENDANCE'}
        inputStyle={styles.textStyle}
        value={data.expectedAttendance}
      />
      {!!data.remarks && <TextInputHeaderTitle
        title={'REMARKS'}
        inputStyle={styles.textStyle}
        value={data.remarks}
      />}
      {!!data.renewCpapText && <TextInputHeaderTitle
        title={'ROW NUMBER REFERENCE ID'}
        inputStyle={styles.textStyle}
        value={data.renewCpapText}
      />}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  autocompleteContainer: {
    flex: 1,
    borderRadius: 5,
  },
  title: {
    color: AppColors.registerTitleColor,
    fontSize: 12,
    fontFamily: FontNames.RobotoBold,
    marginBottom: 5
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 40,
  },
  textStyle: {
    textAlign: 'right',
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: AppColors.black60
  },
  styleIcon: {
    width: 24,
    height: 24
  },
  actionWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  itemContainer: {
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12
  }
})

export default connect(state => ({
  partners: state.app.partners,
  userInfo: state.auth.userInfo
}), dispatch => ({
  getPartnerNames: (keyword) => dispatch(getPartnerNames(keyword)),
  showLoading: visible => dispatch(showLoading(visible)),
}))(CreateNewRequestScreen)
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
  Keyboard,
  Image
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputWithoutTitle from "../../common/TextInputWithoutTitle";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import { AppColors } from "../../theme/colors";
import { FontNames } from "../../theme/fonts";
import NavigationBar from "../../common/NavigationBar";
import { registerPartnerAction } from "../../actions/auth";
import { Message } from "../../common/Message";
import { showLoading } from "../../actions/app";
import { register } from "../../services/authService";
import { getPartnerNames } from "../../services/appService";
import { pushNav, resetNav } from "../../actions/navigate";
import { RouteKey } from "../../contants/route-key";
import AutoCompleteComponent from '../../common/AutoCompleteComponent';
import {Images} from '../../theme/images';

import * as validation from "../../utils/validation";

var get = require("lodash.get");

class RegisterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pocName: "",
      pocEmail: "",
      pocMobile: "",
      did: "",
      password: "",
      rePassword: "",
      
      userNameErr: "",
      pocNameErr: "",
      pocEmailErr: "",
      pocMobileErr: "",
      didErr: "",
      passwordErr: "",
      rePasswordErr: "",
      partners: [],
      listPartner: [],
      countPartner: 0
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <NavigationBar
        {...navigation}
        title="Partner Registration"
        leftAction={() => {
          navigation.goBack();
        }}
      />
    ),
    headerLeft: null
  });

  searchPartner = (value) => {
    getPartnerNames(value).then(
      response => {
        if (response.statusCode === 200) {
          this.setState({partners: response.data.list})
        }
      }
    );
  }

  addItemToPartners() {
    let count = this.state.countPartner + 1;
    let obj = {
      partnerId: count,
      partnerName: "",
      hideResults: true,
      partner: {}
    }
    let partners = this.state.listPartner;
    partners.push(obj)
    this.setState({listPartner: partners, countPartner: count})
  }

  removeItemInPartners(partner) {
    let newPartners = this.state.listPartner.filter(item => item.partnerId != partner.partnerId);
    this.setState({listPartner: newPartners});
  }
  
  validateInfo() {
    let data = this.state;

    if (!data.userName) {
      this.setState({ userNameErr: "UserName is empty" });
    } else {
      this.setState({ userName: data.userName, userNameErr: "" });
    }

    if (!data.password) {
      this.setState({ passwordErr: "Password is empty" });
    // } else if (!validation.validatePassword(data.password)) {
    //   this.setState({ passwordErr: "Password is invalid" });
    } else {
      this.setState({ password: data.password, passwordErr: "" });
    }

    if (!data.rePassword) {
      this.setState({ rePasswordErr: "Re-Password is empty" });
    // } else if (!validation.validatePassword(data.rePassword)) {
    //   this.setState({ rePasswordErr: "Re-Password is invalid" });
    } else if (data.rePassword !== data.password) {
      this.setState({
        rePasswordErr: "Re-password doesn't match with Password"
      });
    } else {
      this.setState({ rePassword: data.rePassword, rePasswordErr: "" });
    }

    if (!data.pocName) {
      this.setState({ pocNameErr: "Name is empty" });
    } else {
      this.setState({ pocName: data.pocName, pocNameErr: "" });
    }

    if (!data.pocEmail) {
      this.setState({ pocEmailErr: "Email is empty" });
    } else if (!validation.validateEmail(data.pocEmail)) {
      this.setState({ pocEmailErr: "Email is invalid" });
    } else {
      this.setState({ pocEmail: data.pocEmail, pocEmailErr: "" });
    }

    if (!data.pocMobile) {
      this.setState({ pocMobileErr: "Mobile is empty" });
    } else {
      this.setState({ pocMobile: data.pocMobile, pocMobileErr: "" });
    }

    if (!data.did) {
      this.setState({ didErr: "DID is empty" });
    } else {
      this.setState({ did: data.did, didErr: "" });
    }

    if (data.listPartner.length === 0) {
      alert("Please add a partner");
    } else {
      data.listPartner.map(item => {
        if (!item.partner.id) {
          alert(
            "District, GRC and Division obtained by Partner name. Please input Partner name and selected once"
          );
          return;
        }
      })
    }

    if (
      data.userNameErr === "" &&
      data.passwordErr === "" &&
      data.rePasswordErr === "" &&
      data.pocNameErr === "" &&
      data.pocEmailErr === "" &&
      data.pocMobileErr === "" &&
      data.didErr === ""
    ) {
      return true;
    }
    return false;
  }

  onRegister() {
    Keyboard.dismiss();
    if (this.validateInfo()) {
      let data = this.state;
      let grcsId = [];
      let divisionsId = [];
      let districtsId = [];
      let partnerNameId = [];

      data.listPartner.map((item) => {
        grcsId.push(item.partner.grcId);
        divisionsId.push(item.partner.divisionId);
        districtsId.push(item.partner.districtId);
        partnerNameId.push(item.partner.id);
      })

      let model = {
        userName: data.userName,
        pocName: data.pocName,
        pocEmail: data.pocEmail,
        pocMobile: data.pocMobile,
        did: data.did,
        password: data.password,
        grcsId: grcsId,
        divisionsId: divisionsId,
        districtsId: districtsId,
        partnerNameId: partnerNameId
      };
      console.log("model register", model);
      this.props.showLoading(true);
      register(model).then(response => {
        this.props.showLoading(false);
        if (response.statusCode === 200) {
          Alert.alert(
            "Register successfully",
            "Thank you for your application. We will inform you shortly via email when your account has been activated."
          );
          this.props.resetNav(RouteKey.Login);
        } else {
          Alert.alert("Warning", get(response, "message", ""));
        }
      });
    }
  }

  renderPartner = () => {
    const {partners} = this.state;
    let {listPartner} = this.state;
    let partnerView = listPartner && listPartner.length > 0 && listPartner.map((partner, index) => {
      return <View key={index} style={styles.groupPartner}>
        <TouchableOpacity
          style={{alignItems: 'flex-end', marginBottom: 10}}
          onPress={() => {
            this.removeItemInPartners(partner);
          }}>
          <Text style={{color: 'red'}}>DELETE</Text>
        </TouchableOpacity>
        <AutoCompleteComponent
          editable={true}
          hideResults={partner.hideResults}
          placeholder={'Search a partner name'}
          data={partners}
          value={partner.partnerName}
          onChangeText={text => {
            let iHideResults = true;
            let iPartner = {};
            if (text === "") {
              iHideResults = false
              iPartner = {}
            } else {
              iHideResults = false
            }
            let newPartners = listPartner;
            for (var i in newPartners) {
              if (newPartners[i].partnerId == partner.partnerId) {
                newPartners[i].partnerName = text;
                newPartners[i].hideResults = iHideResults;
                newPartners[i].partner = iPartner;
                 break;
              }
            }
            this.setState({listPartner: newPartners});
            this.searchPartner(text);
          }}
          renderItem={(item) => {
            return <TouchableOpacity
                    style={{backgroundColor: 'white'}}
                    onPress={() => {
                      let realPartners = []
                      this.state.listPartner.map(item => {
                        if (item.partner && item.partner.id) {
                          realPartners.push(item);
                        }
                      })
                      let isAdd = true;
                      if (realPartners && realPartners.length > 0) {
                        realPartners.map(itemSelected => {
                          if (item.item.id === itemSelected.partner.id) {
                            isAdd = false;
                          }
                        })
                      }
                      if (isAdd) {
                        let newPartners = listPartner
                        for (var i in newPartners) {
                          if (newPartners[i].partnerId == partner.partnerId) {
                            newPartners[i].partnerName = item.item.name;
                            newPartners[i].hideResults = true;
                            newPartners[i].partner = item.item;
                            break;
                          }
                        }
                        this.setState({listPartner: newPartners});
                      } else {
                        alert('Partner already exists');
                      }
                    }}>
              <Text style={{margin: 10, fontFamily: FontNames.RobotoRegular}}>{item.item && item.item.name}</Text>
            </TouchableOpacity>
          }}
        />
        <View style={{ marginTop: 10 }}>
          <TextInputWithTitle
            editable={false}
            title="District"
            placeholder={
              partner.partner && partner.partner.districtName
            }
          />
          <TextInputWithTitle
            editable={false}
            title="GRC"
            placeholder={partner.partner && partner.partner.grcName}
          />
          <TextInputWithTitle
            editable={false}
            title="Division"
            placeholder={
              partner.partner && partner.partner.divisionName
            }
          />
        </View>
      </View>
    })
    return (
      <View>
        {partnerView}
      </View>
    )
  }

  render() {
    console.log('list partners', this.state.listPartner);
    return (
      <View style={{ flex: 1 }}>
        <Message />
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.group}>
            <Text
              style={{
                color: AppColors.blackTextColor,
                fontSize: 12,
                fontFamily: FontNames.RobotoBold,
                marginTop: 15,
                marginBottom: 5
              }}
            >
              Please complete the form to register
            </Text>
            <Text style={styles.title}>ACCOUNT INFO (FOR SIGNING IN)</Text>
            <TextInputWithoutTitle
              placeholder="Username"
              message={this.state.userNameErr}
              changeText={value => {
                this.setState({ userName: value });
              }}
            />
            <TextInputWithoutTitle
              placeholder="Password"
              secureTextEntry={true}
              message={this.state.passwordErr}
              changeText={value => {
                this.setState({ password: value });
              }}
            />
            <Text style={styles.note}>
              Password must contain at least 8 characters, one Special
              character, one Uppercase Character
            </Text>
            <TextInputWithoutTitle
              placeholder="Re-type Password"
              message={this.state.rePasswordErr}
              secureTextEntry={true}
              changeText={value => {
                this.setState({ rePassword: value });
              }}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.title}>PERSONAL INFO</Text>
            <TextInputWithoutTitle
              placeholder="Name"
              changeText={value => {
                this.setState({ pocName: value });
              }}
              message={this.state.pocNameErr}
            />
            <TextInputWithoutTitle
              placeholder="Email"
              changeText={value => {
                this.setState({ pocEmail: value });
              }}
              message={this.state.pocEmailErr}
            />
            <TextInputWithoutTitle
              placeholder="Mobile"
              changeText={value => {
                if (value.length < 9) {
                  this.setState({ pocMobile: value });
                }
              }}
              message={this.state.pocMobileErr}
              keyboardType="numeric"
              value={this.state.pocMobile}
            />
            <TextInputWithoutTitle
              placeholder="DID"
              changeText={value => {
                if (value.length < 9) {
                  this.setState({ did: value });
                }
              }}
              message={this.state.didErr}
              keyboardType="numeric"
              value={this.state.did}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.title}>ORGANIZATION</Text>
          </View>
          {this.renderPartner()}

          <View style={styles.group}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                this.addItemToPartners()
              }}
            >
              <Image
                style={{width: 25, height: 25}}
                source={Images.addSolicIcon}
                resizeMode="contain"
              />
              <Text style={{
                color: AppColors.black60TextColor,
                fontSize: 12,
                fontFamily: FontNames.RobotoBold,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 5
              }}>Add Partner Name</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: AppColors.buttonColor,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              fontFamily: FontNames.RobotoMedium
            }}
            onPress={() => {
              this.onRegister();
            }}
          >
            <Text style={{ color: AppColors.titleButtonColor }}>REGISTER</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    partners: state.app.partners
  }),
  dispatch =>
    bindActionCreators(
      {
        registerPartnerAction,
        showLoading,
        register,
        pushNav,
        resetNav
      },
      dispatch
    )
)(RegisterContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  group: {
    marginBottom: 25,
    justifyContent: "center",
    marginLeft: 16,
    marginRight: 16
  },
  title: {
    color: AppColors.registerTitleColor,
    fontSize: 12,
    fontFamily: FontNames.RobotoBold,
    marginTop: 5,
    marginBottom: 5
  },
  note: {
    color: AppColors.grayTextColor,
    fontSize: 12,
    fontFamily: FontNames.RobotoRegular
  },
  border: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 10
  },
  input: {
    marginLeft: 5,
    color: "#333333",
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    height:
      Platform.OS.toLocaleUpperCase() === "ios".toLocaleUpperCase() ? 30 : 40
  },
  autocompleteContainer: {
    flex: 1,
    borderRadius: 5
  },
  groupPartner: {
    marginBottom: 25,
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20
  },
});

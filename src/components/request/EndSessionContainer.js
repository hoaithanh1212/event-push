import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Images } from "../../theme/images";
import { FontNames } from "../../theme/fonts";
import { AppColors } from "../../theme/colors";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import EndSessionHeader from "./presenters/EndSessionHeader";
import ImagePicker from "react-native-image-crop-picker";
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';

var get = require("lodash.get");
const width = Dimensions.get("window").width;

const CHECK_IN = "CHECK_IN";
const READY = "READY";
const END_SESSION = "END_SESSION";

class EndSessionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},

      show: false,
      images: [],

      reasonCancel: "",
      headcountAttendance: "",
      note: "",

      isShowWarning: false,
      isRainVenue: true,
      isLateNoShow: false,

      isEndSession: false,
      isCancelBeforeStart: false,
      isCancelMidway: false
    };
  }

  componentDidMount() {
    let { navigation, requests } = this.props;
    let id = get(navigation, "state.params.id", "");
    let status = get(navigation, "state.params.status", "");
    let item = {};
    requests.map(request => {
      if (request.id == id) return (item = request);
    });

    switch (status) {
      case CHECK_IN: {
        this.setState({
          isEndSession: false,
          isCancelBeforeStart: true,
          isCancelMidway: false
        });
        break;
      }
      case READY: {
        this.setState({
          isEndSession: false,
          isCancelBeforeStart: false,
          isCancelMidway: true
        });
        break;
      }
      case END_SESSION: {
        this.setState({
          isEndSession: true,
          isCancelBeforeStart: false,
          isCancelMidway: false
        });
        break;
      }
      default:
        break;
    }

    this.setState({
      item: item
    });
    console.log("end session", item);
  }

  componentWillUnmount() {
    ImagePicker.clean()
      .then(() => {
        console.log("removed all tmp images from tmp directory");
      })
      .catch(e => {});
  }

  deleteItemById = uri => {
    const filteredData = this.state.images.filter(item => item.uri !== uri);
    this.setState({ images: filteredData });
  };

  onSubmit() {
    let { navigation } = this.props;
    let model = {};
    let status = get(navigation, "state.params.status", "");

    let imageBase64 = [];
    this.state.images.map(i => {
      ImgToBase64.getBase64String(i.uri)
      .then(base64String => {imageBase64.push(base64String)})
      .catch(err => {});
    })

    switch (status) {
      case CHECK_IN:
      case READY: {
        model = {
          requestDetailId: this.state.item.id,
          listPicture: imageBase64,
          headCount: this.state.headcountAttendance,
          node: this.state.note
        }
        break;
      }
      case END_SESSION: {
        model = {
          requestDetailId: this.state.item.id,
          listPicture: imageBase64,
          headCount: this.state.headcountAttendance,
          reasonForCancel: this.state.reasonCancel,
          node: this.state.note
        }
        break;
      }
      default:
        break;
    }

    console.log('model', model);
  }

  render() {
    let { item } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <EndSessionHeader
          title={
            this.state.isCancelBeforeStart || this.state.isCancelMidway
              ? "CANCEL SESSION"
              : "END SESSION"
          }
          leftAction={() => {
            this.props.navigation.goBack();
          }}
        />
        {this.state.isCancelMidway ? (
          <View
            style={{
              alignItems: "center",
              height: 56,
              backgroundColor: "#ffe3e3",
              flexDirection: "row",
              paddingLeft: 24,
              paddingRight: 24
            }}
          >
            <Image
              style={{ width: 24, height: 24 }}
              source={Images.infoIcon}
              resizeMode="contain"
            />
            <Text
              style={{
                color: AppColors.errorTextColor,
                fontSize: 14,
                fontFamily: FontNames.RobotoLight,
                marginLeft: 10
              }}
            >
              You’re cancelling session mid-way.
            </Text>
          </View>
        ) : (
          <View />
        )}
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text
              style={{
                color: AppColors.registerTitleColor,
                fontSize: 14,
                fontFamily: FontNames.RobotoBold,
                marginBottom: 5
              }}
            >
              {"Activity ID: " + get(item, "requestDetailNo", 0)}
            </Text>
            {this.state.isCancelBeforeStart || this.state.isCancelMidway ? (
              <View>
                <Text
                  style={{
                    color: AppColors.blackTextColor,
                    fontSize: 13,
                    fontFamily: FontNames.RobotoLight,
                    marginBottom: 5
                  }}
                >
                  Cancel due to
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.reasonAction,
                      {
                        marginRight: 5,
                        backgroundColor: this.state.isRainVenue
                          ? "#128ff9"
                          : "#f2f2f2"
                      }
                    ]}
                    onPress={() => {
                      this.setState({ isRainVenue: true, isLateNoShow: false });
                    }}
                  >
                    <Text
                      style={{
                        color: this.state.isRainVenue
                          ? AppColors.whiteTitle
                          : "#9d9d9d",
                        fontSize: 14,
                        fontFamily: FontNames.RobotoBold
                      }}
                    >
                      RAIN, VENUE
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.reasonAction,
                      {
                        marginLeft: 5,
                        backgroundColor: this.state.isLateNoShow
                          ? "#128ff9"
                          : "#f2f2f2"
                      }
                    ]}
                    onPress={() => {
                      this.setState({ isRainVenue: false, isLateNoShow: true });
                    }}
                  >
                    <Text
                      style={{
                        color: this.state.isLateNoShow
                          ? AppColors.whiteTitle
                          : "#9d9d9d",
                        fontSize: 14,
                        fontFamily: FontNames.RobotoBold
                      }}
                    >
                      LATE/ NO SHOW
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )}
            {this.state.isCancelBeforeStart || this.state.isCancelMidway ? (
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <TextInputWithTitle
                  title={"Reason for Cancellation"}
                  placeholder={"Reason for Cancellation"}
                  changeText={value => {
                    this.setState({ reasonCancel: value });
                  }}
                  value={this.state.reasonCancel}
                />
              </View>
            ) : (
              <View />
            )}
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <TextInputWithTitle
                title={"Headcount Attendance"}
                placeholder={"Headcount Attendance"}
                changeText={value => {
                  this.setState({ headcountAttendance: value });
                }}
                value={this.state.headcountAttendance}
              />
            </View>
            <Text
              style={{
                color: AppColors.black60TextColor,
                fontSize: 12,
                fontFamily: FontNames.RobotoBold,
                marginBottom: 5
              }}
            >
              Upload Pictures (3-5 Pics)
            </Text>
            <ScrollView
              style={styles.container}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={this.state.images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ margin: 5 }}>
                      {item && item.uri ? (
                        <View style={{ width: 100, height: 100 }}>
                          <Image
                            style={{
                              width: 100,
                              height: 100,
                              resizeMode: "contain"
                            }}
                            source={item}
                          />
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "#1a1a1a",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 25,
                              height: 25,
                              borderRadius: 5
                            }}
                            onPress={() => {
                              this.deleteItemById(item.uri);
                            }}
                          >
                            <Image
                              style={{ width: 15, height: 10 }}
                              source={Images.closeWIcon}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ show: true });
                          }}
                        >
                          <Image
                            style={{ width: 100, height: 100 }}
                            source={Images.imagePlaceHolderIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                }}
              />
              {this.state.images && this.state.images.length >= 5 ? (
                <View />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ show: true });
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={Images.imagePlaceHolderIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </ScrollView>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <TextInputWithTitle
                placeholder={"Note (Optional)"}
                title={"Note"}
                changeText={value => {
                  this.setState({ note: value });
                }}
                value={this.state.note}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor:
                this.state.isCancelBeforeStart || this.state.isCancelMidway
                  ? AppColors.rejectBtnBackground
                  : AppColors.buttonColor,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              fontFamily: FontNames.RobotoMedium
            }}
            onPress={() => {
              this.onSubmit();
            }}
          >
            <Text style={{ color: AppColors.titleButtonColor }}>
              {this.state.isCancelBeforeStart || this.state.isCancelMidway
                ? "CANCEL SESSION"
                : "END SESSION"}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.show}
          onRequestClose={() => {
            this.setState({ show: !this.state.show });
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-around",
              backgroundColor: "#00000040"
            }}
            activeOpacity={1}
            onPress={() => {
              this.setState({ show: !this.state.show });
            }}
          >
            <View>
              <View
                style={{
                  width: width - 70,
                  height: 150,
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    height: 50,
                    backgroundColor: AppColors.statusBarColor,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: AppColors.titleButtonColor,
                      textAlign: "center",
                      fontSize: 18
                    }}
                  >
                    Choose an action
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ show: !this.state.show });
                    
                    ImagePicker.openCamera({
                      width: 300,
                      height: 400,
                      cropping: true
                    }).then(image => {
                      ImageResizer.createResizedImage(image.path, 300, 400, 'PNG', 80)
                      .then((response) => {
                        this.setState({
                          images: [
                            ...this.state.images,
                            {
                              uri: response.uri,
                              width: 300,
                              height: 400
                            }
                          ]
                        });
                      })
                      .catch(err => {
                        console.log(err);
                      });
                    });
                  }}
                  style={{
                    height: 50,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: AppColors.titleButtonColor,
                      textAlign: "center",
                      color: AppColors.black60TextColor,
                      fontSize: 16
                    }}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ show: !this.state.show });
                    ImagePicker.openPicker({
                      multiple: true,
                      maxFiles: 5,
                      mediaType: 'photo'
                    }).then(images => {
                      if (images && images.length > 0) {
                        images.map(i => {
                          ImageResizer.createResizedImage(i.path, 300, 400, 'PNG', 80)
                          .then((response) => {
                            this.setState({
                              images: [
                                ...this.state.images,
                                {
                                  uri: response.uri,
                                  width: 300,
                                  height: 400
                                }
                              ]
                            });
                          })
                          .catch(err => {
                            console.log(err);
                          });
                        });
                      }
                    });
                  }}
                  style={{
                    height: 50,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: AppColors.titleButtonColor,
                      textAlign: "center",
                      color: AppColors.black60TextColor,
                      fontSize: 16
                    }}
                  >
                    Choose from Library
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

export default connect(
  state => ({
    userInfo: state.auth.userInfo,
    requests: state.request.requests
  }),
  dispatch => bindActionCreators({}, dispatch)
)(EndSessionContainer);

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
  reasonAction: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  }
});

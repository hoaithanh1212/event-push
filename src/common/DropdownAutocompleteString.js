import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { AppColors } from "../theme/colors";
import { Images } from "../theme/images";

const width = Dimensions.get("window").width;

export default class DropdownAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedValue: '',
      query: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.value) {
      this.setState({ selectedValue: nextProps.value });
    }
  }

  findActivities(data) {
    const { query } = this.state;
    if (query == "") {
      return data;
    }
    return data.filter(item => item.toUpperCase().includes(query.toUpperCase().trim()));
  }

  render() {
    let { onSelected, data, value, placeholder, onChangeText } = this.props;
    const activities = this.findActivities(data);

    let { selectedValue, query } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row" }}
          onPress={() => {
            this.setState({ show: !this.state.show });
          }}
        >
          <View style={{ flex: 8, justifyContent: "center" }}>
            <Text style={{ marginLeft: 5 }}>{value ? value : placeholder}</Text>
          </View>
          <View
            style={{ flex: 2, alignItems: "flex-end", justifyContent: "center" }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={Images.downSmallIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <View>
          <Modal
            transparent={true}
            animationType={"none"}
            visible={this.state.show}
            onRequestClose={() => {
              this.setState({ show: false });
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
                this.setState({ show: false });
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "white",
                    width: width - 50,
                    height: 250,
                    paddingBottom: 10
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: "gray",
                        borderWidth: 0.3,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10
                      }}
                    >
                      <TextInput
                        placeholder={placeholder}
                        style={{ flex: 9, height: 40, paddingLeft: 10 }}
                        onChangeText={text => {
                          onChangeText(text);
                          this.setState({ query: text });
                        }}
                        value={query}
                      />
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {!!query && (
                          <TouchableOpacity
                            style={{
                              width: 20,
                              height: 20,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                              backgroundColor: "#acacac"
                            }}
                            onPress={() => {
                              this.setState({ query: "" });
                            }}
                          >
                            <Image
                              source={Images.closeWIcon}
                              style={{ width: 8, height: 8 }}
                              resizeMode={"contain"}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    {!!activities && (
                      <ScrollView
                        style={styles.listItem}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                      >
                        {!!activities &&
                          activities.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={{
                                height: 40,
                                marginTop: 1,
                                marginBottom: 1,
                                justifyContent: "center",
                                backgroundColor:
                                  item === selectedValue
                                    ? AppColors.blueBackgroundColor
                                    : "transparent"
                              }}
                              activeOpacity={1}
                              onPress={() => {
                                onSelected && onSelected(item);
                                this.setState({
                                  selectedValue: item,
                                  show: false
                                });
                              }}
                            >
                              <Text style={{ marginLeft: 15 }}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  listItem: {
    borderColor: "gray",
    borderWidth: 0.3,
    marginLeft: 10,
    marginRight: 10
  }
});

import React, { Component } from "react";
import { View, Text } from "react-native";
import LeftMenu from "./presenters/LeftMenu";
import { connect } from "react-redux";
import { appearConfirmationModal } from "../../actions/app";

class LeftMenuContainer extends Component {
  render() {
    return <LeftMenu {...this.props} />;
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    hidenConfirmationModal: () => dispatch(appearConfirmationModal()),
    dispatch
  })
)(LeftMenuContainer);

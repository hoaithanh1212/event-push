import React, {Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform,
    Image
} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
var get = require('lodash.get');

import {Images} from "../../theme/images";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import * as validation from "../../utils/validation";
import {FontNames} from "../../theme/fonts";
import {AppColors} from "../../theme/colors";
import {Message} from "../../common/Message";
import {forgotPassword} from "../../actions/auth";
import NavigationBar from "../../common/NavigationBar";
import {pushNav, resetNav} from '../../actions/navigate';
import {RouteKey} from "../../contants/route-key";

const errorEmail = "Email must not be empty or not correct";

class ForgotPasswordSuccessContainer extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: (
            <NavigationBar
                {...navigation}
                title="forgot password"
            />
        ),
        headerLeft: null
    });

    goBackLogin = () => {
        this.props.pushNav(RouteKey.Login)
    };

    renderButton = (title, action, colorBtn, colorTitle) => {
        return (
            <TouchableOpacity
                style={[styles.btn, {backgroundColor: colorBtn}]}
                onPress={() => action && action()}
            >
                <Text style={[styles.titleBtn, {color: colorTitle}]}>{title}</Text>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Message />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleMsg}>
                            We have sent the Reset Password Link to
                            <Text style={[styles.titleBtn, {fontFamily: FontNames.RobotoMedium}]}> {get(this.props.navigation, 'state.params.email', '') || ''}. </Text>
                            Please check your Email to proceed.
                        </Text>
                    </View>

                    {this.renderButton(
                        "BACK TO LOGIN",
                        this.goBackLogin,
                        AppColors.blueBackgroundColor,
                        AppColors.whiteTitle
                    )}

                </View>
            </View>
        );
    }
}

export default connect(
    state => ({
    }),
    dispatch =>
        bindActionCreators(
            {
                pushNav
            },
            dispatch
        )
)(ForgotPasswordSuccessContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    btn: {
        width: "100%",
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        marginTop: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    titleBtn: {fontFamily: FontNames.RobotoMedium, fontSize: 14},
    titleMsg: {fontFamily: FontNames.RobotoRegular, fontSize: 16, color: AppColors.grayTextColor}
});

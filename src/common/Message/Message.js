import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Platform, TouchableOpacity, Image
} from "react-native";
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import {Images} from '../../theme/images';
import messageManager from './messageManager';

export default class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messagePrev: '',
            message: ''
        };

        this.show = true

    }

    componentDidMount() {
        messageManager.registerMessage(this);
    }
    componentWillUnmount() {
        // messageManager.unregisterMessage();
    }

    pushMessage(message) {
        return this.setState({
            message: message
        })
    }

    hideMessage = () => {
        return this.setState({
            message: ''
        })
    }

    render() {
        return this.state.message ? <View style={{
            flexDirection: 'row',
            paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16,
            backgroundColor: AppColors.errorBackgroundColor,
            alignItems: 'center'
        }}>
            <Text style={{flex: 1, color: AppColors.errorTextColor}}>{this.state.message}</Text>
            <TouchableOpacity style={{marginLeft: 15}} activeOpacity={0.9}
                onPress={this.hideMessage}>
                <Image
                    style={{width: 16, height: 16}}
                    source={Images.closeIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View> : <View />

    }
}

const styles = StyleSheet.create({

});


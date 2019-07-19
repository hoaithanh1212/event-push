import React, {Component} from "react";
import {
    StyleSheet, TouchableOpacity, Image, Text
} from "react-native";
import {AppColors} from '../theme/colors';
var get = require('lodash.get');

export default class CircleButton extends Component {

    constructor(props) {
        super(props);
    }

    touchBtn = () => {
        this.setState({isTouched: !this.state.isTouched})
    }

    render() {

        let {normalIcon, highlightIcon, size, action, active, style} = this.props
        return <TouchableOpacity activeOpacity={0.5}
            style={[styles.btn, {
                backgroundColor: get(this.props, 'active', false) ? AppColors.highlightCircleButton : AppColors.normalCircleButton,
                width: get(this.props, "size", 44),
                height: get(this.props, "size", 44),
                borderRadius: get(this.props, "size", 44) / 2,
            },style]} onPress={() => {
                action && action()
            }}
        >
            <Image
                style={{width: 20, height: 20}}
                source={get(this.props, 'active', false) ? highlightIcon : normalIcon}
                resizeMode="contain"
            />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center', alignItems: 'center',
    }
});

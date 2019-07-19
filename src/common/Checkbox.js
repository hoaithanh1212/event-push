import React, {Component} from "react";
import {
    StyleSheet, TouchableOpacity, Image
} from "react-native";
import {AppColors} from '../theme/colors';
import {Images} from "../theme/images";
var get = require('lodash.get');

export default class SquareButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {normalIcon, highlightIcon, onPress, active} = this.props

        return <TouchableOpacity activeOpacity={0.9} style={styles.btn} onPress={() => {
            onPress && onPress()
        }}>
            {<Image
                style={{width: 20, height: 20}}
                source={get(this.props, 'active', false) ? highlightIcon : normalIcon}
                resizeMode="contain"
            />}
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    btn: {
        width: 24, height: 24, borderRadius: 3,
        justifyContent: 'center', alignItems: 'center',
    }
});

import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Platform, TouchableOpacity, Image
} from "react-native";
import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';
import {Images} from '../theme/images'

export default class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            haveError: false
        };
    }

    onChangeValue() {}
    onShowValue() {}

    renderBackButton = (action) => {
        return action ? <TouchableOpacity style={styles.button}
            onPress={() => action && action()}>
            <Image source={Images.backIcon} style={{width: 20, height: 20}}></Image>
        </TouchableOpacity> : <View style={styles.button} />
    }

    renderRightButton = (image, action) => {
        return image ? <TouchableOpacity style={styles.button}
            onPress={() => action && action()}>
            <Image source={image}></Image>
        </TouchableOpacity> : <View style={styles.button} />
    }

    render() {

        let {title, leftIcon, leftAction, rightIcon, rightAction} = this.props

        return (
            <View style={[styles.container, {alignItems: 'center'}]}>
                {this.renderBackButton(leftAction)}
                <Text style={[styles.title, {fontFamily: FontNames.ArialBoldMTArialBold, fontSize: 16, fontWeight: 'bold'}]}>{title && title.toUpperCase()}</Text>
                {this.renderRightButton(rightIcon, rightAction)}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    button: {
        alignContent: 'flex-end',
        alignContent: 'center',
        width: 50, height: '100%',
        justifyContent: 'center', alignItems: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center'
    }
});

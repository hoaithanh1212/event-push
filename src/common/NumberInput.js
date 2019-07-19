import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Platform
} from "react-native";
import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';

export default class NumberInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isTouched: false
        };
        this.numberInput = React.createRef();
    }

    onChangeValue() {}
    onShowValue() {}

    handleInputFocus = () => this.setState({isTouched: true})

    handleInputBlur = () => this.setState({isTouched: false})

    render() {

        let {placeholder, message, maxLength,
            keyboardType, changeText} = this.props

        return (
            <View style={styles.container}>
                <View style={[styles.border, {
                    borderColor: message
                        ? AppColors.errorTextInputBorderColor
                        : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor)
                }]}>
                    <TextInput
                        ref={this.numberInput}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputBlur}
                        keyboardType={'number-pad'}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        autoCorrect={false}
                        style={styles.input}
                        placeholder={placeholder}
                        onChangeText={value => {
                            changeText && changeText(value)
                        }}
                        placeholderTextColor="black"
                        maxLength={maxLength}
                    />
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5, marginBottom: 5
    },
    input: {
        color: "#333333",
        fontSize: 22,
        fontFamily: FontNames.RobotoRegular,
        width: 40,
        padding: 10,
    },
    border: {
        height: 60,
        width: 56,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

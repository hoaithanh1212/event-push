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
import {Images} from "../theme/images";
import CircleButton from "../common/CircleButton";
var get = require('lodash.get');

export default class SearchInput extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }

        this.searchInput = React.createRef();
    }

    render() {

        let {changeText, onFocus,
            goAction, enableSearchInput,
            closeAction, value, containerStyle, placeholder = 'Search'} = this.props

        return (
            <View style={[styles.container, containerStyle]}>
                <Image
                    style={{width: 20, height: 20}}
                    source={Images.searchIcon}
                    resizeMode="contain"
                />
                <TextInput
                    onFocus={() => onFocus && onFocus()}
                    ref={this.searchInput}
                    keyboardType="default"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    value={value}
                    autoCorrect={false}
                    style={[styles.input, {flex: 1}]}
                    placeholder={placeholder}
                    onChangeText={value => {
                        changeText && changeText(value)
                    }}
                    placeholderTextColor="#9d9d9d"
                />
                {enableSearchInput && <View style={{flexDirection: 'row'}}>
                    <CircleButton normalIcon={Images.goIcon}
                        highlightIcon={Images.goIcon}
                        action={() => {
                            goAction && goAction()
                        }}
                        active={true}
                        style={{}}
                        size={38}
                    />
                
                    <CircleButton normalIcon={Images.closeWIcon}
                        highlightIcon={Images.closeWIcon}
                        action={() => {
                            closeAction && closeAction()
                        }}
                        active={false}
                        style={{marginLeft: 5, backgroundColor: AppColors.grayBackground}}
                        size={38}
                    />
                </View>}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 44, borderRadius: 22, flexDirection: 'row',
        backgroundColor: AppColors.greyishBackground, alignItems: 'center',
        paddingLeft: 14, paddingRight: 5
    },
    input: {
        marginLeft: 5,
        color: "#333333",
        fontSize: 16,
        fontFamily: FontNames.RobotoRegular,
        height:
            Platform.OS.toLocaleUpperCase() === "ios".toLocaleUpperCase() ? 30 : 45
    },
});

import React, {Component} from "react";
import {StyleSheet, View, Image, Text} from "react-native";
import {AppColors} from '../theme/colors';
import {Images} from '../theme/images';
var get = require('lodash.get');

export default class CircleButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {size, resource} = this.props
        return <View >
            {
                resource && resource ? <Image
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    source={{uri: source}}
                    resizeMode="contain"
                    /> : <View style={{width: size, height: size, borderRadius: size / 2, backgroundColor: '#e3f2ff', justifyContent: 'center', alignItems: 'center'}} >
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={Images.userIcon}
                                resizeMode="contain"
                            />
                        </View>
            }  
        </View>
    }
}

const styles = StyleSheet.create({
    
});

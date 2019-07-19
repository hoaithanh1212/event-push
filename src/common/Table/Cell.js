import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import {FontNames} from '../../theme/fonts';
import {AppColors} from '../../theme/colors';

export const Cell = (props) => {

    const {style, width, children, ...viewProps} = props;

    if (typeof children === 'string' || typeof children === 'number') {
        return (
            <View {...viewProps} style={[styles.cell, style, {width: width}]}>
                <Text style={styles.text}>
                    {children}
                </Text>
            </View>
        );
    }

    return <View {...viewProps} style={[styles.cell, style, {width: width}]}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    cell: {
        //flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    },
    text: {
        textAlign: 'center',
        fontFamily: FontNames.RobotoRegular,
        fontSize: 13,
        color : AppColors.black60TextColor
    }
})
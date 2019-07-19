import React, {Component} from 'react';
import {
    StyleSheet, View, Modal, ActivityIndicator
} from 'react-native';
import Spinner from 'react-native-spinkit';

const Loading = props => {
    const {
        loading,
        ...attributes
    } = props;

    return (
        loading && <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <Spinner isVisible={loading}
                        color={'orange'}
                        size={30}
                        type='ThreeBounce' />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default Loading;
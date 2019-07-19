import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Modal, ScrollView
} from 'react-native';

var get = require('lodash.get');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Images} from '../../theme/images';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import NavigationBar from '../../common/NavigationBar';
import {getNotifications} from '../../services/appService';

const BreakLine = () => {
  return <View style={{height: 1, backgroundColor: AppColors.breakLineColor}} />
}

class NotificationContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      refreshing: false,
      loading: false,
      page: 0
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: <NavigationBar {...navigation}
        title="NOTIFICATIONS"
        leftAction={() => {
          navigation.goBack()
        }} />,
      headerLeft: null
    }
  }


  componentDidMount() {
    this.handleGetNotifications('', this.state.page)
  }

  handleGetNotifications = (search, index) => {
    console.log('index--->', index)
    this.setState({loading: true});
    getNotifications(search, index).then(res => {
      if (res.statusCode === 200) {
        console.log('list notifications--->', get(res, 'data.list', []))

        var originData = this.state.data ? this.state.data : []
        let data = get(res, "data.list", [])

        if (index !== 0) {
          originData = originData.concat(data)
        } else {
          originData = data
        }
        this.setState({data: originData, loading: false, refreshing: false})
      } else {
        this.setState({data: []})
        this.setState({loading: false, refreshing: false})
      }
    }).catch(err => {
      this.setState({data: []})
      this.setState({loading: false, refreshing: false})
    })
  }

  handleRefresh = () => {

    this.setState({
      refreshing: true,
      page: 0,
    }, () => {
      this.handleGetNotifications('', 0)
    });
  };

  handleLoadMore = () => {
    if (!this.state.loading) {
      this.setState({
        page: this.state.page + 1,
      }, () => {
        this.handleGetNotifications('', this.state.page)
      })
    }
  }

  renderRow = (item) => {
    return <View>
      <TouchableOpacity style={{flexDirection: 'row', margin: 10}} activeOpacity={0.8}>
        <View style={{width: 50, alignItems: 'center'}}>
          {/* { <Image source={icon}
            style={{width: 24, height: 24, }}
            resizeMode="contain" />} */}
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.hour}>{get(item, 'time', '')}</Text>
          <Text style={styles.content}>{get(item, 'content', '')}
          </Text>
        </View>
      </TouchableOpacity>
      <BreakLine />
    </View>
  }

  render() {
    return <FlatList
      style={{flex: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={this.state.data}
      extraData={this.state}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return this.renderRow(item)
      }}
      onRefresh={this.handleRefresh}
      refreshing={this.state.refreshing}
      onEndReached={this.handleLoadMore}
    />
  }
}

export default connect(state => ({
}),
  dispatch => (bindActionCreators({
  }, dispatch))
)(NotificationContainer)

const styles = StyleSheet.create({
  hour: {
    fontFamily: FontNames.RobotoRegular, fontSize: 13,
    color: AppColors.black60TextColor
  },
  content: {
    fontFamily: FontNames.RobotoRegular, fontSize: 16,
    color: AppColors.blackTextColor
    , marginTop: 3, flexWrap: 'wrap'
  }
})
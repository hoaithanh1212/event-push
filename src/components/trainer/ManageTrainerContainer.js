import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Swipeout from 'react-native-swipeout';
import {from, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';



import {getTrainerAction} from '../../actions/user';
import NavigationBar from '../../common/NavigationBar';
import {Images} from '../../theme/images';
import {pushNav, resetNav} from '../../actions/navigate';
import {RouteKey} from '../../contants/route-key';
import {TabTrainer} from '../../app/AppNavigator';

class ManageTrainerContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: null,
      rowID: null,
      rowIndex: null,

      page: 0,
      refreshing: false,
    };

    this.flatList$ = new Subject();
    this.flatList$.pipe(
      debounceTime(1000),
    ).subscribe(data => {
      console.log('INDEX -before', this.state.page)
      this.setState(
        {
          page: this.state.page + 1
        },
        () => {
          console.log('INDEX- after', this.state.page)
          this.props.getTrainerAction('', '', '', this.state.page)
        }
      );
    }, err => {
    }, () => {
    })
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavigationBar {...navigation}
                                title="Manage Trainer"
                                leftAction={() => {
                                  navigation.goBack()
                                }}
                                rightAction={() => {
                                  navigation.push(RouteKey.CreateTrainer)
                                }}
    />
    ,
    headerLeft: null
  })
  componentDidMount() {
    this.props.getTrainerAction('', '', '', 0, true)
  }



  componentWillUnmount() {
  }

  render() {
    return <View style={{flex: 1}}>
            <TabTrainer/>
    </View>
  }
}

export default connect(state => ({
    trainers: state.user.trainers
  }),
  dispatch => (bindActionCreators({
    getTrainerAction,
    pushNav
  }, dispatch))
)(ManageTrainerContainer)


import React, { Component } from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { View, Text, StyeSheet, Alert } from 'react-native';

import db from '../config';

export default class MyHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
  }

  bellIconWithBadge = () => {
    return (
      <View>
        <Icon name='bell' type='font-awsome' color='#696969' size={25} onPress={() => this.props.navigation.navigate('NotificationScreen')} />
        <Badge value={this.state.value} containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
      </View>
    );
  }

  getAllNotifications() {
    db.collection("AllNotifications").where("NotificationStatus", "==", "Unread")
      .onSnapshot((snapshot) => {
        var NoOfNotifications = snapshot.docs.map((doc) => doc.data())
        this.setState({
          value: NoOfNotifications.length,
        })
      })
  }

  componentDidMount() {
    this.getAllNotifications();
  }

  render() {
    return (
      <Header
        leftComponent={<Icon name='bars' type='font-awesome' color='#696969' onPress={() => this.props.navigation.toggleDrawer()} />}
        centerComponent={{ text: this.props.title, style: { color: '#90A5A9', fontSize: 20, fontWeight: "bold", } }}
        rightComponent={<this.bellIconWithBadge />}
        backgroundColor="#eaf8fe"
      />
    );
  }
}

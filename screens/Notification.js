import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class NotificationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allNotifications: [],
            userID: firebase.auth().currentUser.email,
        }
        this.requestRef = null
    }

    getNotifications = () => {
        this.requestRef = db.collection("AllNotifications").where("NotificationStatus", "==", "Unread").where("targetedUserID", "==", this.state.userID)
            .onSnapshot((snapshot) => {
                var allNotifications = [];
                snapshot.docs.map(doc => {
                    var notification = doc.data();
                    notification["doc_id"] = doc.id;
                    allNotifications.push(notification);
                });
                this.setState({
                    allNotifications: allNotifications,
                });
            })
    }

    componentDidMount() {
        this.getNotifications()
    }

    componentWillUnmount() {
        this.requestRef();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.book_name}
                subtitle={item.message}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                leftElement={
                    <Icon
                        name="book"
                        type="font-awsome"
                        color="#696969"
                    />
                }
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="Your Notifications" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.allNotifications.length === 0
                            ? (
                                <View style={styles.subContainer}>
                                    <Text style={{ fontSize: 20 }}>You Have No Notifications</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.allNotifications}
                                    renderItem={this.renderItem}
                                />
                            )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        }
    }
})

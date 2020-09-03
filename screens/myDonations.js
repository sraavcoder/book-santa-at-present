import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyDonations extends Component {
    constructor() {
        super()
        this.state = {
            AllDonations: [],
            userID: firebase.auth().currentUser.email,
            donarName: '',
        }
        this.requestRef = null
    }

    getAllDonations = () => {
        this.requestRef = db.collection("AllDonations").where("DonarID", '===', this.state.userID)
            .onSnapshot((snapshot) => {
                var AllDonations = snapshot.docs.map(document => document.data());
                this.setState({
                    AllDonations: AllDonations
                });
            })
    }

    getDonarName = (userID) => {
        db.collection('users').where("UserName", "==", userID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            donarName: doc.data().First_Name + " " + doc.data().Last_Name,
                        })
                    }
                    )
                }
            )
    }

    componentDidMount() {
        this.getAllDonations();
        this.getDonarName(this.state.donarID)
    }

    componentWillUnmount() {
        this.requestRef();
    }



    sendNotificatoin = (bookDetails, status) => {
        var requestID = bookDetails.requestID;
        var donarID = bookDetails.donarID;
        db.collection("AllNotification").where("requestID", "==", requestID).where("donarID", "==", donarID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        var message = "";
                        if (requestStatus = "bookSent") {
                            message = this.state.donarName + " Has Sent You A Book";
                        } else {
                            message = this.state.donarName + " Has Shown Intrest In Donationg The Book";
                        }
                        db.collection("AllNotification").doc(doc_id).update({
                            message: message,
                            NotificationStatus: "Unread",
                            date: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                    }
                    )
                }
            )
    }

    sendBook = (item) => {
        if (item.RequestStatus == 'bookSent') {
            var requestStatus = "Donar Intrested";
            db.collection("AllDonations").doc(item.doc_id).update({
                RequestStatus: requestStatus,
            })
            this.sendNotificatoin(item, requestStatus);
        } else {
            var requestStatus = "bookSent";
            db.collection("AllDonations").doc(item.doc_id).update({
                RequestStatus: requestStatus,
            })
            this.sendNotificatoin(item, requestStatus);
        }
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.book_name}
                subtitle={"Requested By :" + item.RequestedBy + "Status :" + item.RequestStatus}
                leftElement={<Icon name="Book" type="font-awsome" color="#696969" ></Icon>}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                rightElement={
                    <TouchableOpacity style={[styles.button, { backgroundColor: item.RequestStatus == "bookSent" ? "green" : '#ff5722' }]} onPress={() => {
                        this.sendBook(item);
                    }} >
                        <Text style={{ color: '#ffff' }}>{item.RequestStatus == "bookSent" ? "Book Sent" : 'Send Book'}</Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="My Donations" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.AllDonations.length === 0
                            ? (
                                <View style={styles.subContainer}>
                                    <Text style={{ fontSize: 20 }}>List Of All Book Donations</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.AllDonations}
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

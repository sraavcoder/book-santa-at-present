import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from 'react-native-elements';

import firebase from 'firebase';
import db from '../config';

export default class RecieverDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            recieverID: this.props.navigation.getParam("details")["userID"],
            requestID: this.props.navigation.getParam("details")["RequestID"],
            bookName: this.props.navigation.getParam("details")["bookName"],
            reasonToRequest: this.props.navigation.getParam("details")["ReasonToRequest"],
            RecieverName: '',
            RecieverContact: '',
            RecieverAdress: '',
            RecieverRequestDocID: '',
            userName: '',
        }
    }

    getUserName = (userID) => {
        db.collection('users').where("UserName", "==", userID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            userName: doc.data().First_Name + " " + doc.data().Last_Name,
                        })
                    }
                    )
                }
            )
    }

    getRicieverDetails() {
        console.log(this.state.recieverID);
        db.collection("users").where("UserName", "==", this.state.recieverID).get()
            .then(
                snapshot => {
                    snapshot.forEach((doc) => {
                        this.setState({
                            RecieverName: doc.data().First_Name,
                            RecieverAdress: doc.data().Adress,
                            RecieverContact: doc.data().Mobile_No,
                        })
                    })
                }
            )

        db.collection("requestedBooks").where("RequestID", "==", this.state.requestID).get()
            .then(
                snapshot => {
                    snapshot.forEach(doc => {
                        this.setState({
                            RecieverRequestDocID: doc.id
                        })
                    }
                    )
                }
            )
    }

    componentDidMount() {
        this.getRicieverDetails();
        this.getUserName(this.state.userID);
    }

    updateStatus = () => {
        db.collection("AllDonations").add({
            bookName: this.state.bookName,
            requestID: this.state.requestID,
            RequestedBy: this.state.RecieverName,
            DonarID: this.state.userID,
            RequestStatus: 'Donar Intrested',
        })
    }

    addNotifications = () => {
        var message = this.state.userName + " Has Shown Intrest In Donating The Book";
        db.collection("AllNotification").add({
            targetedUserID: this.state.recieverID,
            bookName: this.state.bookName,
            requestID: this.state.requestID,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            message: message,
            DonarID: this.state.userID,
            NotificationStatus: 'Unread',
        })
    }

    render() {
        return (
            <View style={styles.container} >
                <View>
                    <Card
                        title={"BookInformation"}
                        titleStyle={{ fontSize: 20, }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>BookName:{this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>ReasonToRequest:{this.state.reasonToRequest}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                    <Card
                        title={"RecieverInformation"}
                        titleStyle={{ fontSize: 20, }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverName:{this.state.RecieverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverAdress:{this.state.RecieverAdress}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>RecieverContact:{this.state.RecieverContact}</Text>
                        </Card>
                    </Card>

                </View>
                <View style={styles.buttonContainer} >
                    {
                        this.state.recieverID !== this.state.userID ?
                            <TouchableOpacity onPress={() => {
                                this.updateStatus();
                                this.addNotifications();
                                this.props.navigation.navigate("MyDonations");
                            }} style={styles.button} >
                                <Text>I Want To Donate</Text>
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    buttonContainer: { flex: 0.3, justifyContent: 'center', alignItems: 'center' },
    button: { width: 200, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'orange', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation: 16 }
})
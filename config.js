import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCCiDf8hZvvN9X_9MQ8jqltBphYUeopukU",
  authDomain: "booksanta-84762.firebaseapp.com",
  databaseURL: "https://booksanta-84762.firebaseio.com",
  projectId: "booksanta-84762",
  storageBucket: "booksanta-84762.appspot.com",
  messagingSenderId: "282108988927",
  appId: "1:282108988927:web:57bdad14b3ed527c12abca"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();

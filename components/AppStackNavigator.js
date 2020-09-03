import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import bookDonate from '../screens/BookDonateScreen';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    BookDonateList: {
        screen: bookDonate,
        navigationOptions: { headerShown: false }
    },
    RecieverDetailsScreen: {
        screen: RecieverDetailsScreen,
        navigationOptions: { headerShown: false }
    },
},
    {
        initialRouteName: "BookDonateList"
    }
)
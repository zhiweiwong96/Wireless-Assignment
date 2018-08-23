import {
  createStackNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import ViewScreen from './ViewScreen';
import CreateScreen from './CreateScreen';
import EditScreen from './EditScreen';

export default createStackNavigator({
  Home: {
    screen: HomeScreen,
  },

  View:{
    screen: ViewScreen,
  },

  Edit:{
    screen: EditScreen,
  },

  Create:{
    screen:CreateScreen,
  }

}, {
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#a80000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

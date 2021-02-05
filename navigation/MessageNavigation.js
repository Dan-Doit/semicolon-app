import { createStackNavigator } from "react-navigation-stack";
import Rooms from "../screens/messages/Rooms";
import Message from "../screens/messages/Message";
import styles from "../styles";

export default createStackNavigator({
  Rooms: {
    screen: Rooms,
    navigationOptions: {
      headerBackTitle: " ",
      headerTintColor: styles.blackColor,
      title: "Rooms"
    }
  },
  Message: {
    screen: Message,
    navigationOptions: {
      headerBackTitle: " ",
      headerTintColor: styles.blackColor,
      title: "Message"
    }
  },
});


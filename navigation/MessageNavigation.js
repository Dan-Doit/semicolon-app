import { createStackNavigator } from "react-navigation-stack";
import Messages from "../screens/messages/Messages";
import Message from "../screens/messages/Message";
import styles from "../styles";

export default createStackNavigator({
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerBackTitle: " ",
      headerTintColor: styles.blackColor,
      title: "Messages"
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
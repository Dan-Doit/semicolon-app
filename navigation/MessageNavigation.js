import { createStackNavigator } from "react-navigation-stack";
import RoomsContainer from "../screens/messages/Rooms";
import MessageContainer from "../screens/messages/Message";
import styles from "../styles";

export default createStackNavigator({
  RoomsContainer: {
    screen: RoomsContainer,
    navigationOptions: {
      headerBackTitle: " ",
      headerTintColor: styles.blackColor,
      title: "Rooms"
    }
  },
  MessageContainer: {
    screen: MessageContainer,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: " ",
      headerTintColor: styles.blackColor,
      title: `${navigation.getParam("roomInfo").userName}님과의 대화`
      })
  },
});


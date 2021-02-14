import { createStackNavigator } from 'react-navigation-stack';
import MakeStory from "../screens/story/MakeStory";
import UploadStory from "../screens/story/UploadStory";
import styles from "../styles";

export default createStackNavigator(
    {
        TakeStory: {
            screen: MakeStory,
            navigationOptions: {
                headerTintColor: styles.blackColor,
                headerBackTitle: " ",
                title:"스토리"
            }
        },
        StoryUpload: {
            screen:UploadStory,
            navigationOptions: {
                headerBackTitle: " ",
                headerTintColor: styles.blackColor,
                title:"업로드"
            }
        }
    },
    {
        mode:"modal"
    }
);
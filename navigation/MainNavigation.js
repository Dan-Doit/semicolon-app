import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import UploadNavigation from "./UploadNavigation";
import StoryNavigation from "./StoryNavigation";

const MainNavigation = createStackNavigator(
    {
        TabNavigation,
        PhotoNavigation,
        MessageNavigation,
        UploadNavigation,
        StoryNavigation
}   ,
    {
        headerMode: "none",
        mode: "modal"
    }
);

export default createAppContainer(MainNavigation);
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Signup from "../screens/auth/Signup";
import Confirm from "../screens/auth/Confirm";
import Login from "../screens/auth/Login";
import AuthHome from "../screens/auth/AuthHome";
import CheckEmail from "../screens/auth/CheckEmail";
import FindCheckemail from "../screens/auth/FindCheckemail";
import UpdatePw from "../screens/auth/UpdatePw";
import LoginConfirm from "../screens/auth/LoginConfirm";
import FindConfirmPw from "../screens/auth/FindConfirmPw";

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    Signup,
    Login,
    Confirm,
    CheckEmail,
    LoginConfirm,
    FindCheckemail,
    UpdatePw,
    FindConfirmPw
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);
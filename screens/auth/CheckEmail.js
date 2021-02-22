import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { LOG_IN } from './AuthQueries';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const GGContainer = styled.View`
margin-top: 20px;`

const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-color: ${props => props.theme.lightGreyColor};
  border-style: solid;
`;

export default ({ navigation }) => {
    const emailInput = useInput(navigation.getParam("email", ""));
    const [loading, setLoading] = useState(false);
    const [requestSecretMutation] = useMutation(LOG_IN, {
        variables: {
            email: emailInput.value
        }

    });
    const handleLogin = async () => {
        const { value } = emailInput;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === "") {
            return Alert.alert("이메일을 입력해 주세요!");
        } else if (!emailRegex.test(value)) {
            return Alert.alert("이메일 형식이 아니에요!");
        }
        try {

            setLoading(true);
            const { data: { requestSecret } } = await requestSecretMutation();
            console.log(requestSecret);
            if (requestSecret) {
                Alert.alert("이메일을 확인해주세요");
                navigation.navigate("Confirm", { email: value });
                return;
            } else {
                Alert.alert("이메일을 확인해주세요");
            }

        } catch (error) {
            console.log(error);
            Alert.alert("로그인 실패", "지금은 로그인할수 없어요 😥");
        } finally {
            setLoading(false);
        }

    };
    const FBlogIn = async () => {
        try {
            setLoading(true);
            await Facebook.initializeAsync({
                appId: '119711363348825',
            });
            const {
                type,
                token
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', "email"],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`);
                const { email, first_name, last_name } = await response.json();
                navigation.navigate("Signup", { email, firstName: first_name, lastName: last_name });
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    };
    const GGLogIn = async () => {
        try {
            setLoading(true);
            const result = await Google.logInAsync({
                androidClientId: "279164621755-lr72g7uhmf7mjeudc8noiuk9td7ddscl.apps.googleusercontent.com",
                iosClientId: "279164621755-la27utrs44j9bmm53ro23r77dgm9cchk.apps.googleusercontent.com",
                scopes: ['profile', 'email']
            });
            if (result.type === 'success') {
                const user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: { Authorization: `Bearer ${result.accessToken}` }
                });
                const { email, family_name, given_name } = await user.json();
                navigation.navigate("Signup", { email, firstName: family_name, lastName: given_name });
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...emailInput}
                    placeholder="이메일"
                    keyboardType="email-address"
                    returnKeyType="send"
                    onSubmitEditing={handleLogin}
                    autoCorrect={false}
                />
                <AuthButton loading={loading} onPress={handleLogin} text="이메일 확인" />
                <FBContainer>
                    <AuthButton bgColor={"#2D4DA7"} loading={loading} onPress={FBlogIn} text="페이스북으로 회원가입" />
                </FBContainer>
                <GGContainer>
                    <AuthButton bgColor={"#E34133"} loading={loading} onPress={GGLogIn} text="구글로 회원가입" />
                </GGContainer>
            </View>
        </TouchableWithoutFeedback>
    );
};
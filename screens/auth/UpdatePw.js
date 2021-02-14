import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { UPDATE_PW } from './AuthQueries';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
    const emailInput = useInput(navigation.getParam("email", ""));
    const pwInput = useInput("");
    const [loading, setLoading] = useState(false);
    const [updatePwMutation] = useMutation(UPDATE_PW, {
        variables: {
            email: emailInput.value,
            password: pwInput.value
        }

    });
    const handleLogin = async () => {
        try {
            setLoading(true);
            const { data: { updatePw } } = await updatePwMutation();
            if (updatePw, id !== "") {
                Alert.alert("바뀐 비밀번호로 로그인해주세요");
                navigation.navigate("Login");
                return;
            } else {
                Alert.alert("비밀번호 변경 실패");
            }

        } catch (error) {
            console.log(error);
            Alert.alert("로그인 실패", "지금은 로그인할수 없어요 😥");
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...pwInput}
                    secureTextEntry={true}
                    placeholder="비밀번호 최소 8자 문자 숫자 하나 이상"
                    returnKeyType="send"
                />
                <AuthButton loading={loading} onPress={handleLogin} text="비밀번호 변경" />
            </View>
        </TouchableWithoutFeedback>
    );
};
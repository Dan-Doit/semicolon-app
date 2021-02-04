import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { useLogIn } from "../../AuthContext";
import { CONFIRM_USER } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
    const Pwinput = useInput("");
    const logIn = useLogIn();
    const [loading, setLoading] = useState(false);
    const [confirmUserMutation] = useMutation(CONFIRM_USER, {
        variables: {
            password: Pwinput.value,
            email: navigation.getParam("email")
        }
    });
    const handleConfirm = async () => {
        const { value } = Pwinput;
        if (value === "") {
            console.log(value);
            return Alert.alert("비밀번호를 제대로 입력해 주세요.");
        }
        try {
            setLoading(true);
            const {
                data: { confirmUser }
            } = await confirmUserMutation();
            if (confirmUser !== "" || confirmUser !== "츄라이 츄라이 어게인") {
                console.log(confirmUser);
                logIn(confirmUser);
            } else {
                Alert.alert("비밀번호가 틀렸어요!");
            }
        } catch (e) {
            console.log(e);
            Alert.alert("비밀번호 오류 😎");
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...Pwinput}
                    placeholder="비밀번호"
                    returnKeyType="send"
                    onSubmitEditing={handleConfirm}
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                <AuthButton loading={loading} onPress={handleConfirm} text="로그인" />
            </View>
        </TouchableWithoutFeedback>
    );
};
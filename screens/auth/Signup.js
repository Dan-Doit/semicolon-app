import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { CREATE_ACCOUNT } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
  const fNameInput = useInput(navigation.getParam("firstName", ""));
  const lNameInput = useInput(navigation.getParam("lastName", ""));
  const emailInput = useInput(navigation.getParam("email", ""));
  const usernameInput = useInput("");
  const PwInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: usernameInput.value,
      email: emailInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value,
      password: PwInput.value
    }
  });

  const handleSingup = async () => {
    const { value: email } = emailInput;
    const { value: fName } = fNameInput;
    const { value: lName } = lNameInput;
    const { value: username } = usernameInput;
    const { value: password } = PwInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
      return Alert.alert("이메일을 제대로 입력해 주세요!");
    }
    if (fName === "" || lName === "") {
      return Alert.alert("이름을 제대로 입력해 주세요.");
    }
    if (username === "") {
      return Alert.alert("닉네임을 제대로 입력해 주세요.");
    }
    if (password === "") {
      return Alert.alert("비밀번호를 입력해 주세요!");
    }
    if (!pwdRegex.test(password)) {
      return Alert.alert("비밀번호 양식을 확인해주세요.");
    }
    try {
      setLoading(true);
      const {
        data: { createAccount }
      } = await createAccountMutation();
      if (createAccount) {
        Alert.alert("회원가입 성공!", "지금 로그인하러 가볼까요?");
        navigation.navigate("Login", { email });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Woops!","닉네임 또는 이메일이 중복돼요 🤣");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...fNameInput}
          placeholder="이름"
          autoCapitalize="words"
        />
        <AuthInput
          {...lNameInput}
          placeholder="성"
          autoCapitalize="words"
        />
        <AuthInput
          {...emailInput}
          placeholder="이메일"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder="닉네임"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...PwInput}
          secureTextEntry={true}
          placeholder="비밀번호 최소 8자 문자 숫자 하나 이상"
          returnKeyType="send"
        />
        <AuthButton loading={loading} onPress={handleSingup} text="회원가입" />

      </View>
    </TouchableWithoutFeedback>
  );
};
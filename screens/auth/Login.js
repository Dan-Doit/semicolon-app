import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { CHECK_EMAIL } from './AuthQueries';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
  const emailInput = useInput(navigation.getParam("email", ""));
  const [loading, setLoading] = useState(false);
  const [checkemailmutation] = useMutation(CHECK_EMAIL, {
    variables: {
      email: emailInput.value
    }

  });
  const handleLogin = async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("이메일을 제대로 입력해 주세요");
    } else if (!value.includes("@") || !value.includes(".")) {
      return Alert.alert("이메일을 제대로 입력해 주세요");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("이메일을 제대로 입력해 주세요");
    }
    const { data: { checkemail } } = await checkemailmutation();
    console.log(checkemail);
    try {
      setLoading(true);
      if (checkemail) {
        navigation.navigate("LoginConfirm", { email: value });

      } else {
        Alert.alert("Woops! 계정을 찾을수없어요!");
        navigation.navigate("CheckEmail");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("지금은 로그인할수 없어요 😥");
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
        <AuthButton loading={loading} onPress={handleLogin} text="로그인" />
        <AuthButton loading={loading} onPress={() => { navigation.navigate("FindCheckemail") }} text="비밀번호 찾기" />
      </View>
    </TouchableWithoutFeedback>
  );
};
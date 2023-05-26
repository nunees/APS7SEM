import styled from "styled-components/native";

import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #202024;
  padding-top: 50px;
`;

export const Title = styled.Text`
  align-self: center;
  color: #fff;
  font-size: 20px;
  margin-top: 20px;
`;

export const Form = styled.View`
  align-items: center;
  align-self: center;
  width: 100%;
  margin-top: 20px;
`;

export const Input = styled.TextInput`
  width: 300px;
  height: 30px;
  background-color: #fff;
  padding-left: 10px;
`;

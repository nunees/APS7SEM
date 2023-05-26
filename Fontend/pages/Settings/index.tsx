import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { CaretLeft } from "phosphor-react-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { Container, Form, Title } from "./styles";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(false);

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  function save(name: string, distance: number) {
    setError(false);
    setSaved(false);
    if (name === "" || distance === 0) {
      setError(true);
      return;
    }
    setSettings({ name, distance });
    axios
      .post("http://192.168.0.8:3333/api/v1/reportaenchente/setdevice", {
        device: name,
        status: "",
        safeDistance: distance,
        measureUnit: "cm",
      })
      .then((response) => {
        if (response.status === 200) {
          setSaved(true);
        }
      })
      .catch((error) => {
        Alert.alert("Erro", "Erro ao salvar configurações");
      });
    setSaved(true);
  }

  return (
    <Container>
      <TouchableOpacity onPress={handleGoBack}>
        <CaretLeft size={30} color="white"></CaretLeft>
      </TouchableOpacity>

      <Title>Configurações</Title>
      <Form>
        <TextInput
          placeholder="Nome do dispositivo"
          style={{
            backgroundColor: "#FFF",
            borderRadius: 5,
            width: 300,
            height: 40,
            paddingLeft: 10,
            marginBottom: 20,
          }}
          value={name}
          onChangeText={setName}
        ></TextInput>
        <TextInput
          inputMode="numeric"
          placeholder="Distancia segura (centimetros)"
          style={{
            backgroundColor: "#FFF",
            borderRadius: 5,
            width: 300,
            height: 40,
            paddingLeft: 10,
            marginBottom: 20,
          }}
          value={distance}
          onChangeText={setDistance}
        ></TextInput>
        <TouchableOpacity
          style={{
            backgroundColor: "#303443",
            width: 100,
            paddingBottom: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => save(name, Number(distance))}
        >
          <Title>Salvar</Title>
        </TouchableOpacity>
      </Form>
      {saved && (
        <Text
          style={{
            marginLeft: 50,
            marginTop: 80,
            width: 300,
            height: 40,
            fontSize: 14,
            textAlign: "center",
            paddingTop: 10,
            backgroundColor: "#49FCBB",
          }}
        >
          Configurações salvas
        </Text>
      )}

      {error && (
        <Text
          style={{
            marginLeft: 50,
            marginTop: 80,
            width: 300,
            height: 40,
            fontSize: 14,
            textAlign: "center",
            paddingTop: 10,
            backgroundColor: "rgb(231, 93, 93)",
            color: "#FFF",
          }}
        >
          Erro ao salvar, revise os campos
        </Text>
      )}
    </Container>
  );
}

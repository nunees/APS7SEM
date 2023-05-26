import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import { Container, Details, Graph, Text, Title } from "./styles";

function handleError(message: string) {
  Alert.alert("Erro", message);
}

export default function Chart() {
  const [chartData, setChartData] = useState([{ date: "", distance: 0 }]);

  const [deviceName, setDeviceName] = useState("");
  const [measureUnit, setMeasureUnit] = useState("");
  const [safeDistance, setSafeDistance] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState("");
  const [distance, setDistance] = useState(0);

  const [date, setDate] = useState("");
  const [stroke, setStroke] = useState("");

  const [error, setError] = useState(false);

  const navigation = useNavigation();

  function goToSettings() {
    navigation.navigate("settings");
  }

  async function refreshData() {
    setDate(new Date().toUTCString().split(" ", 5)[4]);
    await axios
      .get("http://192.168.0.8:3333/api/v1/reportaenchente/stats")
      .then((response) => {
        setDeviceName(response.data.device);
        setDeviceStatus(response.data.status);
        setSafeDistance(response.data.safeDistance);
        setMeasureUnit(response.data.measureUnit);
        setDistance(response.data.distance);
        if (response.data.alert === 1) {
          Alert.alert("Alerta", "Distancia segura ultrapassada");
        }
      })
      .catch((error) => {
        Alert.alert("Erro", "Erro ao obter dados do servidor");
      })
      .then(() => {
        return;
      });

    if (distance < safeDistance) {
      setStroke("#FF0000");
    } else {
      setStroke("#00FF00");
    }

    setChartData((oldstate) => [
      ...oldstate,
      { date: date, distance: distance },
    ]);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      refreshData();
    }, 100);
    return () => clearTimeout(timeout);
  }, [chartData]);

  return (
    <Container>
      <Title>Monitoramento de enchente</Title>
      <Graph>
        <VictoryChart
          width={500}
          theme={VictoryTheme.material}
          minDomain={{ y: 0 }}
          maxDomain={{ y: 400 }}
        >
          {chartData && (
            <VictoryLine
              interpolation={"natural"}
              polar={false}
              style={{
                data: {
                  stroke: stroke,
                  strokeWidth: 1,
                  width: 3,
                  color: stroke,
                },
                parent: { border: "1px solid #ccc" },
                labels: { color: "#FFF" },
              }}
              data={chartData}
              x={(data) => data.date}
              y={(data) => data.distance}
            />
          )}
          {/* [2000, 1500, 1000, 500, 0] */}
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </Graph>
      <Details>
        <Text>Sensor: {deviceName}</Text>
        <Text>Horario: {date}</Text>
        <Text>
          Distancia atual: {distance} {measureUnit}
        </Text>
        <Text>
          Distancia segura: {safeDistance} {measureUnit}
        </Text>
        <Text>Situação: {deviceStatus}</Text>
      </Details>
      <TouchableOpacity
        style={{
          backgroundColor: "#404452",
          width: 200,
          height: 40,
          borderRadius: 5,
          marginLeft: 120,
          marginBottom: 50,
        }}
        onPress={goToSettings}
      >
        <Text
          style={{
            paddingTop: 10,
          }}
        >
          Configurações
        </Text>
      </TouchableOpacity>
      {}
    </Container>
  );
}

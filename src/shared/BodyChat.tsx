import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RootState } from "../core/redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import PutRequest from "../core/requests/PutRequest";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "../core/constants/axiosInstance";

type ChatItem = {
  id: number;
  name: string;
  description: string[];
  date: string;
};

const BodyChat: React.FC = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const socket = useRef<Socket | null>(null);

  const dataRedux = useSelector((state: RootState) => state.data.data);

  const myName = sessionStorage.getItem("name");

  const [inputValue, setInputValue] = useState("");
  const [newData, setNewData] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [localTimeString, setLocalTimeString] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    if (
      dataRedux.length > 0 &&
      dataRedux[0]?.name !== newData?.name &&
      localTimeString
    ) {
      setNewData({
        id: dataRedux[0]?.id || 0,
        name: dataRedux[0]?.name || "",
        description: [...dataRedux[0]?.description],
        date: localTimeString,
      });
    }
  }, [dataRedux, newData, localTimeString]);

  const addNewData = () => {
    if (newData) {
      sendMessage();
      setNewData((prev) => ({
        ...prev!,
        description: [...prev!.description, inputValue],
      }));
      setInputValue("");
    }
  };

  useEffect(() => {
    if (
      newData &&
      newData?.description.length !== dataRedux[0].description.length
    ) {
      PutRequest(newData, dispatch);
    }
  }, [newData, dataRedux, dispatch]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [newData?.description]);

  useEffect(() => {
    socket.current = io(SERVER_URL);

    socket.current.on("connect", () => {
      console.log("WebSocket соединение установлено.");
    });

    socket.current.on("message", (message: string) => {
      console.log("Получено сообщение от WebSocket сервера:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on("disconnect", () => {
      console.log("WebSocket соединение закрыто.");
    });

    socket.current.on("connect_error", (error: any) => {
      console.error("Ошибка WebSocket:", error);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket.current) {
      socket.current.emit("message", inputValue);
      setInputValue("");
    } else {
      console.log("WebSocket соединение не установлено или закрыто.");
    }
  };

  return (
    <View style={styles.container}>
      {!newData ? null : (
        <>
          <Text style={styles.chatHeader}>Chat name: {newData.name}</Text>
          <Text style={styles.chatHeader}>{newData.date}</Text>
          <ScrollView style={styles.chatItem} ref={scrollViewRef}>
            {newData.description.map((desc, index) => (
              <Text key={index} style={styles.textChat}>
                {desc.length > 0 ? (
                  <>
                    {myName} : {desc}
                  </>
                ) : null}
              </Text>
            ))}
          </ScrollView>
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Pressable onPress={addNewData}>
        <Text style={styles.chatHeader}>Add</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  chatItem: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 10,
    paddingVertical: 5,
    backgroundColor: "#9EA0A1",
    borderRadius: 5,
    maxHeight: 380,
    overflow: "hidden",
    marginBottom: 10,
  },
  textChat: {
    color: "gold",
    fontSize: 16,
    fontWeight: "600",
  },
  chatHeader: {
    textAlign: "center",
    backgroundColor: "#007BFF",
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
  },
});

export default BodyChat;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { RootState } from "../core/redux/reducers";
import { useSelector } from "react-redux";
import { updateDataItem, setFlag } from "../core/redux/slices/AllSlice";
import { RootStackParamList } from "../core/router/Navigation";
import GetRequest from "../core/requests/GetRequest";
import GetIdRequest from "../core/requests/GetIdRequest";
import DeleteRequest from "../core/requests/DeleteRequest";
import Backet from "../core/assets/busket.png";
import PostRequest from "../core/requests/PostRequest";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

type ChatItem = {
  id: number;
  name: string;
  description: string;
  date: string;
};

const BodyHome: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();

  const flag = useSelector((state: RootState) => state.data.flag);

  const date = new Date();
  const localTimeString = date.toLocaleString();

  const [firstName, setFirstName] = useState("");
  const [localName, setLocalName] = useState<string | null>(null);
  const [data, setData] = useState<ChatItem[]>([]);
  const [idData, setIdData] = useState<ChatItem[]>([]);

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    setLocalName(name);
    if (data.length === 0 || flag) {
      GetRequest({ setData });
      if (flag) {
        const localId = sessionStorage.getItem("id");
        dispatch(setFlag());
        if (localId) {
          toChat(+localId);
        }
      }
    }
  }, [data, localName, flag]);

  const addNick = async () => {
    const searchName = data.some((el) => el.name === firstName);
    if (!searchName) {
      sessionStorage.setItem("name", firstName);
      setFirstName("");
      setLocalName(firstName);
    } else {
      alert("This nickname is taken");
      setFirstName("");
    }
  };

  const toChat = (id: number) => {
    if (!localName) {
      alert("Enter your nickname.");
    } else {
      sessionStorage.removeItem("id");
      sessionStorage.setItem("id", `${id}`);
      GetIdRequest({ setIdData, id });
      navigation.navigate("Chat");
    }
  };

  useEffect(() => {
    if (idData.length > 0) {
      const updatedChatItem = {
        id: idData[0].id,
        name: idData[0].name,
        description: idData[0].description,
        date: idData[0].date,
      };
      dispatch(updateDataItem(updatedChatItem));
    }
  }, [idData]);

  const exit = () => {
    sessionStorage.removeItem("name");
    setData([]);
    setIdData([]);
    setLocalName(null);
  };

  const deleteChat = (id: number) => {
    DeleteRequest(id, setFlag, dispatch);
    sessionStorage.removeItem("id");
    setIdData([]);
  };

  const createChat = () => {
    const res = data.some((el) => el.name === localName);
    if (!res) {
      const newChat = {
        name: localName,
        description: [],
        date: localTimeString,
      };
      PostRequest(newChat, setFlag, dispatch);
    } else {
      alert("You already have a chat");
    }
  };

  useEffect(() => {
    const onFocus = navigation.addListener("focus", () => {
      sessionStorage.removeItem("id");
    });
    return onFocus;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Chats</Text>
      {data && data.length > 0
        ? data.map((item) => (
            <View style={styles.wrapBtn} key={item.id}>
              <Pressable
                style={styles.buttonChats}
                onPress={() => toChat(item.id)}
              >
                <Text style={styles.buttonText}>{item.name}</Text>
              </Pressable>
              {localName === item.name ? (
                <Pressable
                  onPress={() => deleteChat(item.id)}
                  style={styles.createChat}
                >
                  <ImageBackground source={Backet} style={styles.trash} />
                </Pressable>
              ) : null}
            </View>
          ))
        : null}
      {!localName ? (
        <>
          <Text style={styles.label}>To get started, enter your nickname.</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <Pressable style={styles.button} onPress={addNick}>
            <Text style={styles.buttonText}>Add Name</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={createChat}>
          <Text style={styles.buttonText}>Create Chat</Text>
        </Pressable>
      )}
      {localName ? (
        <Pressable style={styles.button} onPress={exit}>
          <Text style={styles.buttonText}>Exit</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    color: "grey",
    fontSize: 16,
    fontWeight: 600,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },

  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 40,
    backgroundColor: "#007BFF",
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 20,
    width: 150,
    height: 30,
  },
  buttonChats: {
    width: 200,
    maxHeight: 40,
    backgroundColor: "gold",
    marginBottom: 20,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
    color: "grey",
    textAlign: "center",
    marginBottom: 20,
  },
  trash: {
    position: "absolute",
    right: -40,
    top: -25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapBtn: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 40,
    marginBottom: 20,
  },
  createChat: {
    maxHeight: 40,
  },
});

export default BodyHome;

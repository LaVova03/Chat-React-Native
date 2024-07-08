import React from "react";
import BodyHome from "../shared/BodyHome";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../core/router/Navigation";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const Home: React.FC<Props> = ({ navigation, route }) => {
  return <BodyHome navigation={navigation} route={route} />;
};

export default Home;

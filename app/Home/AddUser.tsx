import React, { useEffect, useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type State = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Action =
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
};

const SignUpScreen = () => {
  const [state, dispatch] = useReducer(reducer, {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigation = useNavigation();

  const CreateNewUser = async () => {};
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 5,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Create User</Text>
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={state.fullName}
          onChangeText={(text) =>
            dispatch({ type: "SET_FULL_NAME", payload: text })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={state.email}
          onChangeText={(text) =>
            dispatch({ type: "SET_EMAIL", payload: text })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={state.password}
          onChangeText={(text) =>
            dispatch({ type: "SET_PASSWORD", payload: text })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={state.confirmPassword}
          onChangeText={(text) =>
            dispatch({ type: "SET_CONFIRM_PASSWORD", payload: text })
          }
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.buttonText}>CREATE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 15,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontVariant: ["small-caps"],
    marginLeft: "-40%",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#ff9f00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
    marginRight: "-45%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    fontSize: 14,
    color: "#999",
  },
  signUpLink: {
    color: "#ff9f00",
  },
});

export default SignUpScreen;

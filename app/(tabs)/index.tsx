
import React, { useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Image } from 'react-native';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type State = {
  email: string;
  password: string;
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

const LoginScreen = () => {
  const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const navigation = useNavigation();
  
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    
    <View style={styles.container}>
      <Image
  source={require('../../assets/images/sigmalogo.png')} 
  style={styles.logo}
/>

      
      <View style={{ padding: 20 }}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          isEmailFocused && styles.inputContainerFocused,
        ]}
      >
        <MaterialCommunityIcons name="email-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={state.email}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          onChangeText={(text) =>
            dispatch({ type: "SET_EMAIL", payload: text })
          }
        />
      </View>
      <View
        style={[
          styles.inputContainer,
          isPasswordFocused && styles.inputContainerFocused,
        ]}
      >
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={secureText}
          value={state.password}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onChangeText={(text) =>
            dispatch({ type: "SET_PASSWORD", payload: text })
          }
        />
        <TouchableOpacity
          onPress={() => {
            setSecureText(!secureText);
          }}
        >
          <MaterialCommunityIcons
            name={secureText ? "eye" : "eye-off"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.replace("/Home");
        }}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/Signup")}
        style={{
          position: "absolute",
          bottom: "4%",
        }}
      >
        <Text style={styles.signUpText}>
          Don't have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    marginBottom:"-20%",
    marginTop:'-50%' // Add some margin if needed
  },
  
  title: {
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["small-caps"],
    marginBottom: 5,
    marginLeft: "-40%",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
    marginLeft: "-40%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    borderColor: "#dddddd",
    borderBottomWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainerFocused: {
    elevation: 5,
    shadowColor: "#dddddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
    borderBlockColor: "#ddd",
  },
  forgotText: {
    color: "#ff9f00",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#8283e9",
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
    color: "#8283e9",
  },
});


export default LoginScreen;

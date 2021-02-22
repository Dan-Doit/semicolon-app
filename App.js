import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import AsyncStorage from "@react-native-community/async-storage";
import { ApolloProvider } from 'react-apollo-hooks';``
import { ThemeProvider } from 'styled-components';
import styles from './styles';
import NavController from './components/NavController';
import { AuthProvider } from './AuthContext';
import { StatusBar } from "react-native";
import setUp from './Apollo';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const preLoad = async () => {
    
  await Asset.loadAsync([require('./assets/icon.png')]);
    // AsyncStorage.clear();
    try {
      await Font.loadAsync({
        ...AntDesign.font
      });

      const client = await setUp();

      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }

  }
  useEffect(() => {
    preLoad();
  }, []);

  return loaded && client ? (
    <ApolloProvider client={client} >
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          {Platform.OS === "ios" ? <StatusBar barStyle="dark-content" /> : null}
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ ApolloProvider>
  ) : (
      <AppLoading />
    );

}
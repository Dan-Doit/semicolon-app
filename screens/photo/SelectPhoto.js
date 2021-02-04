import React, { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components";
import Loader from "../../components/Loader";
import constants from "../../Constants";
import styles from "../../styles";

const View = styled.View`
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  width: 70px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blackColor};
  justify-content: center;
  align-items: center;
  border-radius: 15px;
`;

const Text = styled.Text`
  color: yellow;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState([]);
  const [allPhotos, setAllPhotos] = useState();
  const changeSelected = photo => {
    setSelected(photo);
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
      navigation.navigate("PhotoTabs", { photo: firstPhoto })
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);

    }
  };

  const askPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        getPhotos();
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  navigation.navigate("PhotoTabs", { photo: selected });
  
  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <>
              <Image
                style={{ width: constants.width, height: constants.width }}
                source={{ uri: selected.uri }}
                />
                
              <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap:"wrap" }}>
                {allPhotos.map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => changeSelected(photo)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 3,
                        height: constants.height / 6,
                        opacity: photo.id === selected.id ? 0.5 : 1
                      }}
                    />
                  </TouchableOpacity>
              ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};
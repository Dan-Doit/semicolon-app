import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import constants from "../../Constants";
import Loader from "../../components/Loader";
import { TouchableOpacity, Platform, Text } from "react-native";
import styles from "../../styles";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Bottom = styled.TouchableOpacity`
  border: 1.5px solid black;
  flex : 1;
  justify-content: center;
  align-items: center;
  height : 100%;

`;

const Icon = styled.View``;

const Button = styled.View`
  width: 80;
  height: 80;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;

const VideoButton = styled.View`
  width: 60;
  height: 60;
  border-radius: 30px;
  background : ${styles.lightGreyColor};
`;

export default ({ navigation }) => {
  
  const cameraRef = useRef();
  const [picture, setPicture] = useState(true);
  const [uri, setUri] = useState(null);
  const [type, setType] = useState(null);
  const [recording, setRecording] = useState(false);
  const [showCamera, setsShowCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [canTakePhoto, setCanTakePhoto] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const takePhoto = async () => {
      if (!canTakePhoto) {
        return;
      }
      try {
        setCanTakePhoto(false);
        const { uri } = await cameraRef.current.takePictureAsync({
          quality: 1
        });
        const asset = await MediaLibrary.createAssetAsync(uri);
        setCanTakePhoto(true);
        navigation.navigate("StoryUpload", { photo: asset });
      } catch (e) {
        console.log(e);
        setCanTakePhoto(true);
      }
    };
    const askPermission = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        if (status === "granted") {
          setHasPermission(true);
        }
      } catch (e) {
        console.log(e);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    const toggleType = () => {
      if (cameraType === Camera.Constants.Type.front) {
        setCameraType(Camera.Constants.Type.back);
      } else {
        setCameraType(Camera.Constants.Type.front);
      }
    };
    useEffect(() => {
      askPermission();
    }, []);
      
  const _saveVideo = async () => {
    const asset = await MediaLibrary.createAssetAsync(uri);

    if (asset) {
      navigation.navigate("StoryUpload", { type: type, story: asset, uri });
      setUri(null)
    }
  };

  const _StopRecord = async () => {
    
    cameraRef.current.stopRecording();
    _saveVideo();
    setRecording(false)
  }
  const _StartRecord = async () => {
    // if (cameraRef) {
    setRecording(true)
    const { uri, codec = "mp4" } = await cameraRef.current.recordAsync();
    setUri(uri)
    setType(codec)
    // setVideo(svideo)
    // }
  }
  const pushVideo = () => {
     
      _StartRecord();
    
  };

    const pullVideo = () => {
    
      _StopRecord();
      
    
  };

  const _showCamera = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === "granted") {
        setsShowCamera(true);
      }
    } catch (e) {
      console.log(e);
      setsShowCamera(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _showCamera();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : showCamera ? (
        <>
          <Camera
              ref={cameraRef}
              type={cameraType}
              style={{
                justifyContent: "flex-end",
                padding: 15,
                width: constants.width,
                height: constants.height/1.22
              }}
            >
              {picture ? (
              
              <TouchableOpacity
                onPress={takePhoto}
                disabled={!canTakePhoto}
                              style={
                                  {
                                  textAlign: "center",
                                  paddingLeft : constants.width/2-55}
                              }
              >
                <Button />
              </TouchableOpacity>
              )
              :
              (
                <TouchableOpacity
                    onLongPress={pushVideo}
                    //delayLongPress={200}
                    onPressOut={pullVideo}
                    style={
                      {
                        textAlign: "center",
                        paddingLeft: constants.width / 2 - 45
                      }
                    }
              >
                    <VideoButton />
              </TouchableOpacity>
              )
      }
                 
                            
                      </Camera>
            
                      <View style={{flexDirection: "row"}}>
              <>
               
                <Bottom onPress={()=>setPicture(true)}>
                  <Text>사진 촬영</Text>
                  </Bottom>
                  
                <Bottom onPress={()=>setPicture(false)}>
                <Text>동영상 촬영</Text>
                </Bottom>
                </>
          </View>
        </>
                  
      ) : null}
    </View>
  )  
}
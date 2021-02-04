import React, { useState , useEffect } from "react";
import styled from "styled-components/native";
import constants from "../../Constants";
import { useQuery } from "react-apollo-hooks";
import { gql } from 'apollo-boost';
import NavigationView from "./NavigationView";

const Image = styled.Image`
  margin-top : -30px;
  margin-bottom : -30px;
  width: ${constants.width / 3};
`;

const GET_TODAYINFO = gql`
  query todayInfo($location:String!, $latitude: Float! ,$longitude:Float!) {
    todayInfo(location:$location, latitude: $latitude, longitude:$longitude){
        newCase
        countryName
        temp 
        weather
        }
    }
`;

export default ({ location }) => {
  
  const { data , loading } = useQuery(GET_TODAYINFO, {
    variables: {
      location: location.region,
      latitude: location.latitude,
      longitude: location.longitude
    }
  });
  
  const [index, setIndex] = useState(0);
  
  const saveViews = () => { 
  if (index === 2) {
      setTimeout(() => setIndex(0), 5000);
    } else {
      setTimeout(() => setIndex(index + 1), 5000);
    }
  }

  useEffect(() => { 
    saveViews();
  },[index])

  return (loading ? (<Image resizeMode={"contain"} source={require("../../assets/logo.png")} />)
    :     < NavigationView index = {index}
            countryName = { data.todayInfo.countryName }
            newCase = { data.todayInfo.newCase }
            weather = { data.todayInfo.weather }
            temp = { data.todayInfo.temp } />
  
  )
};
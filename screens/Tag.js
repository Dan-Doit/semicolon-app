import React from "react";
import SearchPresenter from "../screens/tabs/Search/SearchPresenter";


export default ({ navigation, shouldFetch }) => {
    console.log(navigation.getParam("term"))

    return <SearchPresenter term={navigation.getParam("term")} shouldFetch={true} action={"search"} navigation={navigation} />
}
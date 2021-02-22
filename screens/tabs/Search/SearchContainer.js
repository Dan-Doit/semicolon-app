import React from "react";
import SearchBar from "../../../components/SearchBar";
import SearchPresenter from "./SearchPresenter";

export default class extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: ()=>(
      <SearchBar
        value={navigation.getParam("term", "")}
        onChange={navigation.getParam("onChange", () => null)}
        onSubmit={navigation.getParam("onSubmit", () => null)}
      />
    )
  });
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      term: "",
      shouldFetch: false,
      action : "recommend"
    };
    navigation.setParams({
      term: this.state.term,
      onChange: this.onChange,
      onSubmit: this.onSubmit
    });
  }
  onChange = text => {
    const { navigation } = this.props;
    this.setState({ term: text, shouldFetch: false, action : "recommend" });
    navigation.setParams({
      term: text
    });
  };
  onSubmit = () => {
    this.setState({ shouldFetch: true });
    this.setState({ action: "search" });
  };
  render() {
    const { navigation } = this.props;
    const { term, shouldFetch, action } = this.state;
    return <SearchPresenter term={term} navigation={navigation} shouldFetch={shouldFetch} action={action} />;
  }
}
import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ActivityIndicator, ScrollView } from 'react-native';

const APIKEY = '****';
const URL_PATH = "http://api.wunderground.com/api/";
const FORECAST_PATH = "/forecast10day/q/";
const FORECAST_DAYS = 5;

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      zipcode: '64108',
      forecast: [],
      error: null,
    }
  }

  fetchForecast(zipcode){
    if(this.state.error) {
      this.setState({error: null})
    }

    fetch(`${URL_PATH}${APIKEY}${FORECAST_PATH}${zipcode}.json`)
      .then(response => response.json())
      .then(data => this.setParsedResults(data))
      .catch(error => this.setState({error: error}));
  }

  setParsedResults(data) {
    const weather = data.forecast.simpleforecast.forecastday;
    const forecast = [];
    weather.forEach( (item, i) => {
      if(i < FORECAST_DAYS && i <= 9 ) {
        forecast[i] = {
          date: `${item.date.weekday}, ${item.date.month}/${item.date.day}/${item.date.year}`,
          high: item.high,
          low: item.low,
          conditions: item.conditions,
          avewind: item.avewind,
          average_humidity: item.avehumidity,
          icon_url: item.icon_url
        }
      }
    });
    this.setState({forecast: forecast});
  }

  componentDidMount() {
    this.fetchForecast(this.state.zipcode);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontWeight: "900"}}> {"\n"}{this.state.zipcode} Weather </Text>
        { this.state.forecast.length > 0
            ? this.state.forecast.map( (element) =>
              <WeatherBox element={element} key={element.date} />
            )
            : <ActivityIndicator />
        }
      </View>
    );
  }
}

const WeatherBox = ({ element }) =>
  <View style={styles.weatherBox}>
    <View style={{justifyContent: "flex-start", flex: 2}}>
      <Text style={{fontWeight: "900"}}>{element.date}</Text>
      <Text>{element.conditions}</Text>
      <Text>High: {element.high.fahrenheit} F | {element.high.celsius} C </Text>
      <Text>Low: {element.low.fahrenheit} F | {element.low.celsius} C </Text>
      <Text>Wind: {element.avewind.dir} @ {element.avewind.mph} MPH</Text>
    </View>
    <View style={{flex: 1, justifyContent: "flex-end"}}>
      <Image style={{width: 50, height: 50}} source={{uri: element.icon_url}} />
    </View>
  </View>



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherBox : {
    margin: 5,
    borderWidth: 2,
    paddingLeft: 15,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: "white",
    width: Dimensions.get('window').width * 0.8, 
    height: Dimensions.get('window').height * .12, 
    flex: 1, 
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20
  }
});

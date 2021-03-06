import "./App.css";
import axios from "axios";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import statecodes from "./statecodes.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = {
  bigDiv: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    margin: 50,
  },
  form: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "lightgreen",
    "&:hover": {
    backgroundColor: "green",
    },
  },
  displaymessage: {
    textAlign: "center",
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      stateinput: "",
      iconState: "",
      stateDisplayMessage: "Hittable?",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);

          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=02d2c0bc0569091f6d80053853dfabd6`
            )
            .then((response) => {
              console.log(response);
              if (response.data.weather[0].description === "heavy rain") {
                this.setState({ stateDisplayMessage: "Too rainy!" });
              } else if (response.data.main.temp < 55) {
                this.setState({ stateDisplayMessage: "Too cold!" });
              } else if (response.data.wind.speed > 10) {
                this.setState({ stateDisplayMessage: "Too windy!" });
              } else {
                this.setState({
                  stateDisplayMessage: `It's ${response.data.main.temp} degrees with average winds of ${response.data.wind.speed} mph. Hittable!`,
                });
              }
              this.setState({ iconState: response.data.weather[0].icon });
              console.log(this.state.iconState);
            })
            .catch((error) => {
              console.log(error);
            });
        }.bind(this)
      );
    } else {
      console.log("Not Available");
    }
  }

  handleSubmit(event) {
    alert("You are in " + this.state.city + ", " + this.state.stateinput);

    const statecodeObject = statecodes.find(
      (o) => o.State === this.state.stateinput
    );
    console.log(statecodeObject.Code);

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.state.city},${statecodeObject.Code}&units=imperial&appid=02d2c0bc0569091f6d80053853dfabd6`
      )
      .then((response) => {
        if (response.data.weather[0].description === "heavy rain") {
          this.setState({ stateDisplayMessage: "Too rainy!" });
        } else if (response.data.main.temp < 60) {
          this.setState({ stateDisplayMessage: "Too cold!" });
        } else if (response.data.wind.speed > 10) {
          this.setState({ stateDisplayMessage: "Too windy!" });
        } else {
          this.setState({
            stateDisplayMessage: `It's ${response.data.main.temp} degrees with average winds of ${response.data.wind.speed} mph. Hittable!`,
          });
        }
        this.setState({ iconState: response.data.weather[0].icon });
        console.log(response.data);
      })
      .catch((error) => {
        window.alert("Did you spell out and capitalize the state name?");
        console.log(error);
      });

    event.preventDefault();
  }
  componentDidUpdate() {
    console.log(this.state.city + ", " + this.state.stateinput);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.bigDiv}>
        <h1>Can I play tennis today?</h1>
        <p>Enter your location:</p>
        <form onSubmit={this.handleSubmit} className={classes.form}>
          <TextField
            variant="filled"
            type="text"
            name="city"
            value={this.state.city}
            label="City"
            onChange={this.handleChange}
            margin="normal"
            fullWidth="true"
          />
          <TextField
            variant="filled"
            type="text"
            name="stateinput"
            value={this.state.stateinput}
            label="State"
            id="outlined-basic"
            onChange={this.handleChange}
            margin="normal"
            fullWidth="true"
          />
          <Button
            size="large"
            className={classes.button}
            type="submit"
            variant="outlined"
          >
            Can I hit?
          </Button>
        </form>
        <p className={classes.displaymessage}>
          {this.state.stateDisplayMessage}
        </p>
        <img
          src={`http://openweathermap.org/img/wn/${this.state.iconState}@2x.png`}
          alt="weather icon"
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

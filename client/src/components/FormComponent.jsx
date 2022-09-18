import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import axios from "axios";

const FormComponent = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { currentUser } = useContext(AuthContext);
  let useAuth = useContext(AuthContext);

  const [value1, setValue1] = useState([18, 80]);
  const [countryVar, setCountryVar] = useState([]);
  const [cityVar, setCityVar] = useState([]);
  const [stateVar, setStateVar] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  let countryInput = watch().country ? watch().country : "";
  let stateInput = watch().state ? watch().state : "";
  let cityInput = watch().city ? watch().city : "";
  let arrivalDate = watch().arriving ? watch().arriving : "";
  let leavingDate = watch().leaving ? watch().leaving : "";
  let host = watch().props?.publishHost?.props?.children[1]?.props?.name
    ? watch().props?.publishHost?.props?.children[1]?.props?.name
    : "";
  // let description = watch().props?.description?.props?.children[1]?.props?.onChange?.name ? watch().props?.description?.props?.children[1]?.props?.onChange?.name : '';
  let minTime = watch().minTime ? watch().minTime : "";
  let maxTime = watch().maxTime ? watch().maxTime : "";
  let maxPeople = watch().maxPeople ? watch().maxPeople : "";

  // console.log("description", handleDescText);

  let states = []; // variable to hold states of a country
  let isFoundCountry = false; // variable to decide whether a valid country is selected or not been selected yet
  let isFoundState = false; // variable to decide whether a valid state is selected or not been selected yet
  let countryToSetStateObj = {}; // that selected country object, used to set my countryVar state variable(object type)
  let isStateValidForCountry; // variable to set true when the selected state belongs to the selected country
  // or set it false when it does not belong to that selected country

  Country.getAllCountries().forEach((country) => {
    if (country.name === countryInput) {
      isFoundCountry = true;
      countryToSetStateObj = country;
      states = State.getStatesOfCountry(country.isoCode);

      if (State.getStatesOfCountry(country.isoCode).includes(stateVar)) {
        isStateValidForCountry = true;
      } else {
        isStateValidForCountry = false;
      }
    }
  });

  let chosenState = {}; // a variable to hold the selected state object, used to set the state's stateVar later.

  let isCountryVarEmpty = Object.keys(countryVar).length === 0;
  let isCityValidForState; // variable to check whether the selected city belong to the selected state
  let cities = []; // variable that holds the cities of the selected state object

  states.forEach((state) => {
    if (countryVar.name === countryInput && !isCountryVarEmpty) {
      if (state.name === stateInput) {
        isFoundState = true;
        cities = City.getCitiesOfState(countryVar.isoCode, state.isoCode);
        chosenState = state;

        if (
          City.getCitiesOfState(
            countryVar.isoCode,
            chosenState.isoCode
          ).includes(cityVar)
        ) {
          isCityValidForState = true;
        } else {
          isCityValidForState = false;
        }
      }
    } else {
      isFoundState = false;
      chosenState = {};
      states.length = 0;
    }
  });

  let dateToCheck = new Date();
  let month = dateToCheck.getMonth();
  let day = dateToCheck.getDate().toString();
  let todayDate = new Date().toISOString().slice(0, 10);

  //Variables to decide whether the day or the month is less than or equal to 9, so we can put '0' in front of it
  let isLargerThanNineMonth = "";
  let isLessThanNineMonth = "";
  let finalMonthToUse = "";

  // Putting 0 logic
  if (month >= 9) {
    isLargerThanNineMonth = (month + 1).toString();
    finalMonthToUse = isLargerThanNineMonth;
  } else {
    isLessThanNineMonth = "0" + (month + 1).toString();
    finalMonthToUse = isLessThanNineMonth;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }

  let boolVarForMinTime = false;

  if (
    finalMonthToUse === arrivalDate.substring(5, 7) &&
    day === arrivalDate.substring(8, 10)
  ) {
    boolVarForMinTime = true;
  }

  // These are the array variables that I use to map over and show a list of countries,states and cities inside
  // the dropdown that is an typeable input field at the same time (html datalist tag)
  let filteredStates = states.filter((state) =>
    state.name.toLowerCase().startsWith(stateInput.toLowerCase())
  );
  let filteredCountries = Country.getAllCountries().filter((country) =>
    country.name.toLowerCase().startsWith(countryInput.toLowerCase())
  );
  let finalFilteredCities = cities.filter(
    (city) =>
      city.countryCode === countryVar.isoCode &&
      city.stateCode === stateVar.isoCode &&
      city.name.toLowerCase().startsWith(cityInput.toLowerCase())
  );

  // These variables and conditionals are here for the logic of setting the from and to time inputs to be disabled
  // and only set their disabled attribute's value to false when the arriving and leaving dates are selected
  // And also keeping the arriving and leaving date input fields disabled while the user has not selected
  // country,state and city beforehand

  let isLeavingSelected = false;
  let isDatesSelected = false;
  let isArrivingDateSelected = false;
  let isMinTimeSelected = false;
  let isTimeSelected = false;

  if (arrivalDate && leavingDate) {
    isDatesSelected = true;
  }

  if (arrivalDate) {
    isArrivingDateSelected = true;
  }

  if (leavingDate) {
    isLeavingSelected = true;
  }

  if (minTime) {
    isMinTimeSelected = true;
  }

  if (minTime && maxTime) {
    isTimeSelected = true;
  }

  let cityObject = {}; // this variable holds the city object so that I can use it later to set the state variable
  //for cityVar.
  finalFilteredCities.forEach((city) => {
    if (city.name === cityInput) {
      cityObject = city;
    }
  });

  //useEffect to clear the localStorage when the component first mounts
  useEffect(() => {
    localStorage.clear();
  }, []);

  //useEffect's to set the countryVar, stateVar and cityVar state variables
  useEffect(() => {
    setCountryVar(countryToSetStateObj);
  }, [countryInput]);

  useEffect(() => {
    setStateVar(chosenState);
    isStateValidForCountry = true;
  }, [stateInput]);

  useEffect(() => {
    setCityVar(cityObject);
    isCityValidForState = true;
  }, [cityInput]);

  let urlToSendRequestTo =
    currentPath === "/publish" ? "publish" : "searchresult";
  let hostOptionToSend =
    currentPath === "/publish" ? props.publishHostVal : props.searchHostVal;

  console.log("hostOptionToSend var:", hostOptionToSend);

  console.log("props:", props);

  console.log("isArrivanDateSelected:", isArrivingDateSelected);

  console.log("urlToSendRequestTo:", urlToSendRequestTo);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "88.5vh",
        width: "100vw",
      }}
    >
      <div className={currentPath === "/search" ? "generall" : "general"}>
        <div className="containerr">
          {currentPath === "/search" ? (
            <div>
              <h1>SEARCH FOR AN AD</h1>
              <p>Let's make new connections along the way!</p>
            </div>
          ) : (
            <h1>PUBLISH AN AD</h1>
          )}
          <form
            onSubmit={handleSubmit(async (data, event) => {
              event.preventDefault();
              const response = await axios.post(
                `http://localhost:5000/api/ad/${urlToSendRequestTo}`,
                {
                  arrivingDateYear: parseInt(data.arriving?.substring(0, 4)),
                  arrivingDateMonth: parseInt(data.arriving?.substring(5, 7)),
                  arrivingDateDay: parseInt(data.arriving?.substring(8, 10)),
                  leavingDateYear: parseInt(data.leaving?.substring(0, 4)),
                  leavingDateMonth: parseInt(data.leaving?.substring(5, 7)),
                  leavingDateDay: parseInt(data.leaving?.substring(8, 10)),
                  city: cityVar?.name,
                  country: countryVar?.name,
                  host: hostOptionToSend,
                  description: props?.desc,
                  maxPeopleToPass: data?.maxPeople,
                  minTimeHourToPass: parseInt(data.minTime?.substring(0, 2)),
                  minTimeMinuteToPass: parseInt(data.minTime?.substring(3, 5)),
                  maxTimeHourToPass: parseInt(data.maxTime?.substring(0, 2)),
                  maxTimeMinuteToPass: parseInt(data.maxTime?.substring(3, 5)),
                  minTimeTotal:
                    parseInt(data.minTime?.substring(0, 2)) * 60 +
                    parseInt(data.minTime?.substring(3, 5)),
                  maxTimeTotal:
                    parseInt(data.maxTime?.substring(0, 2)) * 60 +
                    parseInt(data.maxTime?.substring(3, 5)),
                  state: stateVar?.name,
                  gender: data.gender,
                  minAge: value1[0],
                  maxAge: value1[1],
                  userToProcess: currentUser,
                }
              );
              console.log(`data sended via ${currentPath} page:`, response);
              {
                currentPath === "/publish"
                  ? window.location.assign(
                      `/searchresult/${response?.data?._id}`
                    )
                  : window.location.assign("/searchresult");
              }
            })}
          >
            <div className="yusuf-container">
              <div className="roww">
                <div className="columnn">
                  <label htmlFor="country">Country</label>
                  <input
                    autoComplete="off"
                    placeholder="Type in Country"
                    {...register("country", {
                      required: "Please select a country",
                    })}
                    list="countries"
                    name="country"
                    // required
                    id="country"
                    type="text"
                  />
                  {errors.country && (
                    <p style={{ color: "red" }}>{errors.country.message}</p>
                  )}
                  <datalist id="countries">
                    {filteredCountries.map((country, key) => (
                      <option key={key} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div className="columnn">
                  <label htmlFor="state">State</label>
                  <input
                    autoComplete="off"
                    placeholder="Type in State"
                    disabled={!isFoundCountry}
                    {...register("state", {
                      required: "Please select a state",
                    })}
                    required
                    type="text"
                    name="state"
                    id="state"
                    list="states"
                  />
                  {errors.state && !errors.country && isFoundCountry ? (
                    <p style={{ color: "red" }}>{errors.state.message}</p>
                  ) : (
                    ""
                  )}
                  {!errors.state &&
                  !errors.country &&
                  isFoundCountry &&
                  stateVar.name &&
                  !isStateValidForCountry ? (
                    <p style={{ color: "red" }}>
                      State does not belong to country
                    </p>
                  ) : (
                    ""
                  )}
                  <datalist name="states" id="states">
                    <option selected disabled value="">
                      Choose a State
                    </option>
                    {filteredStates.map((state, key) => (
                      <option key={key} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div className="columnn">
                  <label htmlFor="city">City</label>
                  <input
                    autoComplete="off"
                    placeholder="Type in City"
                    disabled={!isFoundState}
                    {...register("city", { required: "Please select a city" })}
                    type="text"
                    name="city"
                    id="city"
                    list="cities"
                  />
                  {errors.city &&
                  !errors.country &&
                  !errors.state &&
                  isFoundCountry &&
                  isFoundState ? (
                    <p style={{ color: "red" }}>{errors.city.message}</p>
                  ) : (
                    ""
                  )}
                  {!errors.city &&
                  !errors.country &&
                  !errors.state &&
                  isFoundCountry &&
                  isFoundState &&
                  cityVar.name &&
                  !isCityValidForState ? (
                    <p style={{ color: "red" }}>
                      City does not belong to state
                    </p>
                  ) : (
                    ""
                  )}
                  <datalist name="cities" id="cities">
                    <option selected disabled value="">
                      Choose a City
                    </option>
                    {finalFilteredCities.map((city, key) => (
                      <option key={key} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="roww">
                {props.ageSlider}
                {props.publishHost}
                <div className="columnn">
                  <label htmlFor="arriving">Arriving in:</label>
                  <input
                    min={todayDate}
                    max={
                      isLeavingSelected === false
                        ? `${
                            new Date().getFullYear() + 1
                          }-${finalMonthToUse}-${day}`
                        : leavingDate
                    }
                    {...(currentPath === "/publish"
                      ? register("arriving", {
                          required: "Please select an arrival date",
                        })
                      : register("arriving"))}
                    name="arriving"
                    id="arriving"
                    type="date"
                  />
                  {currentPath === "/publish" && errors?.arriving?.message ? (
                    !errors.country &&
                    !errors.state &&
                    !errors.city &&
                    isFoundCountry &&
                    isFoundState &&
                    cityInput ? (
                      <p style={{ color: "red" }}>{errors.arriving.message}</p>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>

                <div className="columnn">
                  <label htmlFor="leaving">Leaving in:</label>
                  <input
                    min={`${arrivalDate}`}
                    disabled={!isArrivingDateSelected}
                    {...(currentPath === "/publish"
                      ? register("leaving", {
                          required: "Please select a leaving date",
                        })
                      : register("leaving"))}
                    required={isArrivingDateSelected}
                    id="leaving"
                    name="leaving"
                    type="date"
                  />
                </div>
              </div>

              <div className="roww">
                <div className="columnn">
                  <label id="people" htmlFor="maxPeople">
                    For:
                  </label>
                  <select
                    name="maxPeople"
                    id="maxPeople"
                    {...(currentPath === "/publish"
                      ? register("maxPeople", {
                          required: "Please select maximum people to guide",
                        })
                      : register("maxPeople"))}
                  >
                    <option selected value={1}>
                      One People
                    </option>
                    <option value={2}>Two People</option>
                    <option value={3}>Three People</option>
                    <option value={4}>Four People</option>
                  </select>
                </div>
                <div className="columnn" id="minTime">
                  <label htmlFor="minTime">From:</label>
                  <input
                    disabled={!isDatesSelected}
                    {...(currentPath === "/publish"
                      ? register("minTime", {
                          required: "Please select starting time",
                        })
                      : register("minTime"))}
                    name="minTime"
                    id="minTime"
                    type="time"
                  />
                </div>

                <div className="columnn" id="maxTime">
                  <label htmlFor="maxTime">To:</label>
                  <input
                    disabled={!isDatesSelected && !isMinTimeSelected}
                    required={isMinTimeSelected}
                    {...(currentPath === "/publish"
                      ? register("maxTime", {
                          required: "Please select ending time",
                        })
                      : register("maxTime"))}
                    name="maxTime"
                    id="maxTime"
                    type="time"
                  />
                </div>
              </div>
              <div className="roww">
                {props.gender}
                {props.searchHost}
                {props.description}
                {props.publishButton}
                {props.searchButton}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FormComponent;

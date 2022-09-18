import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../public/Search.css";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import FormComponent from "../components/FormComponent";

function valuetext(value) {
  return `${value}`;
}
const minDistance = 0;

const Search = () => {
  const [value1, setValue1] = useState([18, 80]);
  const [lookingHost, setLookingHost] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleChange1 = (newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  console.log("lookingHost variable on Search.jsx:", lookingHost);

  return (
    <FormComponent
      ageSlider={
        <div className="columnn">
          <label htmlFor="ageRange">Age Range:</label>
          <Box id="slider">
            <Slider
              value={value1}
              onChange={handleChange1}
              getAriaValueText={valuetext}
              getAriaLabel={() => "Age value min range"}
              valueLabelDisplay="auto"
              min={18}
              max={80}
              disableSwap
            />
          </Box>
        </div>
      }
      gender={
        <div className="columnn" id="gender">
          <label htmlFor="gender">Gender</label>
          <select {...register("gender")} name="gender" id="gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value={undefined}>Doesn't Matter</option>
          </select>
        </div>
      }
      searchHost={
        <div className="columnn" id="host">
          <label htmlFor="host">Looking for a host?</label>
          <select
            onClick={(e) => setLookingHost(e.target.value)}
            {...register("host")}
            name="host"
            id="host"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
      }
      searchHostVal={lookingHost}
      searchButton={
        <div id="searchButtonDiv" className="columnn searchButton">
          <button>Submit</button>
        </div>
      }
    />
  );
};

export default Search;

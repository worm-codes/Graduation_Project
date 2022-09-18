import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../public/Publish.css";
import FormComponent from "../components/FormComponent";

const Publish = () => {
  const [descriptionText, setDescriptionText] = useState("");
  const [canHost, setCanHost] = useState(false);

  const {
    register,
    formState: { errors },
  } = useForm();

  if (errors.country) {
    errors.state.message = "";
    errors.city.message = "";
    errors.arriving.message = "";
    errors.leaving.message = "";
    errors.minTime.message = "";
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.state) {
    errors.city.message = "";
    errors.arriving.message = "";
    errors.leaving.message = "";
    errors.minTime.message = "";
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.city) {
    errors.arriving.message = "";
    errors.leaving.message = "";
    errors.minTime.message = "";
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.arriving) {
    errors.leaving.message = "";
    errors.minTime.message = "";
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.leaving) {
    errors.minTime.message = "";
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.minTime) {
    errors.maxTime.message = "";
    errors.description.message = "";
  }

  if (errors.maxTime) {
    errors.description.message = "";
  }

  return (
    <FormComponent
      publishHost={
        <div className="columnn">
          <label id="host" htmlFor="host">
            I Can Host
          </label>
          <select
            onClick={(e) => setCanHost(e.target.value)}
            {...register("host", { required: true })}
            name="host"
            id="host"
          >
            <option value={true}>Yes</option>
            <option selected value={false}>
              No
            </option>
          </select>
        </div>
      }
      publishHostVal={canHost}
      description={
        <div className="columnn">
          <label htmlFor="description">Describe your guidance plan</label>
          <textarea
            onKeyUp={(e) => setDescriptionText(e.target.value)}
            // value={descriptionText}
            maxLength={600}
            minLength={200}
            name="description"
            {...register("description", {
              required: "Please describe your plan of guidance",
            })}
            id="description"
            placeholder="Describe your guidance plan in detail here"
            rows="3"
          ></textarea>
          {errors.description &&
          !errors.country &&
          !errors.state &&
          !errors.city &&
          !errors.arriving &&
          !errors.leaving &&
          !errors.minTime &&
          !errors.maxTime &&
          isFoundCountry &&
          isFoundState &&
          cityInput &&
          arrivalDate &&
          leavingDate &&
          minTime &&
          maxTime ? (
            <p style={{ color: "red" }}>{errors.description.message}</p>
          ) : (
            ""
          )}
        </div>
      }
      publishButton={
        <div id="buttonDiv" className="columnn submitButton">
          <button>Submit</button>
        </div>
      }
      desc={descriptionText}
    />
  );
};

export default Publish;

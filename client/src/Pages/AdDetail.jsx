import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../public/AdDetail.css";
import { decideToPutZero } from "../utilities/DecideToPutZero";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const AdDetail = () => {
  const [theAdOwner, setTheAdOwner] = useState({});
  const [theRealAd, setTheRealAd] = useState({});
  const [rating, setRating] = useState(4);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [buttonText, setButtonText] = useState("Apply");
  let navigate = useNavigate();

  let useAuth = useContext(AuthContext);
  let { id } = useParams();

  useLayoutEffect(() => {
    const getTheAd = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/ad/searchresult/${id}`,
        {}
      );

      setTheAdOwner(response?.data?.adOwner);
      setTheRealAd(response?.data?.foundAd);
    };
    if (id) {
      getTheAd();
    }
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getCurrentUserInfo = async () => {
    const response = await useAuth?.getCurrentUserInfo();
    // console.log("currentUser response",response)
    if (response) {
      setLoggedInUser(response);
    }
  };

  const makeConversationAndRedirect = async (id) => {
    const response = await axios.post(
      `http://localhost:5000/api/conversation/`,
      {
        senderId: loggedInUser._id,
        receiverId: id,
      },
      {
        headers: {
          Authorization:
            "Bearer " + (await useAuth.currentUser.getIdToken(true)),
        },
      }
    );
    console.log(response.data);
    if (response.data.message != "UnAuth") {
      window.location.href = "/messenger";
    }
  };

  let isAdActive = () => {
    let currentDate = new Date().toISOString().slice(0, 10);
    let currentYear = parseInt(currentDate.substring(0, 4));
    let currentMonth = parseInt(currentDate.substring(5, 7));
    let currentDay = parseInt(currentDate.substring(8, 10));
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();

    if (theRealAd?.arriving_date_year > currentYear) {
      return true;
    }

    if (
      theRealAd?.arriving_date_year === currentYear &&
      theRealAd?.arriving_date_month > currentMonth
    ) {
      return true;
    }

    if (
      theRealAd?.arriving_date_year === currentYear &&
      theRealAd?.arriving_date_month === currentMonth &&
      theRealAd?.arriving_date_day > currentDay
    ) {
      return true;
    }

    if (
      theRealAd?.arriving_date_year === currentYear &&
      theRealAd?.arriving_date_month === currentMonth &&
      theRealAd?.arriving_date_day === currentDay &&
      theRealAd?.minTimeHour > currentHour
    ) {
      return true;
    }

    if (
      theRealAd?.arriving_date_year === currentYear &&
      theRealAd?.arriving_date_month === currentMonth &&
      theRealAd?.arriving_date_day === currentDay &&
      theRealAd?.minTimeHour === currentHour &&
      theRealAd?.minTimeMinute > currentMinute
    ) {
      return true;
    }

    //

    return false;
  };

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  useEffect(() => {
    if (isAdActive()) {
      console.log("inside isAdActive if");
    } else if (isAdActive() === false && theRealAd?.appliedUsers?.length > 0) {
      let updatedAdvertisement = { ...theRealAd };
      updatedAdvertisement.appliedUsers.pop();
      console.log(
        "updatedAdvertisement in useEffect else if:",
        updatedAdvertisement
      );
      setTheRealAd(updatedAdvertisement);
    }
  }, [isAdActive]);

  let valueOfIsAdActive = isAdActive();

  let currentYear = new Date().getFullYear();

  //This variable is to add margin-top:2em to the acceptedUser's usernames
  //because on the page of the accepted users, the username was stacking on top of the user avatars.
  //In ad owner's browser, the spacing between the avatar and the nickname was fine.
  //So i added a conditional style to that div which holds the username.
  let acceptedUsersMargin =
    loggedInUser?._id !== theAdOwner?._id ? true : false;

  let acceptedUserRenderFunc = theRealAd?.acceptedUsers?.map((acceptedUsr) => {
    return (
      <div className="acceptedUser">
        <img
          onClick={() => {
            navigate("/profile/" + acceptedUsr?._id);
          }}
          src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
          className="rounded-circle z-depth-0 avatar userAvatar"
          alt="avatar image"
        />

        {loggedInUser?._id === theAdOwner?._id ? (
          <a
            onClick={async (e) => {
              e.preventDefault();
              const response = await axios.put(
                `http://localhost:5000/api/ad/searchresult/${theRealAd?._id}/${acceptedUsr._id}/decline`,
                {}
              );
              response.data !== "User has already been rejected for this ad."
                ? setTheRealAd(response.data.foundAd) &&
                  setTheAdOwner(response.data.adOwner)
                : "";
              console.log(response.data);
            }}
            href="#"
          >
            <i
              className="fa fa-ban fa-xs"
              style={{
                marginBottom: "3.5em",
                color: "red",
                fontSize: "1.2rem",
                marginLeft: "-.8em",
              }}
            />
          </a>
        ) : (
          ""
        )}

        {/* style={{
            borderRadius:
              decidingOfAppliedUserRenderFunc === false
                ? "15px 0px 0px 15px"
                : "",
          }} */}
        <div
          style={{ marginTop: acceptedUsersMargin ? "2em" : "" }}
          className="acceptedUserName"
        >
          <Link
            to={"/profile/" + acceptedUsr?._id}
            className="acceptedUserName"
          >
            <b>{acceptedUsr?.user_ID}</b>
          </Link>
        </div>
        <p className="acceptedUserStar">
          <i className="fa fa-star fa-xs" /> 4,9/5
        </p>
      </div>
    );
  });

  let currentlyUnacceptedAppliedUsers = theRealAd?.appliedUsers?.filter(
    (usr) => !theRealAd?.acceptedUsers.includes(usr)
  );
  console.log(
    "currentlyUnacceptedAppliedUsers var:",
    currentlyUnacceptedAppliedUsers
  );

  let appliedUserRenderFunc = theRealAd?.appliedUsers?.map((appliedUsr) => {
    return valueOfIsAdActive ? (
      <>
        <img
          src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
          className="rounded-circle z-depth-0 avatar appliedUserAvatar"
          alt="avatar image"
        />

        <div className="sideBarAppliedContent">
          <div>
            <a
              onClick={async (e) => {
                e.preventDefault();
                const response = await axios.put(
                  `http://localhost:5000/api/ad/searchresult/${theRealAd?._id}/${appliedUsr._id}/decline`,
                  {}
                );
                response.data !== "User has already been rejected for this ad."
                  ? setTheRealAd(response.data.foundAd) &&
                    setTheAdOwner(response.data.adOwner)
                  : "";
                console.log(response.data);
              }}
              href="#"
            >
              <i
                className="fa fa-xmark fa-xl"
                style={{ color: "red", marginRight: ".75em" }}
              />
            </a>
            <a
              onClick={async (e) => {
                e.preventDefault();
                const response = await axios.put(
                  `http://localhost:5000/api/ad/searchresult/${theRealAd?._id}/${appliedUsr._id}/accept`,
                  {}
                );
                response.data !==
                "User has already been accepted for this ad or can't apply for this ad."
                  ? setTheRealAd(response.data.foundAd) &&
                    setTheAdOwner(response.data.adOwner)
                  : "";
                // theAd?.foundAd?.appliedUsers?.filter((usr) => usr._id !== appliedUsr._id)
                console.log(response.data);
              }}
              href="#"
            >
              <i className="fa fa-check fa-xl" style={{ color: "blue" }} />
            </a>
          </div>
          <Link
            to={"/profile/" + appliedUsr?._id}
            style={{ textDecoration: "none" }}
            className="sideBar-title h2"
          >
            {appliedUsr?.user_ID}
          </Link>
          <p>{`Name: ${appliedUsr?.user_name}`}</p>
          <p>{`Surname: ${appliedUsr?.user_surname}`}</p>
          <p>{`Gender: ${appliedUsr?.user_gender}`}</p>
          <p>{`Age: ${
            currentYear -
            parseInt(appliedUsr?.user_date_of_birth?.substring(0, 4))
          }`}</p>
          <p>
            <i
              className="fa fa-start fa-lg"
              style={{ fontSize: "1.5em", marginBottom: ".1em" }}
            />{" "}
            <span style={{ fontSize: "1.3em" }}>4,9/5</span>
          </p>
          {loggedInUser?._id !== theAdOwner?._id ? (
            ""
          ) : (
            <div>
              <Button
                style={{ marginBottom: "1em" }}
                onClick={() => makeConversationAndRedirect(appliedUsr?._id)}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </>
    ) : (
      <div></div>
    );
  });
  let borderRadiusConditionalStyle = {};
  let decidingOfAppliedUserRenderFunc =
    loggedInUser?._id === theAdOwner?._id &&
    theRealAd?.appliedUsers?.length > 0 &&
    valueOfIsAdActive;
  if (!decidingOfAppliedUserRenderFunc) {
    borderRadiusConditionalStyle = { borderRadius: "15px 0px 0px 15px;" };
  } else {
    borderRadiusConditionalStyle = {};
  }

  console.log("theRealAd var:", theRealAd);

  let applyButtonDisplayCondition = true;
  if (
    theRealAd?.bannedUsers?.some((item) => item?._id === loggedInUser?._id) ||
    theRealAd?.acceptedUsers?.some((item) => item?._id === loggedInUser?._id)
  ) {
    applyButtonDisplayCondition = false;
  }

  return theRealAd ? (
    <>
      <div className="outerContainer">
        {decidingOfAppliedUserRenderFunc ? (
          <aside class="sideBarAppliedInfo">{appliedUserRenderFunc}</aside>
        ) : (
          ""
        )}

        <div
          style={{
            borderRadius:
              decidingOfAppliedUserRenderFunc === false
                ? "15px 0px 0px 15px"
                : "",
          }}
          className="innerContainer"
        >
          <div className="imageHeaderDescContainer">
            <h2 className="adDetailHeader">{`${theAdOwner?.user_ID}'s ${theRealAd?.city} Tour!`}</h2>
            <div className="containerToHoldImageAndText">
              <img
                className="imgBorder"
                height="250"
                width="250"
                src="https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt=""
              />
              {/* <p>{theAd?.foundAd?.description}</p> */}
              <p className="descText">{theRealAd?.description}</p>
            </div>
            <div
              style={{ justifyContent: "space-between" }}
              className="dateAndTimeDivInAdDetail"
            >
              <p>
                <i
                  className="fa fa-location-dot"
                  style={{ marginRight: ".5em" }}
                />
                {`${theRealAd?.city}`}
              </p>
              <p>
                <i
                  className="fa fa-people-group"
                  style={{ marginRight: ".5em" }}
                />
                {`Max People: ${theRealAd?.maxPeople}`}
              </p>
              <p>
                <i className="fa fa-bed" style={{ marginRight: ".5em" }} />
                Host:{" "}
                {theRealAd?.host === "true" ? "Available" : "Not Available"}
              </p>
              <p>
                <i
                  className="fa fa-hourglass"
                  style={{ marginRight: ".5em" }}
                />
                {`${decideToPutZero(theRealAd?.minTimeHour)}:${decideToPutZero(
                  theRealAd?.minTimeMinute
                )} -  ${decideToPutZero(
                  theRealAd?.maxTimeHour
                )}:${decideToPutZero(theRealAd?.maxTimeMinute)}`}
              </p>
              <p>
                <i
                  className="fa fa-calendar-days"
                  style={{ marginRight: ".5em" }}
                />
                {`${theRealAd?.arriving_date_day?.toString()} ${
                  months[theRealAd?.arriving_date_month - 1]
                } - ${theRealAd?.leaving_date_day?.toString()} ${
                  months[theRealAd?.leaving_date_month - 1]
                }`}
              </p>
              {/* <p style={{marginRight:'3em'}} id='timeTextInAdDetail'>{`From:  ${decideToPutZero(theAd?.foundAd?.minTimeHour)}:${decideToPutZero(theAd?.foundAd?.minTimeMinute)} - To: ${decideToPutZero(theAd?.foundAd?.maxTimeHour)}:${decideToPutZero(theAd?.foundAd?.maxTimeMinute)}`}</p> */}
            </div>
            <hr style={{ marginTop: "3em" }} />

            <div className="acceptedUserContainer">
              {acceptedUserRenderFunc}
            </div>
          </div>
        </div>

        <aside class="sideBarInfo">
          <img
            onClick={() => {
              navigate("/profile/" + theAdOwner?._id);
            }}
            src="https://www.kindpng.com/picc/m/22-223941_transparent-avatar-png-male-avatar-icon-transparent-png.png"
            className="rounded-circle z-depth-0 avatar OwnerAvatar"
            alt="avatar image"
          />
          <div className="sideBarContent">
            <Link
              to={`/profile/${theAdOwner?._id}`}
              style={{ textDecoration: "none" }}
              className="sideBar-title h2"
            >
              {theAdOwner?.user_ID}
            </Link>
            <p>{`Name: ${theAdOwner?.user_name}`}</p>
            <p>{`Surname: ${theAdOwner?.user_surname}`}</p>
            <p>{`Gender: ${theAdOwner?.user_gender}`}</p>
            <p style={{ marginBottom: "1.5em" }}>{`Age: ${
              currentYear -
              parseInt(theAdOwner?.user_date_of_birth?.substring(0, 4))
            }`}</p>
            <p>
              <i
                className="fa fa-star fa-2xl"
                style={{ fontSize: "3em", marginBottom: ".1em" }}
              />{" "}
              <span style={{ fontSize: "2em" }}>4,9/5</span>
            </p>
            {loggedInUser?._id === theAdOwner?._id ? (
              ""
            ) : (
              <div>
                <Button
                  style={{ marginBottom: "1em", marginTop: ".5em" }}
                  onClick={() => makeConversationAndRedirect(theAdOwner?._id)}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send
                </Button>
              </div>
            )}
            {loggedInUser?._id === theAdOwner?._id && valueOfIsAdActive ? (
              <div
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await axios.delete(
                    `http://localhost:5000/api/ad/mypastads/${theRealAd?._id}`,
                    {
                      headers: {
                        Authorization:
                          "Bearer " +
                          (await useAuth.currentUser.getIdToken(true)),
                      },
                    }
                  );
                  if (response.data.message === "ad has been deleted") {
                    console.log(response.data.message);
                    console.log(response.data);
                    setTheAdOwner(response.data.adOwner);
                    setTheRealAd(response.data.message);
                    window.location.assign(
                      `/profile/${response.data.adOwner._id}`
                    );
                  }
                }}
              >
                <button className="btn btn-danger btn-lg">Cancel Ad</button>
              </div>
            ) : (
              ""
            )}

            {loggedInUser?._id !== theAdOwner?._id &&
            applyButtonDisplayCondition ? (
              <div
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await axios.post(
                    `http://localhost:5000/api/ad/searchresult/${theRealAd?._id}/${loggedInUser._id}`,
                    {}
                  );
                  response.data !==
                  "User has already applied for this ad or can't apply for this ad."
                    ? setTheRealAd(response.data.foundAd) &&
                      setTheAdOwner(response.data.adOwner)
                    : "";
                  console.log(response.data);
                  setButtonText("Pending");
                  localStorage.setItem("isAlreadyApplied", "Pending");
                }}
              >
                {applyButtonDisplayCondition ? (
                  <Button
                    style={{ width: "7em" }}
                    variant="contained"
                    color="success"
                  >
                    {localStorage.getItem("isAlreadyApplied") === null
                      ? buttonText
                      : localStorage.getItem("isAlreadyApplied")}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </aside>
      </div>
    </>
  ) : (
    <>
      {" "}
      <h1>The Ad Can not be found, probably deleted</h1>
    </>
  );
};

export default AdDetail;

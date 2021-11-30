import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Container from "@mui/material/Container";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import moment from "moment";
import {
  fetchSlotsByDistric,
  fetchSlotsByPin,
  getDistric,
  getStates,
  loadingSpinner,
} from "../redux/actions/vaccineActions";
import TextField from "@mui/material/TextField";
import {Alert,  Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {datesFromAndTo, dateVal} from "../utils/dateConversions";
import {newTblArr} from "../utils/utills";

export default function Booking() {
  const dispatch = useDispatch();
  const [stateVal, setStateVal] = React.useState("");
  const [errorState, setErrorState] = React.useState(false);
  const [errorDistric, setErrorDistric] = React.useState(false);
  const [tabVal, setTabVal] = React.useState(0);
  const [districVal, setDistricVal] = React.useState("");
  const [totalObj, updateTotalObj] = React.useState({});
  const [slotDates, setSlotDates] = React.useState([]);
  const [DatesForTbl, setDatesForTbl] = React.useState([]);
  const [displayData, setDisplayData] = React.useState([]);
  const [pinError, setPinError] = React.useState(false);
  const [pinValue, setPinValue] = React.useState("");
  const [displayResult, setDisplayResult] = React.useState(false);
  const [filterState, setFilterState] = React.useState({
    feeType: [],
    vaccineType: [],
    ageType: [],
  });
  const str = useSelector((state) => state.vaccineDetails);

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const stateOnChange = (event, obj) => {
    if (!event.target.value) {
      setErrorState(true);
      return;
    }
    setDistricVal("");
    delete totalObj.districObj;
    updateTotalObj({...totalObj, stateObj: obj.props});
    dispatch(getDistric(obj.props.value));
    setStateVal(obj.props.name);
  };

  const errorShow = (e, flag) => {
    if ((flag === "STATE" && e.target.innerText) || stateVal) {
      setErrorState(false);
    } 
    else {
      setErrorState(true);
    }
  };
  const districOnChange = (event, obj) => {
    setErrorDistric(false);
    setDistricVal(obj.props.name);
    updateTotalObj({...totalObj, districObj: obj.props});
  };

  const fetchSlots = () => {
    const stateVal = totalObj?.stateObj?.value;
    const DistricVal = totalObj?.districObj?.value;
    if (!stateVal && !DistricVal) {
      setErrorState(true);
      setErrorDistric(true);
    } else if (!stateVal) {
      setErrorState(true);
    } else if (!DistricVal) {
      setErrorDistric(true);
    } else {
      dispatch(loadingSpinner(true));
      setErrorState(false);
      setErrorDistric(false);
      setSlotDates(datesFromAndTo());
      setDatesForTbl(datesFromAndTo(new Date(), "DD-MM-YYYY"));
      dispatch(fetchSlotsByDistric(DistricVal, dateVal()));
      setDisplayResult(true);
    }
  };
  const fetchSlotsBypin = () => {
    if (pinValue && !pinError) {
      setSlotDates(datesFromAndTo());
      setDatesForTbl(datesFromAndTo(new Date(), "DD-MM-YYYY"));
      dispatch(fetchSlotsByPin(pinValue, dateVal()));
      setDisplayResult(true);
    } else {
      setPinError(true);
    }
  };
  const onChangePin = (e) => {
    if (e.target.value.length === 6) {
      setPinValue(e.target.value);
      setPinError(false);
    } else {
      setPinError(true);
      setPinValue("");
    }
  };
  const getNavResults = (flag) => {
    let dt;
    if (flag) {
      dt = moment(slotDates[flag], "D MMM YY").add(1, "d");
      setSlotDates(datesFromAndTo(dt));
      setDatesForTbl(datesFromAndTo(dt, "DD-MM-YYYY"));
      setDisplayResult(true);
      if (tabVal) {
        dispatch(fetchSlotsByPin(pinValue, dt.format("DD/MM/YYYY")));
      } else {
        dispatch(
          fetchSlotsByDistric(totalObj?.districObj?.value, dt.format("DD/MM/YYYY"))
        );
      }
    } else {
      dt = moment(slotDates[flag], "D MMM YY").subtract(7, "d");
      if (!moment(slotDates[0], "D MMM YY").isSame(moment(), "day")) {
        setDisplayResult(true);
        setSlotDates(datesFromAndTo(dt));
        setDatesForTbl(datesFromAndTo(dt, "DD-MM-YYYY"));
        if (tabVal) {
          dispatch(fetchSlotsByPin(pinValue, dt.format("DD/MM/YYYY")));
        } else {
          dispatch(
            fetchSlotsByDistric(totalObj?.districObj?.value, dt.format("DD/MM/YYYY"))
          );
        }

      }
    }
  };
  useEffect(() => {
    setSlotDates(datesFromAndTo());
    dispatch(loadingSpinner(true));
    dispatch(getStates());
  }, []);
  useEffect(() => {
    setDisplayData(str.resultByDistric);
  }, [str]);
  const setFilters = (type, val) => {
    let retunObj = {...filterState};
    if (type == "feeType") {
      retunObj.feeType.push(val);
    }
    if (type == "vaccineType") {
      retunObj.vaccineType.push(val);
    }
    //console.log("filterState", filterState);
    //setFilterState(retunObj);
  };
  useEffect(async () => {
    //console.log(str.apiData);
    const apiData = str.apiData;
    if (filterState.feeType.length > 0 || filterState.vaccineType.length > 0) {
      let filteredCenteres = [];
      if (filterState.feeType.length > 0) {
        filteredCenteres = apiData.centers.filter((item) => {
          return filterState.feeType.includes(item.fee_type);
        });
      } else {
        filteredCenteres = [...apiData.centers];
      }
      const filteredData = [...filteredCenteres];
      if (filterState.vaccineType.length > 0) {
        filteredCenteres.forEach((item, i) => {
          filteredData[i].sessions = item.sessions.filter((item2) => {
            return filterState.vaccineType.includes(item2.vaccine);
          });
        });
      }

      const responsObj = await newTblArr({centers: filteredData}, dateVal());
      //console.log("responsObj", responsObj.filterData);
      setDisplayData(responsObj.filterData);
    }
  }, [filterState]);

  useEffect(() => {
    if (displayResult) {
      /* setStateVal("");
      setDistricVal("");
      setPinValue(""); */
      setDisplayResult(false);
    }
  }, [stateVal, districVal, pinValue, tabVal]);
  //console.log("displayData", displayData);
  return (
    <div>
      <Container maxWidth="md">
        <Box component="span" sx={{display: "block"}}>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            sx={{textAlign: "center"}}
          >
            Search Your Nearest Vaccination Center
          </Typography> 
        </Box>
        <Box className="marTB25" sx={{width: "100%", bgcolor: "background.paper"}}>
          <Tabs className="marTB15" value={tabVal} onChange={handleChange} centered>
            <Tab className="serTb" label="By District" />
            <Tab className="serTb" label="By PIN" />
          </Tabs>
          <div
            style={{display: tabVal === 0 ? "flex" : "none", justifyContent: "center"}}
            hidden={tabVal !== 0}
          >
            <FormControl sx={{m: 1, minWidth: 300}} error={errorState}>
              <InputLabel id="select-state">Select State</InputLabel>
              <Select
                labelId="select-state"
                id="select-state"
                value={stateVal}
                label="Select States"
                displayEmpty={false}
                onChange={(e, o) => {
                  stateOnChange(e, o);
                }}
                onClose={(e) => {
                  errorShow(e, "STATE");
                }}
                renderValue={(stateVal) => {
                  return stateVal;
                }}
              >
                {str.statesObj &&
                  str.statesObj.states.map((ele, index) => (
                    <MenuItem key={index} name={ele.state_name} value={ele.state_id}>
                      {ele.state_name}
                    </MenuItem>
                  ))}
              </Select>
              {errorState && <FormHelperText>Please select state</FormHelperText>}
            </FormControl>
            <FormControl
              error={errorDistric}
              className="err-dist"
              sx={{m: 1, minWidth: 300}}
              disabled={str.districObj && str.districObj.districts ? false : true}
            >
              <InputLabel id="select-distric">Select Distric</InputLabel>
              <Select
                labelId="select-distric"
                id="select-distric"
                value={districVal}
                label="Select Distric"
                displayEmpty={false}
                onChange={(e, o) => {
                  districOnChange(e, o);
                }}
                renderValue={(districVal) => {
                  return districVal;
                }}
              >
                {str.districObj &&
                  str.districObj.districts.map((ele, index) => (
                    <MenuItem
                      key={index}
                      name={ele.district_name}
                      value={ele.district_id}
                    >
                      {ele.district_name}
                    </MenuItem>
                  ))}
              </Select>
              {errorDistric && <FormHelperText>Please select distric</FormHelperText>}
            </FormControl>
            <div>
              <Button
                variant="contained"
                sx={{margin: "8px", height: "55px"}}
                size="large"
                onClick={fetchSlots}
              >
                Search
              </Button>
            </div>
          </div>
        </Box>
      </Container>
      <Container
        maxWidth="sm"
        sx={{display: tabVal === 1 ? "flex" : "none", justifyContent: "center"}}
      >
        <FormControl sx={{m: 1, minWidth: 300}}>
          <TextField
            error={pinError}
            helperText={pinError ? "Please enter valid pincode" : ""}
            id="demo-helper-text-misaligned-no-helper"
            label="PIN"
            type="number"
            onChange={(e) => onChangePin(e)}
            inputProps={{inputMode: "numeric", pattern: "[0-9]*"}}
          />
        </FormControl>
        <div>
          <Button
            variant="contained"
            sx={{margin: "8px", height: "55px"}}
            size="large"
            onClick={fetchSlotsBypin}
          >
            Search
          </Button>
        </div>
      </Container>
      {displayResult && (
        <Container maxWidth="lg">
          <div sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            .
            <Typography variant="h6" gutterBottom component="div">
              Slot Search Results :{" "}
              {displayData?.centers?.length ? displayData?.centers?.length : 0} Center(s)
              Found
            </Typography>
          </div>

          <div>
            <Box
              display="grid"
              gridAutoFlow="row"
              gridTemplateColumns="repeat(12, 0.5fr)"
              sx={{whiteSpace: "nowrap"}}
              gap={0.5}
              className="marTB15"
            >
              <Box
                gridColumn="span 2"
                sx={{display: "flex", alignItems: "center", justifyContent: "left"}}
              >
                Filter results by:
              </Box>
              <Box gridColumn="span 4">
                <p>Age:</p>
                <Stack spacing={0.5} direction={{lg: "row", md: "column", xs: "column"}}>
                  <Button variant="outlined" size="small">
                    18 & Above
                  </Button>
                  <Button variant="outlined" size="small">
                    18-44 Only
                  </Button>
                  <Button variant="outlined" size="small">
                    45 & Above
                  </Button>
                </Stack>
              </Box>
              <Box gridColumn="span 2">
                <p>Cost : </p>
                <Stack spacing={0.5} direction={{lg: "row", md: "column", xs: "column"}}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters("feeType", "Paid")}
                  >
                    Paid
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters("feeType", "Free")}
                  >
                    Free
                  </Button>
                </Stack>
              </Box>
              <Box gridColumn="span 4">
                <p>Vaccine : </p>
                <Stack spacing={0.5} direction={{lg: "row", md: "column", xs: "column"}}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters("vaccineType", "COVISHIELD")}
                  >
                    Covishield
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters("vaccineType", "COVAXIN")}
                  >
                    Covaxin
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setFilters("vaccineType", "SPUTNIK V")}
                  >
                    Sputnik V
                  </Button>
                </Stack>
              </Box>
            </Box>
          </div>
          <div>
            <Alert severity="info" sx={{alignItems: "center"}}>
              <ul>
                <li>
                  lots are updated by state vaccination centers and private hospitals
                  everyday at 8AM, 12PM, 4PM, & 8PM.{" "}
                </li>
                <li>
                  Walk-in availableat all vaccination centers for age 18 years and above
                  (For timings for walk-in vaccinations, please contact the vaccine
                  center.)
                </li>
                <li>
                  <span>D1 - Vaccine Dose #1</span>
                  <span style={{padding: "0px 15px "}}>D2 - Vaccine Dose #2</span>
                </li>
              </ul>
            </Alert>
          </div>
          <div>
            <div className="marTB25">
              <Grid container spacing={1}>
                <Grid item xs={3} md={3}>
                  <p></p>
                </Grid>
                <Grid item xs={9} md={9}>
                  <span>
                    {" "}
                    <KeyboardArrowLeftIcon onClick={() => getNavResults(0)} />{" "}
                  </span>
                  <Stack
                    spacing={1}
                    display="inline-block"
                    direction={{lg: "row", md: "column", xs: "column"}}
                  >
                    {slotDates &&
                      slotDates.map((ele, index) => (
                        <Button
                          size="small"
                          sx={{minWidth: "100px", maxWidth: "100px"}}
                          key={index}
                          variant="outlined"
                        >
                          {" "}
                          {ele}{" "}
                        </Button>
                      ))}
                  </Stack>
                  <span>
                    <KeyboardArrowRightIcon onClick={() => getNavResults(6)} />
                  </span>
                </Grid>
              </Grid>
            </div>
            {displayData?.centers && (
              <div
                className="marTB25"
                style={{overflowY: "scroll", overflowX: "hidden", maxHeight: "500px"}}
              >
                {displayData &&
                  displayData?.centers.map((e, i) => (
                    <Grid key={i} container spacing={2} sx={{margin: "10px 0px"}}>
                      <Grid item xs={3} md={3}>
                        {/* <span> {e.name} </span>
                <p>{e.block_name},{e.district_name} ,{e.state_name} ,{e.pincode}</p> */}
                        <div className="m_dose-title">
                          <h5>
                            {" "}
                            {e.name} <span className="m_paidButton">{e.fee_type}</span>
                          </h5>
                          <p className="m_dose-subTitle">
                            {" "}
                            {e.block_name},{e.district_name} ,{e.state_name} ,{e.pincode}
                          </p>
                        </div>
                        {e?.vaccine_fees?.map((vax, vaxIn) => (
                          <span key={vaxIn}>
                            {vax.vaccine}: {vax.fee}{" "}
                          </span>
                        ))}
                      </Grid>
                      <Grid item xs={9} md={9} sx={{margin: "10px 0px"}}>
                        <Stack
                          spacing={1}
                          sx={{paddingLeft: "15px"}}
                          direction={{lg: "row", md: "column", xs: "column"}}
                        >
                          {DatesForTbl.map((dt, dio) => (
                            <Button
                              className="vaccine-slots"
                              size="small"
                              sx={{
                                border: "none",
                                display: "unset",
                                minWidth: "100px",
                                maxWidth: "100px",
                                margin: "3px 0px",
                                padding: "0px",
                              }}
                              variant="outlined"
                              key={dio}
                            >
                              {e.our_sessions[dt]?.length
                                ? e?.our_sessions[dt]?.map((mo, mi) => (
                                    <span
                                      key={mi}
                                      style={{
                                        minWidth: 50,
                                        display: "block",
                                        margin: "3px 0px",
                                      }}
                                    >
                                      <p key={mi}>
                                        <b>{mo.vaccine}</b>{" "}
                                      </p>
                                      {/* <p> <span> D1:{mo.available_capacity_dose1} </span>
                        <span> {mo.available_capacity} </span>
                        <span> D2:{mo.available_capacity_dose2}</span>
                        </p> */}
                                      <div className="m_Dosecount">
                                        <div className="m_dosetotal">
                                          <span title="Dose 1">
                                            <p>D1 </p> 49{" "}
                                          </span>
                                          <a className="m_totalslts" rel="noreferrer">
                                            {" "}
                                            99{" "}
                                          </a>
                                          <span title="Dose 2">
                                            <p>D2 </p> 50{" "}
                                          </span>
                                        </div>
                                      </div>
                                      {!mo.available_capacity && (
                                        <p>
                                          <b style={{color: "red"}}>Booked</b>
                                        </p>
                                      )}
                                    </span>
                                  ))
                                : "N/A"}
                              {/* {e.our_stsessions[dt]?"":"N/A"} */}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  ))}
              </div>
            )}

            <div>
              .
              <Typography
                variant="h6"
                sx={{textAlign: "center", height: "60px"}}
                gutterBottom
                component="div"
              >
                {!displayData || displayData?.centers?.length == 0
                  ? "No Data Available"
                  : null}
              </Typography>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

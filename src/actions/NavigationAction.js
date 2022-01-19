export const ON_PRESS_DASHBORD = "navigationReducer/ON_PRESS_DASHBORD";
export const ON_PRESS_DASHBORD_CHILD =
  "navigationReducer/ON_PRESS_DASHBORD_CHILD";
export const ON_PRESS_THEME_COLOR = "navigationReducer/ON_PRESS_THEME_COLOR";
export const ON_PRESS_GENERAL_SETTING =
  "navigationReducer/ON_PRESS_GENERAL_SETTING";
export const ON_PRESS_NOTIFICATION = "navigationReducer/ON_PRESS_NOTIFICATION";
export const ON_PRESS_EQUALIZER = "navigationReducer/ON_PRESS_EQUALIZER";
export const ON_PRESS_MENU_PROFILE_DROPDOWN =
  "navigationReducer/ON_PRESS_MENU_PROFILE_DROPDOWN";
export const ON_PRESS_SIDE_MENU_TOGGLE =
  "navigationReducer/ON_PRESS_SIDE_MENU_TOGGLE";
export const ON_PRESS_SIDE_MENU_TAB =
  "navigationReducer/ON_PRESS_SIDE_MENU_TAB";
export const TOGGLE_MENU_ARROW = "navigationReducer/TOGGLE_MENU_ARROW";
export const TOAST_MESSAGE_LOAD = "navigationReducer/TOAST_MESSAGE_LOAD";
export const UPDATE_USERID = "navigationReducer/UPDATE_USERID";
export const UPDATE_PLATFORM = "navigationReducer/UPDATE_PLATFORM";
export const UPDATE_CLIENTID = "navigationReducer/UPDATE_CLIENTID";
export const UPDATE_STUDENTID = "navigationReducer/UPDATE_STUDENTID";
export const UPDATE_CLIENTNAME = "navigationReducer/UPDATE_CLIENTNAME";
export const UPDATE_CLIENTLOGO = "navigationReducer/UPDATE_CLIENTLOGO";

export const ON_UPDATE_PROGRESS_BAR = "navigationReducer/ON_UPDATE_PROGRESS_BAR";
export const ON_STUDENT_RUBIX_ID = "navigationReducer/ON_STUDENT_RUBIX_ID";
export const UPDATE_STUDENT_NAME = "navigationReducer/UPDATE_STUDENT_NAME";
export const UPDATE_NOK_NAME = "navigationReducer/UPDATE_NOK_NAME";
export const UPDATE_NOK_ID = "navigationReducer/UPDATE_NOK_ID";

export const UPDATE_STUDENT_ADDRESS = "navigationReducer/UPDATE_STUDENT_ADDRESS";
export const UPDATE_STUDENT_UNIVERRSITY = "navigationReducer/UPDATE_STUDENT_UNIVERRSITY";
export const UPDATE_STUDENT_COURSE = "navigationReducer/UPDATE_STUDENT_COURSE";
export const UPDATE_STUDENT_YEAR_OF_STUDY = "navigationReducer/UPDATE_STUDENT_YEAR_OF_STUDY";
export const UPDATE_STUDENT_STUDENT_NO = "navigationReducer/UPDATE_STUDENT_STUDENT_NO";

export const UPDATE_DOC_ID = "navigationReducer/UPDATE_DOC_ID";

export const ON_NOK_PROGRESS = "navigationReducer/ON_NOK_PROGRESS";
export const ON_REG_PROGRESS = "navigationReducer/ON_REG_PROGRESS";
export const ON_RES_PROGRESS = "navigationReducer/ON_RES_PROGRESS";
export const ON_ID_PROGRESS = "navigationReducer/ON_ID_PROGRESS";

var toggle = false;
var intervalId = "";
export const onPressDashbord = (index) => (dispatch) => {
  dispatch({
    type: ON_PRESS_DASHBORD,
    payload: index,
  });
};

export const onPressDashbordChild = (index, perent) => (dispatch) => {
  dispatch({
    type: ON_PRESS_DASHBORD_CHILD,
    payload: { index, perent },
  });
  toggle = !toggle;
  document.body.classList.remove("offcanvas-active");
};

export const onPressThemeColor = (color) => (dispatch) => {
  dispatch({
    type: ON_PRESS_THEME_COLOR,
    payload: "theme-" + color,
  });
};

export const onPressGeneralSetting = (index) => (dispatch) => {
  dispatch({
    type: ON_PRESS_GENERAL_SETTING,
    payload: index,
  });
};

export const onPressNotification = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_NOTIFICATION,
  });
  toggle = !toggle;
  document.body.classList.remove("offcanvas-active");
};

export const onPressEqualizer = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_EQUALIZER,
  });
  toggle = !toggle;
  document.body.classList.remove("offcanvas-active");
};

export const onPressSideMenuToggle = () => (dispatch) => {
  toggle = !toggle;
  if (toggle) {
    document.body.classList.add("offcanvas-active");
  } else {
    document.body.classList.remove("offcanvas-active");
  }
  dispatch({
    type: ON_PRESS_SIDE_MENU_TOGGLE,
  });
};

export const onPressMenuProfileDropdown = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_MENU_PROFILE_DROPDOWN,
  });
};

export const onPressSideMenuTab = (index) => (dispatch) => {
  dispatch({
    type: ON_PRESS_SIDE_MENU_TAB,
    payload: index,
  });
};

export const toggleMenuArrow = () => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_MENU_ARROW,
  });
  const { menuArrowToggle } = getState().navigationReducer;
  if (menuArrowToggle) {
    document.body.classList.add("layout-fullwidth");
  } else {
    document.body.classList.remove("layout-fullwidth");
  }
};

export const tostMessageLoad = (val) => (dispatch, getState) => {
  dispatch({
    type: TOAST_MESSAGE_LOAD,
    payload: val,
  });
};

export const updateUserID = (val)=>(disptch) =>{
  //console.log("Dispatch action is called with value ", val);
  // alert("Hello Monkey");
  disptch({
    type:UPDATE_USERID,
    payload: val,
  })
};

export const updatePlatformID = (val)=>(disptch) =>{
  //console.log("Dispatch action is called with value ", val);
  // alert("Hello Monkey");
  disptch({
    type:UPDATE_PLATFORM,
    payload: val,
  })
};

export const updateClientID = (val)=>(disptch) =>{
  //console.log("Dispatch action is called with value ", val);
  // alert("Hello Monkey");
  disptch({
    type:UPDATE_CLIENTID,
    payload: val,
  })
};

export const onUpdateProgressBar = (val) => (dispatch) => {
  dispatch({
    type: ON_UPDATE_PROGRESS_BAR,
    payload: val,
  });
};

export const onUpdateStudentRubixID = (val) => (dispatch) => {
  dispatch({
    type: ON_STUDENT_RUBIX_ID,
    payload: val,
  });
};

//Next of Kin Progress Update
export const onUpdateNOKProgress = (val) => (dispatch) => {
  dispatch({
    type: ON_NOK_PROGRESS,
    payload: val,
  });
};
//Proof of Registration Update
export const onUpdateREGProgress = (val) => (dispatch) => {
  dispatch({
    type: ON_REG_PROGRESS,
    payload: val,
  });
};


//Proof of Residence Update
export const onUpdateRESProgress = (val) => (dispatch) => {
  dispatch({
    type: ON_RES_PROGRESS,
    payload: val,
  });
};


//ID Document Update
export const onUpdateIDProgress = (val) => (dispatch) => {
  dispatch({
    type: ON_ID_PROGRESS,
    payload: val,
  });
};

//Update Student ID
export const updateStudentID = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENTID,
    payload: val,
  })
};

//Update Student Name
export const updateStudentName = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_NAME,
    payload: val,
  })
};

//Update Student's Physical Address
export const updateStudentAddress = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_ADDRESS,
    payload: val,
  })
};

//Update Student's University
export const updateStudentUniversity = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_UNIVERRSITY,
    payload: val,
  })
};

//Update Student's University
export const updateStudentStudentNo = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_STUDENT_NO,
    payload: val,
  })
};


//Update Student's Course
export const updateStudentCourse = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_COURSE,
    payload: val,
  })
};



//Update Student's Year of Study
export const updateStudentYear = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_STUDENT_YEAR_OF_STUDY,
    payload: val,
  })
};


//Update Next of Kin Name
export const updateNOKName = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_NOK_NAME,
    payload: val,
  })
};


//Update Next of Kin ID
export const updateNOKID = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_NOK_ID,
    payload: val,
  })
};

//Update Next of Kin ID
export const updateDocID = (val)=>(disptch) =>{
  disptch({
    type:UPDATE_DOC_ID,
    payload: val,
  })
};


//Update Client Name
export const updateClientName = (val)=>(disptch) =>{
  //console.log("Dispatch action is called with value ", val);
  // alert("Hello Monkey");
  disptch({
    type:UPDATE_CLIENTNAME,
    payload: val,
  })
};

//Update Client Logo
export const updateClientLogo = (val)=>(disptch) =>{
  //console.log("Dispatch action is called with value ", val);
  // alert("Hello Monkey");
  disptch({
    type:UPDATE_CLIENTLOGO,
    payload: val,
  })
};

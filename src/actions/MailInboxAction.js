export const ON_PRESS_TAG_DROPDOWN = "mailInboxReducer/ON_PRESS_TAG_DROPDOWN";
export const ON_PRESS_MORE_DROPDOWN = "mailInboxReducer/ON_PRESS_MORE_DROPDOWN";
export const ON_PRESS_COMPOSE = "mailInboxReducer/ON_PRESS_COMPOSE";
export const ON_PRESS_ADD_EVENT = "mailInboxReducer/ON_PRESS_ADD_EVENT";
export const ON_PRESS_ADD_CONTACT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_POP_UP_EVENT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_SHOW_PROFILE = "mailInboxReducer/ON_PRESS_SHOW_PROFILE";
export const ON_PRESS_SHOW_ROOMS = "mailInboxReducer/ON_PRESS_SHOW_ROOMS";
export const ON_PRESS_SHOW_LEASE = "mailInboxReducer/ON_PRESS_SHOW_LEASE";

export const ON_PRESS_POP_UP_CONFIRMATION = "mailInboxReducer/ON_PRESS_POP_UP_CONFIRMATION";
export const ON_PRESS_POP_UP_CONFIRMATION_LEASE_UPDATE = "mailInboxReducer/ON_PRESS_POP_UP_CONFIRMATION_LEASE_UPDATE";
export const ON_PRESS_POP_UP_CONFIRMATION_SUPPORT = "mailInboxReducer/ON_PRESS_POP_UP_CONFIRMATION_SUPPORT";
export const ON_PRESS_POP_UP_CONFIRMATION_MASS_LEASE_UPDATE = "mailInboxReducer/ON_PRESS_POP_UP_CONFIRMATION_MASS_LEASE_UPDATE";
export const ON_PRESS_POP_UP_ASSIGN_ROOM = "mailInboxReducer/ON_PRESS_POP_UP_ASSIGN_ROOM";
export const ON_PRESS_POP_CONFIRM_INFO = "mailInboxReducer/ON_PRESS_POP_CONFIRM_INFO";
export const ON_PRESS_POP_REQUEST = "mailInboxReducer/ON_PRESS_POP_REQUEST";
export const UPDATE_VARSITY_INFO = "mailInboxReducer/UPDATE_VARSITY_INFO";
export const ON_PRESS_POP_UP_REMOVE_ROOM = "mailInboxReducer/ON_PRESS_POP_UP_REMOVE_ROOM";
export const ON_PRESS_POP_UP_VERIFY_USER = "mailInboxReducer/ON_PRESS_POP_UP_VERIFY_USER";

export const ON_PRESS_POP_UP_NOTICE = "mailInboxReducer/ON_PRESS_POP_UP_NOTICE";
export const ON_CHANGE_LOADER = "mailInboxReducer/ON_CHANGE_LOADER";
export const SHOW_LEASE = "mailInboxReducer/SHOW_LEASE";

export const onPressTagDropdown = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_TAG_DROPDOWN,
  });
};

export const onPressMoreDropdown = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_MORE_DROPDOWN,
  });
};
export const onPressCompose = (val) => (dispatch) => {
  dispatch({
    type: ON_PRESS_COMPOSE,
    payload: val,
  });
};

export const onPresAddEvent = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_ADD_EVENT,
  });
};

//Toggle Pop Up Add New Notice
export const onPresPopNewNotice = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_NOTICE,
  });
};

//Toggle Pop Up Event Modal
export const onPresPopUpEvent = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_EVENT,
  });
};


//Toggle Pop Up Confirm Modal
export const onPresPopUpConfirm = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_CONFIRMATION,
  });
};

//Toggle Pop Up Confirm Modal
export const onPresPopUpConfirmLeaseUpdate = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_CONFIRMATION_LEASE_UPDATE,
  });
};
//Toggle Pop Up Confirm Modal
export const onPresPopUpConfirmSupport = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_CONFIRMATION_SUPPORT,
  });
};

//Toggle Pop Up Verify Student
export const onPresPopVerify = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_VERIFY_USER,
  });
};


//Toggle Pop Up Confirm Modal
export const onPresPopUpConfirmMassLeaseUpdate = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_CONFIRMATION_MASS_LEASE_UPDATE,
  });
};


//Toggle Pop Up Assign Room
export const onPresPopUpAssign = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_ASSIGN_ROOM,
  });
};

//Toggle Pop Up Assign Room
export const onPresPopConfirmInfo = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_CONFIRM_INFO,
  });
};
//Toggle Pop Up Assign Room
export const onPresPopConfirmReq = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_REQUEST,
  });
};

//Toggle Pop Up Assign Room
export const onUpdateVarsity = () => (dispatch) => {
  dispatch({
    type: UPDATE_VARSITY_INFO,
  });
};


//Toggle Pop Up Remove Room
export const onPresPopUpRemove = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_REMOVE_ROOM,
  });
};

//Toggle Show Profile Tab
export const onPresShowProfile = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_SHOW_PROFILE,
  });
};

//Toggle Show Rooms Tab
export const onPresRooms = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_SHOW_ROOMS,
  });
};


//Toggle Show Lease Tab
export const onPresLease = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_SHOW_LEASE,
  });
};

//Toggle Show Loading Screen
export const onChangeLoader = () => (dispatch) => {
  dispatch({
    type: ON_CHANGE_LOADER,
  });
};

//Toggle Show Lease Ammend
export const onToggleLeaseAmmend = () => (dispatch) => {
  dispatch({
    type: SHOW_LEASE,
  });
};


export const onPressAddContact = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_ADD_CONTACT,
  });
};

export const onLeave = (data) => (dispatch) => {
  //console.error(data);
};

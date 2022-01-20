export const ON_PRESS_TAG_DROPDOWN = "mailInboxReducer/ON_PRESS_TAG_DROPDOWN";
export const ON_PRESS_MORE_DROPDOWN = "mailInboxReducer/ON_PRESS_MORE_DROPDOWN";
export const ON_PRESS_COMPOSE = "mailInboxReducer/ON_PRESS_COMPOSE";
export const ON_PRESS_ADD_EVENT = "mailInboxReducer/ON_PRESS_ADD_EVENT";
export const ON_PRESS_ADD_CONTACT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_POP_UP_EVENT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_SHOW_PROFILE = "mailInboxReducer/ON_PRESS_SHOW_PROFILE";
export const ON_PRESS_SHOW_ROOMS = "mailInboxReducer/ON_PRESS_SHOW_ROOMS";

export const ON_PRESS_POP_UP_CONFIRMATION = "mailInboxReducer/ON_PRESS_POP_UP_CONFIRMATION";
export const ON_PRESS_POP_UP_ASSIGN_ROOM = "mailInboxReducer/ON_PRESS_POP_UP_ASSIGN_ROOM";

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


//Toggle Pop Up Assign Room
export const onPresPopUpAssign = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_POP_UP_ASSIGN_ROOM,
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


export const onPressAddContact = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_ADD_CONTACT,
  });
};

export const onLeave = (data) => (dispatch) => {
  console.error(data);
};

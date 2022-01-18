export const ON_PRESS_TAG_DROPDOWN = "mailInboxReducer/ON_PRESS_TAG_DROPDOWN";
export const ON_PRESS_MORE_DROPDOWN = "mailInboxReducer/ON_PRESS_MORE_DROPDOWN";
export const ON_PRESS_COMPOSE = "mailInboxReducer/ON_PRESS_COMPOSE";
export const ON_PRESS_ADD_EVENT = "mailInboxReducer/ON_PRESS_ADD_EVENT";
export const ON_PRESS_ADD_CONTACT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_POP_UP_EVENT = "mailInboxReducer/ON_PRESS_ADD_CONTACT";
export const ON_PRESS_SHOW_PROFILE = "mailInboxReducer/ON_PRESS_SHOW_PROFILE";

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

export const onPresShowProfile = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_SHOW_PROFILE,
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

import {
  ON_PRESS_TAG_DROPDOWN,
  ON_PRESS_MORE_DROPDOWN,
  ON_PRESS_COMPOSE,
  ON_PRESS_ADD_EVENT,
  ON_PRESS_ADD_CONTACT,
  ON_PRESS_POP_UP_EVENT,
  ON_PRESS_SHOW_PROFILE,
  ON_PRESS_POP_UP_CONFIRMATION,
} from "../actions/MailInboxAction";

const initialState = {
  isTagDropDown: false,
  isMoreDropDown: false,
  isInbox: true,
  isEventModal: false,
  isPopUpModal: false,
  isPopUpConfirm: false,
  isContactModal: false,
  isProfileShowing: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_PRESS_TAG_DROPDOWN: {
      return {
        ...state,
        isTagDropDown: !state.isTagDropDown,
        isMoreDropDown: false,
      };
    }

    case ON_PRESS_MORE_DROPDOWN: {
      return {
        ...state,
        isMoreDropDown: !state.isMoreDropDown,
        isTagDropDown: false,
      };
    }

    case ON_PRESS_COMPOSE: {
      return {
        ...state,
        isInbox: action.payload,
      };
    }

    case ON_PRESS_ADD_EVENT: {
      return {
        ...state,
        isEventModal: !state.isEventModal,
      };
    }

    case ON_PRESS_POP_UP_EVENT: {
      return {
        ...state,
        isPopUpModal: !state.isPopUpModal,
      };
    }

    case ON_PRESS_POP_UP_CONFIRMATION: {
      return {
        ...state,
        isPopUpConfirm: !state.isPopUpConfirm,
      };
    }


    case ON_PRESS_ADD_CONTACT: {
      return {
        ...state,
        isContactModal: !state.isContactModal,
      };
    }

    case ON_PRESS_SHOW_PROFILE: {
      return {
        ...state,
        isProfileShowing: !state.isProfileShowing,
      };
    }

    default:
      return state;
  }
};

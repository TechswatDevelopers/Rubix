import {
  ON_PRESS_TAG_DROPDOWN,
  ON_PRESS_MORE_DROPDOWN,
  ON_PRESS_COMPOSE,
  ON_PRESS_ADD_EVENT,
  ON_PRESS_POP_UP_NOTICE,
  ON_PRESS_ADD_CONTACT,
  ON_PRESS_POP_UP_EVENT,
  ON_PRESS_SHOW_PROFILE,
  ON_PRESS_POP_UP_CONFIRMATION,
  ON_PRESS_POP_UP_CONFIRMATION_LEASE_UPDATE,
  ON_PRESS_POP_UP_CONFIRMATION_SUPPORT,
  ON_PRESS_POP_UP_CONFIRMATION_MASS_LEASE_UPDATE,
  ON_PRESS_SHOW_ROOMS,
  ON_PRESS_SHOW_LEASE,
  ON_PRESS_POP_UP_VERIFY_USER,
  SHOW_LEASE,
  ON_PRESS_POP_UP_ASSIGN_ROOM,
  ON_PRESS_POP_CONFIRM_INFO,
  ON_PRESS_POP_REQUEST,
  UPDATE_VARSITY_INFO,
  ON_PRESS_POP_UP_REMOVE_ROOM,
  ON_CHANGE_LOADER,
} from "../actions/MailInboxAction";

const initialState = {
  isTagDropDown: false,
  isMoreDropDown: false,
  isInbox: true,
  isEventModal: false,
  isPopUpModal: false,
  isPopUpConfirm: false,
  isPopUpConfirmSupport: false,
  isPopUpConfirmLeaseUpdate: false,
  isPopUpConfirmMassLeaseUpdate: false,
  isContactModal: false,
  isProfileShowing: false,
  isRoomshowing: false,
  isShowAssignModal: false,
  isShowConfirmInfo: false,
  isShowConfirmReq: false,
  isShowVarsityPopUp: false,
  isAmmendLease: false,
  isShowRemoveModal: false,
  isPopUpNewNotice: false,
  isShowLease: false,
  isShowLoader: false,
  isShowVerifyModal: false,
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

    case ON_PRESS_POP_UP_NOTICE: {
      return {
        ...state,
        isPopUpNewNotice: !state.isPopUpNewNotice,
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

    case ON_PRESS_POP_UP_CONFIRMATION_LEASE_UPDATE: {
      return {
        ...state,
        isPopUpConfirmLeaseUpdate: !state.isPopUpConfirmLeaseUpdate,
      };
    }

    case ON_PRESS_POP_UP_CONFIRMATION_MASS_LEASE_UPDATE: {
      return {
        ...state,
        isPopUpConfirmMassLeaseUpdate: !state.isPopUpConfirmMassLeaseUpdate,
      };
    }

    case ON_PRESS_POP_UP_CONFIRMATION_SUPPORT: {
      return {
        ...state,
        isPopUpConfirmSupport: !state.isPopUpConfirmSupport,
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
    

//Toggle Show Rooms
    case ON_PRESS_SHOW_ROOMS: {
      return {
        ...state,
        isRoomshowing: !state.isRoomshowing,
      };
    }

    //Toggle Show Rooms
    case ON_PRESS_SHOW_LEASE: {
      return {
        ...state,
        isShowLease: !state.isShowLease,
      };
    }

    //Toggle Show Rooms
    case ON_CHANGE_LOADER: {
      return {
        ...state,
        isShowLoader: !state.isShowLoader,
      };
    }

//Toggle Remove Rooms
    case ON_PRESS_POP_UP_REMOVE_ROOM: {
      return {
        ...state,
        isShowRemoveModal: !state.isShowRemoveModal,
      };
    }

//Toggle Assign Room Modal
    case ON_PRESS_POP_UP_ASSIGN_ROOM: {
      return {
        ...state,
        isShowAssignModal: !state.isShowAssignModal,
      };
    }

//Toggle Info Submit
    case ON_PRESS_POP_CONFIRM_INFO: {
      return {
        ...state,
        isShowConfirmInfo: !state.isShowConfirmInfo,
      };
    }

    
//Toggle 
case ON_PRESS_POP_REQUEST: {
  return {
    ...state,
    isShowConfirmReq: !state.isShowConfirmReq,
  };
}
//Toggle Verify User Modal
case ON_PRESS_POP_UP_VERIFY_USER: {
  return {
    ...state,
    isShowVerifyModal: !state.isShowVerifyModal,
  };
}

//Toggle Edit Vasrity Information
    case UPDATE_VARSITY_INFO: {
      return {
        ...state,
        isShowVarsityPopUp: !state.isShowVarsityPopUp,
      };
    }

//Toggle Show Pop Up
    case SHOW_LEASE: {
      return {
        ...state,
        isAmmendLease: !state.isAmmendLease,
      };
    }

    default:
      return state;
  }
};

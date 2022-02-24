import {
  ON_PRESS_DASHBORD,
  ON_PRESS_DASHBORD_CHILD,
  ON_PRESS_THEME_COLOR,
  ON_PRESS_GENERAL_SETTING,
  ON_PRESS_NOTIFICATION,
  ON_PRESS_EQUALIZER,
  ON_PRESS_MENU_PROFILE_DROPDOWN,
  ON_PRESS_SIDE_MENU_TOGGLE,
  ON_PRESS_SIDE_MENU_TAB,
  TOGGLE_MENU_ARROW,
  TOAST_MESSAGE_LOAD,
  UPDATE_USERID,
  UPDATE_PLATFORM,
  UPDATE_CLIENTID,
  UPDATE_CLIENTNAME,
  UPDATE_CLIENTLOGO,
  UPDATE_STUDENTID,
  UPDATE_NOK_ID,
  UPDATE_NOK_NAME,
  UPDATE_STUDENT_NAME,
  ON_UPDATE_PROGRESS_BAR,
  ON_STUDENT_RUBIX_ID,
  ON_NOK_PROGRESS,
  ON_NOK_MESSAGE,
  ON_REG_PROGRESS,
  ON_LEASE_PROGRESS,
  ON_REG_MESSAGE,
  ON_LEASE_MESSAGE,
  ON_RES_PROGRESS,
  ON_RES_MESSAGE,
  ON_ID_PROGRESS,
  ON_ID_MESSAGE,
  UPDATE_STUDENT_ADDRESS,
  UPDATE_STUDENT_UNIVERRSITY,
  UPDATE_STUDENT_COURSE,
  UPDATE_STUDENT_YEAR_OF_STUDY,
  UPDATE_STUDENT_STUDENT_NO,
  UPDATE_DOC_ID,
  UPDATE_RES_ID,
  UPDATE_STUDENT_INDEX,
  UPDATE_LOADING_MSG,
  UPDATE_LOADING_CONTROLLER,
  UPDATE_CLIENTBG,
} from "../actions/NavigationAction";

const initialState = {
  isToastMessage: false,
  userID: "",
  platformID: "",
  clientID: "1",
  clientName: "",
  clientLogo: "",
  studentIDNo: null,
  progressBar: 0,
  studentID: '',
  studentName: '',

  studentAddress: '',
  studentUniversity: '',
  studentCourse: '',
  studentStudentNo: '',
  studentYearOfStudy: '',
  studentResID: '',

  nextofKinID: '',
  nextofKinName: '',

  currentDocID: '',

  idProgress: '0',
  idMessage: '',

  proofOfResProgress: '0',
  proofOfResMessage: '',

  leaseProgress: '0',
  leaseMessage: '',

  proofOfRegProgress: '0',
  nextOfKinProgress: '0',

  studentIndex: null,

  backImage: "",

  loadingMessage: '',
  loadingController: false,
  addClassactive: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChild: [
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildApp: [false, false, false, false, false, false],
  addClassactiveChildFM: [false, false, false, false, false],
  addClassactiveChildBlog: [false, false, false, false, false],
  addClassactiveChildUI: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildWidgets: [false, false, false, false, false, false, false],
  addClassactiveChildAuth: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildPages: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildForms: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildTables: [false, false, false, false, false, false, false],
  addClassactiveChildChart: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  addClassactiveChildMaps: [false, false, false],
  themeColor: "theme-cyan", //'theme-cyan layout-fullwidth'
  generalSetting: [false, false, true, true, false, false],
  toggleNotification: false,
  toggleEqualizer: false,
  menuProfileDropdown: false,
  sideMenuTab: [true, false, false, false],
  menuArrowToggle: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_PRESS_DASHBORD: {
      const addClass = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      addClass[action.payload] = !state.addClassactive[action.payload];
      return {
        ...state,
        addClassactive: [...addClass],
      };
    }

    case ON_PRESS_DASHBORD_CHILD:
      {
        switch (action.payload.perent) {
          case 0:
            const addClassChild = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChild[action.payload.index] = true;
            return {
              ...state,
              //addClassactive: true,
              addClassactiveChild: [...addClassChild],
            };

          case 1:
            const addClassChildApp = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildApp[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildApp: [...addClassChildApp],
            };

          case 2:
            const addClassChildFM = [false, false, false, false, false];
            addClassChildFM[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildFM: [...addClassChildFM],
            };

          case 3:
            const addClassChildBlog = [false, false, false, false, false];
            addClassChildBlog[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildBlog: [...addClassChildBlog],
            };

          case 4:
            const addClassChildUI = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildUI[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildUI: [...addClassChildUI],
            };

          case 5:
            const addClassChildWdg = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildWdg[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildWidgets: [...addClassChildWdg],
            };

          case 6:
            const addClassChildAuth = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildAuth[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildAuth: [...addClassChildAuth],
            };

          case 7:
            const addClassChildPages = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildPages[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildPages: [...addClassChildPages],
            };

          case 8:
            const addClassChildForms = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildForms[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildForms: [...addClassChildForms],
              toggleEqualizer: false,
            };

          case 9:
            const addClassChildTables = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildTables[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildTables: [...addClassChildTables],
              toggleEqualizer: false,
            };

          case 10:
            const addClassChildChart = [
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ];
            addClassChildChart[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildChart: [...addClassChildChart],
              toggleEqualizer: false,
            };

          case 11:
            const addClassChildMaps = [false, false, false];
            addClassChildMaps[action.payload.index] = true;
            return {
              ...state,
              addClassactiveChildMaps: [...addClassChildMaps],
              toggleEqualizer: false,
            };

          default:
        }
      }
      break;

    case ON_PRESS_THEME_COLOR: {
      return {
        ...state,
        themeColor: action.payload,
        toggleEqualizer: false,
      };
    }

    case ON_PRESS_GENERAL_SETTING: {
      return {
        ...state,
        generalSetting: !state.generalSetting[action.payload],
        menuProfileDropdown: false,
        toggleEqualizer: false,
        toggleNotification: false,
      };
    }

    case ON_PRESS_NOTIFICATION: {
      return {
        ...state,
        toggleNotification: !state.toggleNotification,
        menuProfileDropdown: false,
        toggleEqualizer: false,
      };
    }

    case ON_PRESS_EQUALIZER: {
      return {
        ...state,
        toggleEqualizer: !state.toggleEqualizer,
        menuProfileDropdown: false,
        toggleNotification: false,
      };
    }

    case ON_PRESS_MENU_PROFILE_DROPDOWN: {
      return {
        ...state,
        menuProfileDropdown: !state.menuProfileDropdown,
        toggleEqualizer: false,
        toggleNotification: false,
      };
    }

    case ON_PRESS_SIDE_MENU_TOGGLE: {
      return {
        ...state,
        menuProfileDropdown: false,
        toggleEqualizer: false,
        toggleNotification: false,
      };
    }

    case ON_PRESS_SIDE_MENU_TAB: {
      var menuTab = [false, false, false, false];
      menuTab[action.payload] = true;
      return {
        ...state,
        sideMenuTab: [...menuTab],
        menuProfileDropdown: false,
        toggleEqualizer: false,
        toggleNotification: false,
      };
    }

    case TOGGLE_MENU_ARROW: {
      return {
        ...state,
        menuArrowToggle: !state.menuArrowToggle,
        menuProfileDropdown: false,
        toggleEqualizer: false,
        toggleNotification: false,
      };
    }

    case TOAST_MESSAGE_LOAD: {
      return {
        ...state,
        isToastMessage: state.isToastMessage,
      };
    }

    case UPDATE_USERID: {
      return{
        ...state,
        userID: action.payload,
      }
    }

    case UPDATE_PLATFORM: {
      return{
        ...state,
        platformID: action.payload,
      }
    }

    case UPDATE_CLIENTID: {
      return{
        ...state,
        clientID: action.payload,
      }
    }
    
    case ON_UPDATE_PROGRESS_BAR: {
      return {
        ...state,
        progressBar: action.payload,
      };
    }
    
    case ON_STUDENT_RUBIX_ID: {
      return {
        ...state,
        studentID: action.payload,
      };
    }


    //Id Progress and Message
    case ON_ID_PROGRESS: {
      return {
        ...state,
        idProgress: action.payload,
      };
    }

    case ON_ID_MESSAGE: {
      return {
        ...state,
        idMessage: action.payload,
      };
    }

    
    //Proof of Residence Progress and Message
    case ON_RES_PROGRESS: {
      return {
        ...state,
        proofOfResProgress: action.payload,
      };
    }
    
    case ON_RES_MESSAGE: {
      return {
        ...state,
        proofOfResMessage: action.payload,
      };
    }
    
    //Proof of Registration Progress and Message
    case ON_REG_PROGRESS: {
      return {
        ...state,
        proofOfRegProgress: action.payload,
      };
    }
    
    case ON_REG_MESSAGE: {
      return {
        ...state,
        proofOfRegMessage: action.payload,
      };
    }

    //Lease Document Progress and Message
    case ON_LEASE_PROGRESS: {
      return {
        ...state,
        leaseProgress: action.payload,
      };
    }
    
    case ON_LEASE_MESSAGE: {
      return {
        ...state,
        leaseMessage: action.payload,
      };
    }

    //Next of Kin ID Progress and Message
    case ON_NOK_PROGRESS: {
      return {
        ...state,
        nextOfKinProgress: action.payload,
      };
    }
    
    case ON_NOK_MESSAGE: {
      return {
        ...state,
        nextOfKinMessage: action.payload,
      };
    }
    
    case UPDATE_CLIENTNAME: {
      return{
        ...state,
        clientName: action.payload,
      }
    }

    //Uppdate Client Logo
    case UPDATE_CLIENTLOGO: {
      return{
        ...state,
        clientLogo: action.payload,
      }
    }

    //Uppdate Client Backgroun Image
    case UPDATE_CLIENTBG: {
      return{
        ...state,
        backImage: action.payload,
      }
    }

//Update Student Number
    case UPDATE_STUDENTID: {
      return{
        ...state,
        studentIDNo: action.payload,
      }
    }
//Update Student Name
    case UPDATE_STUDENT_NAME: {
      return{
        ...state,
        studentName: action.payload,
      }
    }
//Update Next of Kin Name
    case UPDATE_NOK_NAME: {
      return{
        ...state,
        nextofKinName: action.payload,
      }
    }
//Update Next of Kin ID
    case UPDATE_NOK_ID: {
      return{
        ...state,
        nextofKinID: action.payload,
      }
    }

//Update Student's Address
    case UPDATE_STUDENT_ADDRESS: {
      return{
        ...state,
        studentAddress: action.payload,
      }
    }

//Update Student's University
    case UPDATE_STUDENT_UNIVERRSITY: {
      return{
        ...state,
        studentUniversity: action.payload,
      }
    }

//Update Student's University Course
    case UPDATE_STUDENT_COURSE: {
      return{
        ...state,
        studentCourse: action.payload,
      }
    }

//Update Student's University Year of Study
    case UPDATE_STUDENT_YEAR_OF_STUDY: {
      return{
        ...state,
        studentYearOfStudy: action.payload,
      }
    }

//Update Student's Student Number
    case UPDATE_STUDENT_STUDENT_NO: {
      return{
        ...state,
        studentStudentNo: action.payload,
      }
    }

//Update Document ID
    case UPDATE_DOC_ID: {
      return{
        ...state,
        currentDocID: action.payload,
      }
    }

//Update Student Res ID
    case UPDATE_RES_ID: {
      return{
        ...state,
        studentResID: action.payload,
      }
    }

//Update Student Res ID
    case UPDATE_STUDENT_INDEX: {
      return{
        ...state,
        studentIndex: action.payload,
      }
    }

//Update Loading Message
    case UPDATE_LOADING_MSG: {
      return{
        ...state,
        loadingMessage: action.payload,
      }
    }

//Update Loading Controller
    case UPDATE_LOADING_CONTROLLER: {
      return{
        ...state,
        loadingController: action.payload,
      }
    }

    default:
      return state;
  }
};

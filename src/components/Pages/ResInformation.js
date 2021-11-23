import React from "react";
import { connect } from "react-redux";
import imageuser from "../../assets/images/user.png";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import axios from "axios";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

class ResidenceInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          residence: {},
        }
      }
      componentDidMount() {
        window.scrollTo(0, 0);
    
        const fetchData = async() =>{
          const data = {
            'RubixRegisterUserID': '2747',
        };
        const requestOptions = {
          title: 'Student Residense Details',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
      };
          //Get Rubix User Details
          await axios.post('http://192.168.88.10:3300/api/RubixStudentResDetails', data, requestOptions)
                .then(response => {
                    console.log("Res details:",response)
                    //this.setState({residence: response.data.PostRubixUserData[0]})
                })
            };
            fetchData()
      }


  render() {
    return (
      <div>
        <div className="body">
                              <h6>My Residence Information</h6>
                              <ul className="list-unstyled list-login-session">
                               
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        University - {this.state.residence.ResidenceUniversity}
                                      </h3>
                                      
                                    </div>
                                   
                                  </div>
                                </li>
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        Residence Name - {this.state.residence.ResidenceName}
                                      </h3>
                                      <span className="login-detail">
                                      {this.state.residence.ResidenceLocation}
                                      </span>
                                      <br></br>
                                      <span className="login-detail">
                                      Building number: {this.state.residence.BuildingNumber}
                                      </span>
                                      <br></br>
                                      <span className="login-detail">
                                      Floor: {this.state.residence.FloorNumber}
                                      </span>
                                      <br></br>
                                      <span className="login-detail">
                                      Room:{this.state.residence.RoomNumber}
                                      </span>
                                    </div>
                                   
                                  </div>
                                </li>
                              </ul>
                            </div>


{/* 
        <div className="body">
          <h6>General Information</h6>
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Phone Number"
                  type="text"
                />
              </div>
              <div className="form-group">
                <select className="form-control">
                  <option>--Select Language</option>
                  <option lang="en" value="en_US">
                    English (United States)
                  </option>
                  <option lang="ar" value="ar">
                    العربية
                  </option>
                  <option lang="ar" value="ary">
                    العربية المغربية
                  </option>
                  <option lang="az" value="az">
                    Azərbaycan dili
                  </option>
                  <option lang="az" value="azb">
                    گؤنئی آذربایجان
                  </option>
                  <option lang="be" value="bel">
                    Беларуская мова
                  </option>
                  <option lang="bg" value="bg_BG">
                    Български
                  </option>
                  <option lang="bn" value="bn_BD">
                    বাংলা
                  </option>
                  <option lang="bs" value="bs_BA">
                    Bosanski
                  </option>
                  <option lang="ca" value="ca">
                    Català
                  </option>
                  <option lang="ceb" value="ceb">
                    Cebuano
                  </option>
                  <option lang="cs" value="cs_CZ">
                    Čeština‎
                  </option>
                  <option lang="cy" value="cy">
                    Cymraeg
                  </option>
                  <option lang="da" value="da_DK">
                    Dansk
                  </option>
                  <option lang="de" value="de_CH_informal">
                    Deutsch (Schweiz, Du)
                  </option>
                  <option lang="de" value="de_CH">
                    Deutsch (Schweiz)
                  </option>
                  <option lang="de" value="de_DE">
                    Deutsch
                  </option>
                  <option lang="de" value="de_DE_formal">
                    Deutsch (Sie)
                  </option>
                  <option lang="el" value="el">
                    Ελληνικά
                  </option>
                  <option lang="en" value="en_GB">
                    English (UK)
                  </option>
                  <option lang="en" value="en_AU">
                    English (Australia)
                  </option>
                  <option lang="en" value="en_ZA">
                    English (South Africa)
                  </option>
                  <option lang="en" value="en_NZ">
                    English (New Zealand)
                  </option>
                  <option lang="en" value="en_CA">
                    English (Canada)
                  </option>
                  <option lang="eo" value="eo">
                    Esperanto
                  </option>
                  <option lang="es" value="es_CL">
                    Español de Chile
                  </option>
                  <option lang="es" value="es_MX">
                    Español de México
                  </option>
                  <option lang="es" value="es_GT">
                    Español de Guatemala
                  </option>
                  <option lang="es" value="es_AR">
                    Español de Argentina
                  </option>
                  <option lang="es" value="es_ES">
                    Español
                  </option>
                  <option lang="es" value="es_PE">
                    Español de Perú
                  </option>
                  <option lang="es" value="es_CO">
                    Español de Colombia
                  </option>
                  <option lang="es" value="es_VE">
                    Español de Venezuela
                  </option>
                  <option lang="et" value="et">
                    Eesti
                  </option>
                  <option lang="eu" value="eu">
                    Euskara
                  </option>
                  <option lang="fa" value="fa_IR">
                    فارسی
                  </option>
                  <option lang="fi" value="fi">
                    Suomi
                  </option>
                  <option lang="fr" value="fr_FR">
                    Français
                  </option>
                  <option lang="fr" value="fr_CA">
                    Français du Canada
                  </option>
                  <option lang="fr" value="fr_BE">
                    Français de Belgique
                  </option>
                  <option lang="gd" value="gd">
                    Gàidhlig
                  </option>
                  <option lang="gl" value="gl_ES">
                    Galego
                  </option>
                  <option lang="haz" value="haz">
                    هزاره گی
                  </option>
                  <option lang="he" value="he_IL">
                    עִבְרִית
                  </option>
                  <option lang="hi" value="hi_IN">
                    हिन्दी
                  </option>
                  <option lang="hr" value="hr">
                    Hrvatski
                  </option>
                  <option lang="hu" value="hu_HU">
                    Magyar
                  </option>
                  <option lang="hy" value="hy">
                    Հայերեն
                  </option>
                  <option lang="id" value="id_ID">
                    Bahasa Indonesia
                  </option>
                  <option lang="is" value="is_IS">
                    Íslenska
                  </option>
                  <option lang="it" value="it_IT">
                    Italiano
                  </option>
                  <option lang="ja" value="ja">
                    日本語
                  </option>
                  <option lang="ka" value="ka_GE">
                    ქართული
                  </option>
                  <option lang="ko" value="ko_KR">
                    한국어
                  </option>
                  <option lang="lt" value="lt_LT">
                    Lietuvių kalba
                  </option>
                  <option lang="mk" value="mk_MK">
                    Македонски јазик
                  </option>
                  <option lang="mr" value="mr">
                    मराठी
                  </option>
                  <option lang="ms" value="ms_MY">
                    Bahasa Melayu
                  </option>
                  <option lang="my" value="my_MM">
                    ဗမာစာ
                  </option>
                  <option lang="nb" value="nb_NO">
                    Norsk bokmål
                  </option>
                  <option lang="nl" value="nl_NL">
                    Nederlands
                  </option>
                  <option lang="nl" value="nl_NL_formal">
                    Nederlands (Formeel)
                  </option>
                  <option lang="nn" value="nn_NO">
                    Norsk nynorsk
                  </option>
                  <option lang="oc" value="oci">
                    Occitan
                  </option>
                  <option lang="pl" value="pl_PL">
                    Polski
                  </option>
                  <option lang="ps" value="ps">
                    پښتو
                  </option>
                  <option lang="pt" value="pt_BR">
                    Português do Brasil
                  </option>
                  <option lang="pt" value="pt_PT">
                    Português
                  </option>
                  <option lang="ro" value="ro_RO">
                    Română
                  </option>
                  <option lang="ru" value="ru_RU">
                    Русский
                  </option>
                  <option lang="sk" value="sk_SK">
                    Slovenčina
                  </option>
                  <option lang="sl" value="sl_SI">
                    Slovenščina
                  </option>
                  <option lang="sq" value="sq">
                    Shqip
                  </option>
                  <option lang="sr" value="sr_RS">
                    Српски језик
                  </option>
                  <option lang="sv" value="sv_SE">
                    Svenska
                  </option>
                  <option lang="th" value="th">
                    ไทย
                  </option>
                  <option lang="tl" value="tl">
                    Tagalog
                  </option>
                  <option lang="tr" value="tr_TR">
                    Türkçe
                  </option>
                  <option lang="ug" value="ug_CN">
                    Uyƣurqə
                  </option>
                  <option lang="uk" value="uk">
                    Українська
                  </option>
                  <option lang="vi" value="vi">
                    Tiếng Việt
                  </option>
                  <option lang="zh" value="zh_CN">
                    简体中文
                  </option>
                  <option lang="zh" value="zh_TW">
                    繁體中文
                  </option>
                </select>
              </div>
              <div className="form-group"></div>
              <div className="form-group">
                <label>Date Format</label>
                <div className="fancy-radio">
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>May 18, 2018
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>2018, May, 18
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>2018-03-10
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>02/09/2018
                    </span>
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      name="dateFormat"
                      type="radio"
                      value=""
                      onChange={() => {}}
                    />
                    <span>
                      <i></i>10/05/2018
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <h6>Email from Lucid</h6>
              <p>I'd like to receive the following emails:</p>
              <ul className="list-unstyled list-email-received">
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Weekly account summary</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Campaign reports</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>Promotional news such as offers or discounts</span>
                  </label>
                </li>
                <li>
                  <label className="fancy-checkbox">
                    <input type="checkbox" />
                    <span>
                      Tips for campaign setup, growth and client success stories
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer, mailInboxReducer }) => ({
  rubixUserID: navigationReducer.userID,
});

export default connect(mapStateToProps, {})(ResidenceInformation);

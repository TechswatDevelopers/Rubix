import React from "react";
import User from "../assets/images/user.png";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";

class ProfileHeaderCard extends React.Component {
  render() {
    const { FirstName, SecondName, ProfilePicture, PastEvents, UpcomingEvents} = this.props;
    return (
      <div className="body">
        <div className="text-center">
          <img src={ProfilePicture == null || ProfilePicture == '' ?"user.png" : ProfilePicture} className="rounded-circle m-b-15 " alt="" 
          style={{
            height: "150px"
          }}
          />
          <div>
            <h4 className="m-b-0">
              <strong>{FirstName}</strong> {SecondName}
            </h4>
          </div>

          <div className="row">
            <div className="col-4">
              <h6>0</h6>
              <span>Past Events</span>
            </div>
            <div className="col-4">
              <h6>0</h6>
              <span>Upcoming Events</span>
            </div>
            <div className="col-4">
              <h6>0</h6>
              <span>Total Events</span>
            </div>
          </div>
        </div>
        <hr />
        <span className="badge badge-info mb-2">Student Induction</span>
        <span className="badge badge-primary mb-2">Student Life Event</span>
        <span className="badge badge-success mb-2">Student Wellness</span>
        <hr />
        <h6>The Awesome Company Team</h6>
        <ul className="list-unstyled team-info m-t-20">
          <li>
            <img src={Avatar1} title="Avatar" alt="Avatar" />
          </li>
          <li>
            <img src={Avatar2} title="Avatar" alt="Avatar" />
          </li>
          <li>
            <img src={Avatar3} title="Avatar" alt="Avatar" />
          </li>
          <li>
            <img src={Avatar4} title="Avatar" alt="Avatar" />
          </li>
          <li>
            <img src={Avatar5} title="Avatar" alt="Avatar" />
          </li>
        </ul>
      </div>
    );
  }
}

export default ProfileHeaderCard;

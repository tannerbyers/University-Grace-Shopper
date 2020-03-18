import React from 'React';

const Profile = ({ auth, changePassword }) => {
  const toggleChangePassword = () => {
    const formToToggle = document.querySelector('[name="toggle-me"]');
    formToToggle.classList.toggle('hide');
  };
  return (
    <div>
      <h1>Hello, {auth.username}</h1>
      <button type="button" onClick={toggleChangePassword}>
        Change Password
      </button>
      <div name="toggle-me" className="hide">
        <form onSubmit={changePassword}>
          <label>new password</label>
          <input name="new_pw" type="password"></input>
          <label>re-enter password</label>
          <input name="re_entered_pw" type="password"></input>
          <button type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

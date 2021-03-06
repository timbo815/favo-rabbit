var React = require('react'),
    SessionStore = require('../stores/session_store.js'),
    ErrorStore = require('../stores/error_store.js'),
    SessionApiUtil = require('../util/session_api_util.js');

var LoginForm = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return ({
      username: "",
      password: ""
    });
  },

  componentDidMount: function () {
    this.errorListener = ErrorStore.addListener(this.forceUpdate.bind(this));
    this.sessionListener = SessionStore.addListener(this.redirectIfLoggedIn);
  },

  componentWillUnmount: function () {
    this.sessionListener.remove();
    this.errorListener.remove();
  },

  redirectIfLoggedIn: function () {
    if (SessionStore.isUserLoggedIn()) {
      this.context.router.push("home");
    }
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var formData = {
      username: this.state.username,
      password: this.state.password
    };
    SessionApiUtil.login(formData);
  },

  usernameChange: function (e) {
    this.setState({username: e.target.value});
  },

  guestLogin: function (e) {
    e.preventDefault();
    var formData = {
      username: "guest",
      password: "guestguest"
    };
    SessionApiUtil.login(formData);
  },

  passwordChange: function (e) {
    this.setState({password: e.target.value});
  },

  renderSignUp: function (e) {
    e.preventDefault();
    this.context.router.push("signup");
  },

  fieldErrors: function (field) {
    var errors = ErrorStore.formErrors("login");
    if (!errors[field]) { return; }

    var messages = errors[field].map(function(error, i) {
      return <li key={i}>{error}</li>;
    });

    return <ul className="signup-errors">{ messages }</ul>;
  },

  render: function () {
    return(
      <div className="login-page">
        <section>{this.fieldErrors("base")}</section>
        <form onSubmit={this.handleSubmit} className="login-form">
          <img src={logo_url} className="login-logo"/><span className="favo-login">Favo</span><span className="rabbit-login">Rabbit</span>
          <label for="username" className="username-label">Username</label>
          <input type="text" value={this.state.username} onChange={this.usernameChange} className="username"/>
          <label for="password" className="password-label">Password</label>
          <input type="password" value={this.state.password} onChange={this.passwordChange} className="password"/>
          <input type="submit" value="Sign In" className="submit-button"/>
          <p>Not a user?<button onClick={this.renderSignUp} className="signup-button">Sign Up</button>
          Or <button className="signup-button" onClick={this.guestLogin}>Login as guest</button>
          </p>
        </form>
      </div>
    );
  }
});


module.exports = LoginForm;

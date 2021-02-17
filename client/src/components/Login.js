import React from "react";

export default function Login() {
  return (
    <div className="center vh-100">
      <div className="frm-center w-50">
        <div className="card card-info">
          <div className="card-header">
            <h1 className="card-title">Login Form</h1>
          </div>
          <form action="/action_page.php" className="p-3">
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                id="pwd"
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

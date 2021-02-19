import { useState } from 'react'



const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // สร้างฟังก์ชั่น onSubmit
  const onSubmit = (e) => {
    e.preventDefault()
    // ถ้าไม่มี text ส่งมาจะ Alert please add task
    if(!email) {
        alert('please add task')
        return
    }
    // เรียกใช้งานฟังก์ชั่นที่ App.js ส่งมา โดยส่ง parametter กลับไป 1 ชุดคือ text, day, reminder
    onLogin({ email, password })
  }

  return (
    <div className="center vh-100">
      <div className="frm-center w-50">
        <div className="card card-info">
          <div className="card-header">
            <h1 className="card-title">Login Form</h1>
          </div>
            <form onSubmit={onSubmit} className="p-3">
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
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
  )
}

export default Login
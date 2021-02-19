import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Menu from './components/Menu'
import Content from './components/Content'
import Login from './components/Login'
import swal from 'sweetalert';
const App = () => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [login, setLogin] = useState(false)
  const [store, setStore] = useState(null)
  

  
  const sweetAlert = (message,icon) => {
    swal({
      title: message,
      icon: icon,
    });
  }

  const componentDidMount = () => {
    this.storeCollector();
  }
  const storeCollector = () => {
    let stores = JSON.parse(localStorage.getItem('login'));
    if(stores && stores.login){
      setLogin(true)
      setStore(stores)
    }
  }
  // สร้างตัวแปร addTask 
const loginStaff = async (login) => {
  const res = await fetch('http://localhost:4000/staff/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(login)
  })
  const data = await res.json();

  if(data.error){
    return sweetAlert(data.error.message,"error");
  }

  localStorage.setItem('login',JSON.stringify({
    login: true,
    token: data.access_token
  }))
  storeCollector();
  // console.log(JSON.parse(localStorage.getItem('login')));
}

  return (
    <div>
      {
        !login?
        <div>
        <Login onLogin={loginStaff}/>
        </div>
        :
        <div>
          <Header />
          <Menu />
          <Content />
          <Footer />
        </div>
      }
    </div>
  )
}

export default App
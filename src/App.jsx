import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom"
import Profile from "./Pages/Profile"
import Home from "./Pages/Home"
import ErrorPage from "./Pages/ErrorPage"


const App=()=> {
  let { username } = useParams();
const profileUrl = `/profile/${username}`;

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <Link className="navbar-brand" to="#">Navbar</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to={profileUrl}>My Profile</Link>
      </li>
      </ul>
      <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="#">Advertise</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="#">My Advertisements</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="#">Logout</Link>
      </li>
    </ul>
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>
       <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/profile/:username" element={<Profile />}/>
         {/* <Route path="/profile" element={<Profile />}/> */}
         
        <Route path="*" element={<ErrorPage />}/>
      </Routes> 
    </Router>
  )
}

export default App

import { SignupForm } from "./components/SignupForm/SignupForm"
import { LoginForm } from "./components/loginForm/loginForm"
import './App.css';
import { Route, Routes } from 'react-router-dom';
import NotFound from "./screens/NotFound/NotFound";
import Homescreen from './screens/Homescreen/Homescreen';
import {ResetPasswordForm} from "./screens/ResetPass/ResetPass"
import {ForgotPasswordForm} from "./screens/ForgotPass/ForgotPass"
import {BrowseFlights} from "./screens/BrowseFlights/BrowseFlights"
import {FlightInfo} from "./screens/Flights/FlightInfo"
import {RegisterFlight} from "./screens/RegisterFlight/RegisterFlight"
import { BrowserRouter } from 'react-router-dom';
import { LoginAdmin } from "./components/loginAdmin/LoginAdmin"
import { UpdateFlight } from "./screens/admin/UpdateFlight"
import { Dashboard } from './screens/Dashboard/Dashboard'
import Admin from './screens/admin/admin';
import { AboutUs } from './screens/AboutUs/AboutUs';
import { ContactUs } from './screens/ContactUs/ContactUs';
import UploadProfileImagePage from "./screens/imgupload"


function App() {
  return (
    <div className="App">
      <>
        <Routes>
          <Route path='/' element={<Homescreen />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />}/>
          <Route path='/reset/:token' element={<ResetPasswordForm />}/>
          <Route path='/forgotPassword' element={<ForgotPasswordForm />}/>
          <Route path="/BrowseFlights" element={<BrowseFlights />}/>
          <Route path="/Flights/:FlightID" element={<FlightInfo />}/>
          <Route path="admin/login" element={<LoginAdmin />}/>
          <Route path="admin/UpdateFlight/:FlightID" element={<UpdateFlight />}/>
          <Route path="admin/RegisterFlight" element={<RegisterFlight />}/>
          <Route path="admin/" element={<Admin />}/>
          <Route path="dashboard/" element={<Dashboard />}/>
          <Route path="/AboutUs" element={<AboutUs />}/>
          <Route path="/contactUs" element={<ContactUs />}/>
          <Route path="*" element={<NotFound />}/>

          <Route path="/img" element={<UploadProfileImagePage />}/>
        </Routes>
      </>
    </div>
  );
}

export default App;

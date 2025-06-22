import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Founder from "./Components/Founder/Founder";
import Leaders from "./Components/Leaders/Leaders";
import Event from "./Components/Events/Event";
import RegistrationForm from "./Components/Registration Form/RegistrationForm";
import Contact from "./Components/Contact/Contact";
import Layout from "./Components/Layout/Layout";
import CreateEvent from "./Components/EventForm/CreateEvent";
import EditEvent from "./Components/EventForm/EditEvent";
import RegistrationSuccess from "./Components/RegistrationSuccess";
import DonatePage from "./Components/Donate/DonatePage";
import DonationSuccess from "./Components/Donate/DonationSuccess";
import Gallery from "./Components/Gallery/Gallery";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/leaders" element={<Leaders />} />
            <Route path="/events" element={<Event />} />
            <Route path="/registration" element={<RegistrationForm />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/event/new" element={<CreateEvent />} />
            <Route path="/event/:id/edit" element={<EditEvent />} />
            <Route path="/event/create" element={<CreateEvent />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/gallery" element={<Gallery />} />

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

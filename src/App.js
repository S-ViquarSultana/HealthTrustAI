import BrowseRouter from "./BrowseRouter";
import ChatbotButton from "./components/ChatbotButton"; 

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

library.add(faInstagram, faFacebookF, faLinkedinIn);

function App() {
  return (
    <div>
      <BrowseRouter></BrowseRouter>
      <ChatbotButton></ChatbotButton>
    </div>
  );
}

export default App;

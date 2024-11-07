import Admin from "./components/Admin"
import Home from "./components/Home"
import NoPage from "./components/NoPage";
import User from "./components/User"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="user/:roomId" element={<User/>} />
          <Route path="*" element={<NoPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

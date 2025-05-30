import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./Modules/admin/component/Nav/Navigation";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import UserRoute from "./Modules/admin/Route/UserRoute";
import { AuthProvider } from "./Modules/GlobalContext";

function App() {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path="/admin/*" element={<AdminRoute />}/>
          <Route exact path="/*" element={<UserRoute />}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

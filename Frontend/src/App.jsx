
  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

  import { ModelLoader } from "./components/home/HomePage.jsx";
  import { CropPage } from "./components/crop/CropPage.jsx";
  import { FertilizerPage } from "./components/fertilizer/FertilizerPage.jsx";
  import { CropResult } from "./components/result/CropResult.jsx";
  import { FertilizerResult } from "./components/result/FertilizerResult.jsx";
  import Login from "./components/auth/Login";
  import Signup from "./components/auth/Signup";
  import Profile from "./components/profile/Profile.jsx";





  function NotFound() {
    return <Navigate to="/" />;
  }

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModelLoader />} />
          <Route path="/crop" element={<CropPage />} />
          <Route path="/fertilizer" element={<FertilizerPage />} />
          <Route path="/crop_result" element={<CropResult />} />
          <Route path="/fertilizer_result" element={<FertilizerResult />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;

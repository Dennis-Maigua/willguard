import { Routes, Route, BrowserRouter } from "react-router-dom";
import Form from "./components/Form";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={null} />
        <Route path='/reset-password' element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
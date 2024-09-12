import { Route, Routes } from '../node_modules/react-router-dom/dist/index';
import './global.css'
import Home from './_root/pages/Home';
import SigninForm from "./_auth/forms/SinginForm";
import SignupForm from "./_auth/forms/SinginForm";
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';

const App = () => {
  return (
    <main className="flex h-screen">
      {/* Public Routes */}
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sig-in" element={<SigninForm />}/>
          <Route path="/sig-up" element={<SignupForm />}/>
        </Route>
      </Routes>

      {/* Private Routes */}
      <Routes>
        <Route element={<RootLayout/>}>
          <Route index element={<Home />}/>
        </Route>
      </Routes>

    </main>
  );
};

export default App;
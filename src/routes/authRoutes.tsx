import { Route } from 'react-router-dom';
import { AuthPage } from '../pages/authPages/AuthPage';
import { SignUp } from '../pages/authPages/SignUp';
import { ForgetPassword } from '../pages/authPages/ForgetPassword';
import { ResetPassword } from '../pages/authPages/ResetPassword';
import { ResetSuccesfull } from '../pages/authPages/ResetSuccesfull';

export const authRoutes = (
  <>
    {/* Auth Pages */}
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/register" element={<SignUp />} />
    <Route path="/auth/login" element={<AuthPage />} />
    <Route path="/auth/signup" element={<SignUp />} />
    <Route path="/auth/register" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
    <Route path="/forget-password" element={<ForgetPassword />} />
    <Route path="/auth/forgot-password" element={<ForgetPassword />} />
    <Route path="/auth/forget-password" element={<ForgetPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/auth/reset-password" element={<ResetPassword />} />
    <Route path="/reset-success" element={<ResetSuccesfull />} />
    <Route path="/reset-successful" element={<ResetSuccesfull />} />
    <Route path="/auth/reset-success" element={<ResetSuccesfull />} />
  </>
);

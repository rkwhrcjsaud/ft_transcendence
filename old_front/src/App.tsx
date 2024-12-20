import LoginPage from "./pages/Sign/LoginPage";
import LandingPage from "./pages/Landing/LandingPage"; // 랜딩 페이지 컴포넌트 추가
import Dashboard from "./pages/Profile/Dashboard";
import EditProfilePage from "./pages/Profile/DashProfile/EditProfile";
import { RegisterPage } from "./pages/Sign/RegisterPage";
import { VerifyEmailPage } from "./pages/Sign/VerifyEmailPage";
import Nav from "./components/layout/Nav";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import AuthProvider from "./providers/AuthProvider";
import AuthProviderLoader from "./providers/AuthProviderLoader";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";

import LocalGamePage from "./pages/LocalGame/LocalGame";
import LocalGameLoader from "./pages/LocalGame/LocalGameLoader";

import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileLoader from "./pages/Profile/ProfileLoader";

import ErrorPage from "./pages/ErrorPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { SocialLoginLoader } from "./loaders/SocialLoginLoader";

import { LangProvider } from "./context/LangContext";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<LangProvider />}>
      <Route element={<AuthProvider />} loader={AuthProviderLoader} errorElement={<ErrorPage />}>
        <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>} errorElement={<ErrorPage />}>
          <Route element={<Nav />} errorElement={<ErrorPage />}>
            {/* 랜딩 페이지 */}
            <Route path="/" element={<LandingPage />} />
            {/* 대시보드 페이지 */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 싱글 플레이 페이지 */}
            <Route path="/cpugame" element={<LocalGamePage />} loader={LocalGameLoader} />
            {/* 멀티 플레이 페이지 */}
            <Route path="/multygame" element={<LocalGamePage />} loader={LocalGameLoader} />
            {/* 프로필 페이지 (예시로 남겨둠) */}
            <Route path="/profile" element={<ProfilePage />} loader={ProfileLoader} />
            {/* 프로필 수정 페이지 */}
            <Route path="/dashboard/edit_profile" element={<EditProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/42" loader={SocialLoginLoader} />
      <Route path="/verify" element={<VerifyEmailPage />} />
    </Route>
  )
);


// import LoginPage from "./pages/Sign/LoginPage";
// import Index from "./pages/Profile/Dashboard";
// import { RegisterPage } from "./pages/Sign/RegisterPage";
// import Nav from "./components/layout/Nav";
// import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// import AuthProvider from "./providers/AuthProvider";
// import AuthProviderLoader from "./providers/AuthProviderLoader";

// import { ProtectedRoute } from "./routes/ProtectedRoute";
// import { AuthLayout } from "./components/layout/AuthLayout";

// import LocalGamePage from "./pages/LocalGame/LocalGame";
// import LocalGameLoader from "./pages/LocalGame/LocalGameLoader";

// import ProfilePage from "./pages/Profile/ProfilePage";
// import ProfileLoader from "./pages/Profile/ProfileLoader";

// import ErrorPage from "./pages/ErrorPage";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// import { SocialLoginLoader } from "./loaders/SocialLoginLoader";

// import { LangProvider } from "./context/LangContext";

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<LangProvider />}>
//       <Route element={<AuthProvider />} loader={AuthProviderLoader} errorElement={<ErrorPage />}>
//         <Route element={<ProtectedRoute><AuthLayout /></ProtectedRoute>} errorElement={<ErrorPage />}>
//           <Route path="/" element={<Nav />} errorElement={<ErrorPage />}>
//             {/* 주석을 정리하고 필요한 경로들만 사용 */}
//             {/* 기본 대시보드 경로 설정 */}
//             <Route path="/dashboard" element={<Index />} />
//             <Route path="multygame" element={<LocalGamePage />} loader={LocalGameLoader} />
//             <Route path="profile" element={<ProfilePage />} loader={ProfileLoader} />
//           </Route>
//         </Route>
//       </Route>

//       {/* public routes */}
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/42" loader={SocialLoginLoader} />
//     </Route>
//   )
// );

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Lazy load the components
const Netflix = lazy(() => import('./pages/Netflix'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Player = lazy(() => import('./pages/Player'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShow')); // Fixed import path
const UserListedMovies = lazy(() => import('./pages/UserListedMovies'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/player" element={<Player />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/mylist" element={<UserListedMovies />} />
          <Route path="/home" element={<Netflix />} />
          <Route path="/" element={<Signup />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

// Import assets
import user from './Asset/user.svg';
import telepon from './Asset/telepon.svg';
import password from './Asset/password.svg';
import email from './Asset/email.svg';
import showpassword from './Asset/showpassword.svg';
import hidepassword from './Asset/hidePassword.svg';
import google from './Asset/google.svg';
import apple from './Asset/apple.svg';
import facebook from './Asset/facebook.svg';
import poster1 from './Asset/poster1.svg';
import poster2 from './Asset/poster2.svg';
import poster3 from './Asset/poster3.svg';
import poster4 from './Asset/poster4.svg';
import poster5 from './Asset/poster5.svg';
import poster6 from './Asset/poster6.svg';
import poster7 from './Asset/poster7.svg';
import poster8 from './Asset/poster8.svg';
import poster9 from './Asset/poster9.svg';
import poster10 from './Asset/poster10.svg';

// Import styles
import './Login_Register.css';

const LoginRegister: Component = () => {
  const [isRegister, setIsRegister] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = createSignal({
    username: '',
    email: '',
    password: '',
    phone: '',
  });

  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (isRegister()) {
      // If in register mode, validate fields and switch to login
      const { username, email, password, phone } = formData();
      if (username && email && password && phone) {
        setIsRegister(false);
      }
    } else {
      // If in login mode, navigate to desktop
      navigate("/Beranda-Dekstop");
    }
  };

  // Handle register button click
  const handleRegisterClick = (e: Event) => {
    e.preventDefault();
    // Validate fields and switch to login mode
    const { username, email, password, phone } = formData();
    if (username && email && password && phone) {
      setIsRegister(false);
    }
  };

  // Navigation handlers
  const handleForgotPassword = () => {
    navigate('/lupapass');
  };

  // Class for tab container in register mode
  const tabContainerClass = () => `tab-container ${isRegister() ? 'register' : ''}`;

  return (
    <div class="container">
      {/* Login Section */}
      <div class="login-section">
        <h1 class="logo">ULO.</h1>
        <h2 class="welcome">Selamat Datang!</h2>

        {/* Tab Container */}
        <div class={tabContainerClass()}>
          <button
            class={`tab ${!isRegister() ? 'active' : ''}`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            class={`tab ${isRegister() ? 'active' : ''}`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form class="form" onSubmit={handleSubmit}>
          {/* Username field - Only shown in register mode */}
          <Show when={isRegister()}>
            <div class="input-group">
              <img src={user} alt="user" class="icon" />
              <input
                type="text"
                placeholder="Username"
                value={formData().username}
                onInput={(e) => setFormData({ ...formData(), username: e.currentTarget.value })}
              />
            </div>
          </Show>

          {/* Email field */}
          <div class="input-group">
            <img src={email} alt="email" class="icon" />
            <input
              type="email"
              placeholder="Email"
              value={formData().email}
              onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
            />
          </div>

          {/* Password field */}
          <div class="input-group">
            <img src={password} alt="password" class="icon" />
            <input
              type={showPassword() ? 'text' : 'password'}
              placeholder="Password"
              value={formData().password}
              onInput={(e) => setFormData({ ...formData(), password: e.currentTarget.value })}
            />
            <img
              src={showPassword() ? hidepassword : showpassword}
              class="password-toggle"
              onClick={() => setShowPassword(!showPassword())}
              alt="toggle password"
            />
          </div>

          {/* Phone field - Only shown in register mode */}
          <Show when={isRegister()}>
            <div class="input-group">
              <img src={telepon} alt="phone" class="icon" />
              <input
                type="tel"
                placeholder="Nomor Telepon"
                value={formData().phone}
                onInput={(e) => setFormData({ ...formData(), phone: e.currentTarget.value })}
              />
            </div>
          </Show>

          {/* Submit button */}
          <button 
            type="submit" 
            class="submit-button" 
            onClick={isRegister() ? handleRegisterClick : handleSubmit}
          >
            {isRegister() ? 'Daftar' : 'Lanjutkan'}
          </button>

          {/* Login link - Only shown in register mode */}
          <Show when={isRegister()}>
            <p class="login-link">
              Sudah punya akun? <a href="#" onClick={() => setIsRegister(false)}>Login</a>
            </p>
          </Show>

          {/* Additional login options - Only shown in login mode */}
          <Show when={!isRegister()}>
            <a class="forgot-password" onClick={handleForgotPassword}>
              Lupa Password?
            </a>

            <div class="divider">Atau Masuk Dengan</div>

            <div class="social-login">
              <button type="button" class="social-button-transparent">
                <img src={google} alt="google" class="social-icon" />
              </button>
              <button type="button" class="social-button-transparent">
                <img src={apple} alt="apple" class="social-icon" />
              </button>
              <button type="button" class="social-button-transparent">
                <img src={facebook} alt="facebook" class="social-icon" />
              </button>
            </div>
          </Show>
        </form>
      </div>

      {/* Posters Section */}
      <div class="posters-section">
        <div class="poster-column left-column">
          <img src={poster1} alt="Movie Poster" class="poster" />
          <img src={poster10} alt="Movie Poster" class="poster" />
          <img src={poster4} alt="Movie Poster" class="poster" />
          <img src={poster1} alt="Movie Poster" class="poster" />
          <img src={poster10} alt="Movie Poster" class="poster" />
          <img src={poster4} alt="Movie Poster" class="poster" />
        </div>
        <div class="poster-column middle-column">
          <img src={poster2} alt="Movie Poster" class="poster" />
          <img src={poster5} alt="Movie Poster" class="poster" />
          <img src={poster8} alt="Movie Poster" class="poster" />
          <img src={poster2} alt="Movie Poster" class="poster" />
          <img src={poster5} alt="Movie Poster" class="poster" />
          <img src={poster8} alt="Movie Poster" class="poster" />
        </div>
        <div class="poster-column right-column">
          <img src={poster3} alt="Movie Poster" class="poster" />
          <img src={poster6} alt="Movie Poster" class="poster" />
          <img src={poster9} alt="Movie Poster" class="poster" />
          <img src={poster3} alt="Movie Poster" class="poster" />
          <img src={poster6} alt="Movie Poster" class="poster" />
          <img src={poster9} alt="Movie Poster" class="poster" />
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
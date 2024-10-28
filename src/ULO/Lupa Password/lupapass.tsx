import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import "./lupapass.css";
import lupapassimg from '../Lupa Password/lupapass.svg';

const LupaPass: Component = () => {
  const navigate = useNavigate();
  const [view, setView] = createSignal("reset"); // Initial view is 'reset'

  const handleResetPassword = () => {
    setView("checkEmail");
  };

  const handleVerifyPassword = () => {
    setView("newPassword");
  };

  const handlePasswordResetSuccess = () => {
    setView("success"); // New view for the success message
  };

  return (
    <div class="container-syauqiy">
      {view() === "reset" && (
        // Reset Password View
        <div class="left-section">
          <h1>ULO.</h1>
          <h2>Lupa password?</h2>
          <p>Jangan khawatir, kami akan mengirimkan petunjuk pengaturan ulang kepada anda.</p>
          <input type="email" placeholder="Masukan email anda" />
          <button onClick={handleResetPassword}>Reset kata sandi</button>
          <a href="#" onClick={() => navigate("/login")}>← Kembali ke login</a>
        </div>
      )}

      {view() === "checkEmail" && (
        // Check Email View
        <div class="left-section">
          <h1>ULO.</h1>
          <h2>Periksa email anda</h2>
          <p>
            Kami mengirimkan tautan pengaturan ulang kata sandi ke
            andidugong@gmail.com
          </p>
          <button onClick={handleVerifyPassword}>Verifikasi kata sandi</button>
          <p>Belum menerima email? <a href="#">kirim ulang</a></p>
          <a href="#" onClick={() => navigate("/login")}>← Kembali ke login</a>
        </div>
      )}

      {view() === "newPassword" && (
        // New Password View
        <div class="left-section">
          <h1>ULO.</h1>
          <h2>Masukan kata sandi baru</h2>
          <div>
            <label>Kata sandi</label>
            <input type="password" placeholder="Masukan kata sandi baru" />
            <small>Harus minimal 8 karakter</small>
          </div>
          <div>
            <label>Konfirmasi kata sandi</label>
            <input type="password" placeholder="Masukan kata sandi baru" />
          </div>
          <button onClick={handlePasswordResetSuccess}>Reset kata sandi</button>
          <a href="#" onClick={() => navigate("/login")}>← Kembali ke login</a>
        </div>
      )}

      {view() === "success" && (
        // Success View
        <div class="left-section">
          <h1>ULO.</h1>
          <h2>Reset kata sandi</h2>
          <p>Kata sandi anda telah berhasil direset. Klik di bawah untuk melihat secara ajaib.</p>
          <button onClick={() => navigate("/login")}>Lanjutkan</button>
          <a href="#" onClick={() => navigate("/login")}>← Kembali ke login</a>
        </div>
      )}

      <div class="right-section">
        <img
          src={lupapassimg}
          alt="Illustration of a person standing next to a large mobile phone displaying a password input screen with a lock icon and a 'Done' button."
          width="500"
          height="500"
        />
      </div>
    </div>
  );
};

export default LupaPass;

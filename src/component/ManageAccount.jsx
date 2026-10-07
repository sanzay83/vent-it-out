import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Loader from "./Loader";

const ManageAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState({ text: "", ok: false });
  const [emailBusy, setEmailBusy] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [pwBusy, setPwBusy] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/signin");
        return;
      }
      setEmail(user.email || "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (profile) {
        setUsername(profile.username);
        localStorage.setItem("username", profile.username);
      } else {
        setUsername(localStorage.getItem("username") || "");
      }
      setLoading(false);
    };
    load();
  }, [navigate]);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailMsg({ text: "", ok: false });
    const next = newEmail.trim();
    if (!next || !next.includes("@")) {
      setEmailMsg({ text: "Enter a valid email address.", ok: false });
      return;
    }
    if (next.toLowerCase() === email.toLowerCase()) {
      setEmailMsg({ text: "That's already your email.", ok: false });
      return;
    }
    setEmailBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: next });
      if (error) throw error;
      setEmailMsg({
        text: "Email updated. If confirmation is required, check your new inbox for the link.",
        ok: true,
      });
      setNewEmail("");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    } catch (err) {
      setEmailMsg({
        text: err.message || "Could not update email. Try again.",
        ok: false,
      });
    }
    setEmailBusy(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg({ text: "", ok: false });
    if (newPassword.length < 8) {
      setPwMsg({ text: "Password must be 8 characters long.", ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: "Passwords don't match.", ok: false });
      return;
    }
    setPwBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setPwMsg({ text: "Password changed successfully.", ok: true });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwMsg({
        text: err.message || "Could not change password. Try again.",
        ok: false,
      });
    }
    setPwBusy(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteMsg("");
    if (deleteInput.trim() !== username) {
      setDeleteMsg("Type your username exactly to confirm.");
      return;
    }
    setDeleteBusy(true);
    try {
      const { error } = await supabase.rpc("delete_own_account");
      if (error) throw error;
      await supabase.auth.signOut();
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setDeleteMsg(err.message || "Could not delete account. Try again.");
      setDeleteBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <Loader />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="auth-wrap">
        <div className="account-box">
          <div className="title">Manage account</div>
          <p className="auth-sub">
            View your identity, update your sign-in details, or leave the
            circle for good.
          </p>

          <div className="account-profile">
            <span className="avatar-dot big">
              {username ? username.charAt(0) : "?"}
            </span>
            <div className="account-identity">
              <div className="account-username">{username}</div>
              <div className="account-email">{email}</div>
            </div>
          </div>

          <div className="account-section">
            <h3>Change email</h3>
            <form onSubmit={handleEmailChange}>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                autoComplete="email"
              />
              <button type="submit" disabled={emailBusy}>
                {emailBusy ? "Updating…" : "Update email"}
              </button>
            </form>
            {emailMsg.text ? (
              <div className={emailMsg.ok ? "auth-success" : "auth-message"}>
                {emailMsg.text}
              </div>
            ) : null}
          </div>

          <div className="account-section">
            <h3>Change password</h3>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (8+ characters)"
                autoComplete="new-password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button type="submit" disabled={pwBusy}>
                {pwBusy ? "Updating…" : "Update password"}
              </button>
            </form>
            {pwMsg.text ? (
              <div className={pwMsg.ok ? "auth-success" : "auth-message"}>
                {pwMsg.text}
              </div>
            ) : null}
          </div>

          <div className="account-section danger-zone">
            <h3>Delete account</h3>
            <p>
              This permanently deletes your account, your vents, your likes,
              and your chat messages. This can't be undone.
            </p>
            {!confirmingDelete ? (
              <button
                className="danger-btn"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete my account
              </button>
            ) : (
              <form onSubmit={handleDelete}>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={`Type "${username}" to confirm`}
                  autoComplete="off"
                />
                <div className="danger-actions">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteInput("");
                      setDeleteMsg("");
                    }}
                  >
                    Keep my account
                  </button>
                  <button
                    type="submit"
                    className="danger-btn solid"
                    disabled={deleteBusy}
                  >
                    {deleteBusy ? "Deleting…" : "Yes, delete everything"}
                  </button>
                </div>
              </form>
            )}
            {deleteMsg ? (
              <div className="auth-message">{deleteMsg}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;

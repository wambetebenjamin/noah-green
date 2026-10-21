"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useRecaptcha } from "@/components/useRecaptcha";

function GoogleButton({ mode }: { mode: "signin" | "signup" }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline-primary w-100 py-2 mb-3"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await signIn("google", { callbackUrl: "/my-account" });
      }}
    >
      {busy ? <Loader2 size={14} className="mr-1" /> : null}
      Continue with Google
    </button>
  );
}

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/my-account";
  const recaptcha = useRecaptcha("signin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    await recaptcha.execute();
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setBusy(false);
    if (res?.error) {
      setError("Email or password not recognised. Check and try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="ng-chart-card">
      <GoogleButton mode="signin" />
      <div className="text-center mb-3" style={{ color: "#6c757d", fontSize: 13 }}>
        or sign in with email
      </div>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            className="form-control"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error ? (
          <p style={{ color: "#dc3545", fontSize: 14 }}>{error}</p>
        ) : null}
        <button type="submit" className="btn btn-primary w-100 py-2" disabled={busy}>
          {busy ? <Loader2 size={14} className="mr-1" /> : <LogIn size={14} className="mr-1" />}
          Sign in
        </button>
      </form>
      <p className="mt-3 mb-0 text-center" style={{ fontSize: 14, color: "#808080" }}>
        New here?{" "}
        <Link href="/auth/signup" className="btn-custom">
          Join the Programme
        </Link>
      </p>
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const recaptcha = useRecaptcha("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const token = await recaptcha.execute();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        recaptchaToken: token,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      setError(data.error || "Signup failed. Please check the form.");
      return;
    }
    const login = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setBusy(false);
    if (login?.error) {
      router.push("/auth/signin?callbackUrl=%2Fmy-account");
      return;
    }
    router.push("/my-account");
    router.refresh();
  };

  return (
    <div className="ng-chart-card">
      <GoogleButton mode="signup" />
      <div className="text-center mb-3" style={{ color: "#6c757d", fontSize: 13 }}>
        or create an account with email
      </div>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            className="form-control"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-phone">Phone, for pickup day calls</label>
          <input
            id="signup-phone"
            className="form-control"
            required
            placeholder="+2547..."
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="signup-password">Password, 8 characters or more</label>
              <input
                id="signup-password"
                type="password"
                className="form-control"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm password</label>
              <input
                id="signup-confirm"
                type="password"
                className="form-control"
                required
                minLength={8}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </div>
          </div>
        </div>
        {error ? (
          <p style={{ color: "#dc3545", fontSize: 14 }}>{error}</p>
        ) : null}
        <button type="submit" className="btn btn-primary w-100 py-2" disabled={busy}>
          {busy ? <Loader2 size={14} className="mr-1" /> : <UserPlus size={14} className="mr-1" />}
          Create my account
        </button>
      </form>
      <p className="mt-3 mb-0 text-center" style={{ fontSize: 14, color: "#808080" }}>
        Already a member?{" "}
        <Link href="/auth/signin" className="btn-custom">
          Sign in
        </Link>
      </p>
    </div>
  );
}

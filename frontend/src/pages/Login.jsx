import { useState } from "react"; import { useNavigate } from "react-router-dom"; import { supabase } from "../lib/supabase";
export default function Login() {
  const [mode, setMode] = useState("login"); const [f, setF] = useState({ email: "", password: "", name: "" }); const [msg, setMsg] = useState(""); const nav = useNavigate();
  async function submit(e) { e.preventDefault(); setMsg("");
    const { error } = mode === "login" ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password }) : await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.name } } });
    if (error) return setMsg(error.message); mode === "login" ? nav("/") : setMsg("Check your email to confirm your account."); }
  return (<form onSubmit={submit} className="card mx-auto max-w-sm space-y-3 p-6"><h1 className="text-xl font-extrabold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
    {mode === "register" && <input className="input" required placeholder="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />}
    <input className="input" type="email" required placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <input className="input" type="password" required minLength={8} placeholder="Password (8+ chars)" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    <button className="btn w-full">{mode === "login" ? "Login" : "Register"}</button>{msg && <p role="alert" className="text-sm">{msg}</p>}
    <button type="button" className="text-sm underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Need an account?" : "Have an account?"}</button></form>);
}

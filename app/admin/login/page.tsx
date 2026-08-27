import { css } from "@/lib/css";
import { loginAction } from "@/app/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={css`max-width:420px;margin:80px auto;padding:0 24px`}>
      <div style={css`background:#fff;border:1px solid #E3EAE8;border-radius:20px;padding:34px`}>
        <div style={css`font-size:13px;font-weight:700;color:#0F5B52;margin-bottom:8px`}>پنل مدیریت</div>
        <h1 style={css`margin:0 0 22px;font-size:23px;font-weight:800`}>ورود مدیر</h1>
        {error && (
          <div style={css`background:#FBEAE8;color:#B4453A;border-radius:10px;padding:12px 14px;font-size:13.5px;margin-bottom:18px`}>
            نام کاربری یا رمز عبور نادرست است.
          </div>
        )}
        <form action={loginAction} style={css`display:grid;gap:12px`}>
          <input
            name="username"
            required
            placeholder="نام کاربری"
            style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="رمز عبور"
            style={css`border:1px solid #E3EAE8;border-radius:10px;padding:13px 14px;font-size:14px;outline:none;background:#F9FBFA`}
          />
          <button
            type="submit"
            style={css`margin-top:8px;border:0;background:#0F5B52;color:#fff;padding:14px;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer`}
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}

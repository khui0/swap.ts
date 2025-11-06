import { render } from "@react-email/render";
import VerifyEmail from "./templates/verify-email";
import ResetPassword from "./templates/reset-password";

export function renderVerifyEmail(url: string) {
  return render(<VerifyEmail url={url} />);
}

export function renderResetPassword(name: string, url: string) {
  return render(<ResetPassword name={name} url={url} />);
}

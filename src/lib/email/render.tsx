import { render } from "@react-email/render";
import VerifyEmail from "./templates/verify-email";

export function renderVerifyEmail(url: string) {
  return render(<VerifyEmail url={url} />);
}

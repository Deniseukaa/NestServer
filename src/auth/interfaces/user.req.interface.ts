import { Role } from "src/common/constants";

export interface UserRequest {
  email: string;
  role: keyof typeof Role;
  stripeId: string;
}

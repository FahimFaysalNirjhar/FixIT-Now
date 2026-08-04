import { UserStatus } from "../../../generated/prisma/enums";

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

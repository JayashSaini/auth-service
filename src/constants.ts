export const MAX_LOGIN_ATTEMPTS = 5;
export const ACCOUNT_LOCK_DURATION = 1; // 1 day

export enum UserRolesEnum {
	ADMIN = "ADMIN",
	USER = "USER",
}

export enum StatusEnum {
	ACTIVE = "ACTIVE",
	SUSPENDED = "SUSPENDED",
	DELETED = "DELETED",
}

export enum LoginTypeEnum {
	ID_PASSWORD = "ID_PASSWORD",
	GOOGLE = "GOOGLE",
}

export const AvailableUserRoles = Object.values(UserRolesEnum);
export const AvailableStatus = Object.values(StatusEnum);
export const AvailableLoginType = Object.values(LoginTypeEnum);

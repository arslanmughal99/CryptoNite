export interface Credential{
  _id?: string;
  username: string;
  password: string;
  color?: string;
  name: string;
}

export interface UpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface masterCheck{
  password: string;
  retype?: string;
}

export type RegisterType = {
  fullName: string;
  email: string;
  password: string;
  role: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type ProfileDetailType = {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  description: string;
  role: string;
  status: string;
};

type User = {
  name: string;
  email: string;
  picture: string;
  token?: string;
};

type Space = {
  id: string;
  name: string;
  description: string;
  users: User[];
};

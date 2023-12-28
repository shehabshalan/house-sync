enum Frequency {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

type User = {
  name: string;
  email: string;
  picture: string;
  token?: string;
};

interface Space {
  id: number;
  name: string;
  description: string;
  users: User[];
}

interface UserTask {
  due_date: string;
  id: number;
  is_completed: boolean;
  task_id: number;
  user_email: string;
}
interface Task {
  id: string;
  name: string;
  description: string;
  space_id: number;
  frequency: Frequency;
  users: UserTask[];
}

interface SpaceDetails extends Space {
  tasks: Task[];
}

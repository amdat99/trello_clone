export type Todo = {
  id: number;
  todo: string;
  isDone: boolean;
};

export type User = {
  id?: string;
  profile_id: string;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  email: string;
  deleted_at?: string | Date;
  password?: string;
  organisations?: string[];
  image?: string;
  admin_id?: string;
  color?: string;
};

export type Board = {
  id?: string;
  org_id: string;
  status: string;
  public_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  deleted_at?: string | Date;
  image?: string;
};

export type List = {
  id?: string;
  org_id: string;
  status: string;
  board_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  has_tasks: boolean;
  name: string;
  org_name?: string;
  deleted_at?: string | Date;
  image?: string;
};

export type Organisation = {
  id?: string;
  user_id?: string;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  deleted_at?: string | Date;
  image?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
};

export type OrgUser = {
  org_id?: string;
  user_id?: string;
  role?: string;
  image?: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  deleted_at?: string | Date;
};

export type Task = {
  id?: string;
  org_id: string;
  public_id: string;
  status: string;
  list_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  description: string;
  labels: string;
  list_name?: string;
  created_by: string;
  assigned_users: string;
  task_activity: string;
  deleted_at?: string | Date;
  image?: string;
  updateList?: boolean;
};

export type CreateVal = {
  name: string;
  description?: string;
  image?: string;
};

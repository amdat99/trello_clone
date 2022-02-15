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
  public_id?: string;
  user_name?: string;
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
  labels?: string | Labels[];
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
  labels?: Labels[];
  list_name?: string;
  created_by: string;
  assigned_users?: Array<AssignedUsers>;
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

export type Labels = {
  name: string;
  color: string;
  data?: string;
  id?: string;
};

export type Activity = {
  name: string;
  message: string;
  receiver?: string;
  date?: string | Date;
  sortDate?: string | Date;
};
type AssignedUsers = {
  name: string;
  color: string;
};

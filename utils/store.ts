export interface AppType {
  info: Info[]
  isAuthenticated: boolean;
  userId: string | undefined;
  drugs: any;
  effects: any;
  schedule: any[]; 
  activeDrug: string;
}

export interface Info{
  name: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  role: string | undefined;
}
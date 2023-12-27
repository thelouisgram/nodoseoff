export interface AppType {
  info: Info[]
  isAuthenticated: boolean;
  userId: string;
  drugs: any;
  effects: any;
  schedule: any[]; 
  activeDrug: string;
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
  role: string ;
}
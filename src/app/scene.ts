import { Action } from './action';

export interface Scene {
  title: string;
  description: string;
  actions: Action[];
}

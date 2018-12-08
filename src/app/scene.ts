import { Action } from './action';

export interface Scene {
  setting: string;
  actions: Action[];
}

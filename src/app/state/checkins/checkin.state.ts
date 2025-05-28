import { CheckinModel } from "./checkins.model";

export interface CheckinState {
  checkins: CheckinModel[];
  loading: boolean;
  error?: any;
}

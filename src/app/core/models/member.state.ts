import { MemberModel } from "./member.interface";

export interface MemberState {
  loading: boolean;
  members: ReadonlyArray<MemberModel>;
  searchTerm: string;
  selectedMember: MemberModel | null;
  availableDays: number; // Add this field
}

// reducers/member.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { MemberState } from 'src/app/core/models/member.state';
import { 
  loadMembers, 
  loadedMembers, 
  setSearchTerm, 
  addMember,
  FormActions, 
  loadedMemberDetail,
  loadMemberDetailFailed,
  loadMembersFailed
} from '../actions/member.actions';

// Estado inicial
export const InitialState: MemberState = {
  loading: false,
  members: [],
  searchTerm: '',
  selectedMember: null,  // Valor inicial

};

// Reducer
export const MemberReducer = createReducer(
  InitialState,
  // Manejo de acciones de Member
  on(loadMembers, (state) => ({
    ...state,
    loading: true
  })),
  on(loadedMembers, (state, { members }) => ({
    ...state,
    loading: false,
    members
  })),
  on(setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm
  })), on(addMember, (state, { member }) => ({
    ...state,
    members: [...state.members, member]
  })),
  on(loadMembersFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(loadedMemberDetail, (state, { member }) => ({
    ...state,
    selectedMember: member, // Actualiza el estado con el miembro seleccionado
    error: null,
  })),
  on(loadMemberDetailFailed, (state, { error }) => ({
    ...state,
    error: error,
  }))
  
);
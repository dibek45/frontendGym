import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { MemberState } from 'src/app/core/models/member.state';
 

export const SelectFeature = (state:AppState)=>state.members;

    

export const selectItemsList = createSelector(
    SelectFeature,
    (state:MemberState) => state.members
  );
export const selectLoading = createSelector(
    SelectFeature,
    (state:MemberState) => state.loading
  );
export const selectSearchTerm = createSelector(
  SelectFeature,
  (state: MemberState) => state.searchTerm
);


  export const selectFilteredMembers = createSelector(
    selectItemsList,
    selectSearchTerm,
    (members, searchTerm) => {
      if (!searchTerm) {
        return members; // Si no hay término de búsqueda, devuelve todos los miembros sin filtrar.
      }
  
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      return members.filter(member => member.name.toLowerCase().includes(lowerSearchTerm));
    }
  );

  export const selectAvailableDays = createSelector(
    SelectFeature,
    (state) => state.availableDays
  );
  

  // Selector para obtener el miembro seleccionado
  export const selectSelectedMember = createSelector(
    SelectFeature,
    (state: MemberState) => state.selectedMember
  );




export const selectMembersState = (state: AppState) => state.members;

// 🔹 Todos los miembros
export const selectAllMembers = createSelector(
  selectMembersState,
  (state: MemberState) => state.members
);

// 🔸 Solo sincronizados
export const selectSyncedMembers = createSelector(
  selectAllMembers,
  members => members.filter(m => m.isSynced === true)
);

// 🔸 Solo pendientes de sincronización
export const selectUnsyncedMembers = createSelector(
  selectAllMembers,
  members => members.filter(m => !m.isSynced)
);

export const selectMembersWithSyncError = createSelector(
  selectAllMembers,
  members => members.filter(m => m.syncError === true)
);

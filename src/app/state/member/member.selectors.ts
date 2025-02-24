import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MemberModel } from 'src/app/core/models/member.interface';
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
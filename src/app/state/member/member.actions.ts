import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { MemberModel } from '../../core/models/member.interface';

export const loadMembers = createAction(
  '[Load usuario gym]',
  props<{ gymId: number }>() // Se agrega gymId como propiedad
);
export const loadedMembers = createAction(
    '[Retrieved user gym List]', props<{ members: ReadonlyArray<MemberModel> }>(),
);


export const setSearchTerm = createAction(
    '[Set search term]', props<{ searchTerm: string }>());


export const addMember = createAction(
        '[Add Member]', 
        props<{ member: MemberModel }>()
      );

export const updateMember = createAction(
        '[Members] Update Member',
        props<{ tempId: string, updatedMember: MemberModel }>()
      );
      
      // Acciones del formulario (solo las necesarias)
 export const FormActions = createActionGroup({
        source: 'Form',
        events: {
          'Form Submitted': emptyProps(),  // No lleva datos adicionales
          'Form Reset': emptyProps(),      // No lleva datos adicionales
          'Image Captured': emptyProps(),  // No lleva datos adicionales
          'Form Error': emptyProps()        // No lleva datos adicionales
        }
      });


      export const loadMemberDetail = createAction(
        '[Load Member Detail]',
        props<{ gymId: number, memberId: number }>()
      );
      
      export const loadedMemberDetail = createAction(
        '[Retrieved Member Detail]',
        props<{ member: MemberModel }>()
      );
      
      export const loadMemberDetailFailed = createAction(
        '[Load Member Detail Failed]',
        props<{ error: any }>()
      );
      export const loadMembersFailed = createAction(
        '[Load Members Failed]',
        props<{ error: any }>()
      );

      // 1) Add new actions for updating available days
      export const updateAvailableDays = createAction(
        '[Member] Update Available Days',
        props<{ memberId: number; days: number }>()
      );

      export const updateAvailableDaysSuccess = createAction(
        '[Member] Update Available Days Success',
        props<{ days: number }>()
      );

      export const updateAvailableDaysFailure = createAction(
        '[Member] Update Available Days Failure',
        props<{ error: any }>()
      );


     
      
      export const syncMemberSuccess = createAction(
        '[Members] Sync Member Success',
        props<{ tempId: string; updatedMember: MemberModel }>()
      );
      
      export const syncMemberFailure = createAction(
        '[Members] Sync Member Failure',
        props<{ tempId: string; error: any }>()
      );

    
      
      export const syncMember = createAction(
        '[Members] Sync Member',
        props<{ member: MemberModel }>()
      );
      
      export const syncMemberUpdate = createAction(
        '[Members] Sync Member Update',
        props<{ member: MemberModel }>()
      );
   
      
   
      
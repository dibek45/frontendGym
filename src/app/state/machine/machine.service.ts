import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MachineModel } from './machine.model';

@Injectable({ providedIn: 'root' })
export class MachineService {
  private apiUrl = 'http://localhost:3000/graphql';

  constructor(private http: HttpClient) {}

  getMachinesByGym(gymId: number): Observable<MachineModel[]> {
    const query = `
      query {
        machinesByGym(gymId: ${gymId}) {
          id
          name
          gymId
          qrs {
            id
            code
          }
        }
      }
    `;
    return this.http.post<any>(this.apiUrl, { query }).pipe(
      map(response => response.data.machinesByGym)
    );
  }

  createMachine(machine: MachineModel): Observable<MachineModel> {
    const mutation = `
      mutation {
        createMachine(createMachine: {
          name: "${machine.name}",
          gymId: ${machine.gymId}
        }) {
          id
          name
          gymId
          qrs {
            id
            code
          }
        }
      }
    `;
    return this.http.post<any>(this.apiUrl, { query: mutation }).pipe(
      map(response => response.data.createMachine)
    );
  }

  updateMachine(machine: MachineModel): Observable<MachineModel> {
    const query = `
      mutation UpdateMachine($updateMachineInput: UpdateMachineInput!) {
        updateMachine(updateMachineInput: $updateMachineInput) {
          id
          name
          description
          gymId
          isActive
          qrs {
            id
            code
            machineId
          }
        }
      }
    `;

    return this.http
      .post<any>(this.apiUrl, {
        query,
        variables: {
          updateMachineInput: machine,
        },
      })
      .pipe(map((result) => result.data.updateMachine));
  }

  deleteMachine(id: number): Observable<boolean> {
    const query = `
      mutation DeleteMachine($id: Int!) {
        deleteMachine(id: $id)
      }
    `;

    return this.http
      .post<any>(this.apiUrl, {
        query,
        variables: { id },
      })
      .pipe(map((result) => result.data.deleteMachine));
  }
}

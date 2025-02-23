import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './rol.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/graphql'; // Adjust based on backend

  constructor(private http: HttpClient) {}

  // Fetch all roles
  getRolesAndPermissions(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      query: `
        query AllPermissions {
  rolesnew {
    allPermissions {
      id
      name
      category
      description
    }
    roles {
      id
      name
      permissions {
        id
        name
        description
        category
      }
      description
    }
  }
}`
    });
  }

  // Create a role
  createRole(createRoleInput: Partial<Role>): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation CreateRole($createRoleInput: CreateRoleInput!) {
        createRole(createRoleInput: $createRoleInput) {
          id
          name
          description
          gymId
          created_at
          updated_at
        }
      }`,
      variables: { createRoleInput }
    });
  }

  // Update a role
  updateRole(id: number, updateRoleInput: Partial<Role>): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {
        updateRole(updateRoleInput: $updateRoleInput) {
          id
          name
          description
          gymId
          created_at
          updated_at
        }
      }`,
      variables: { updateRoleInput: { id, ...updateRoleInput } }
    });
  }

  // Delete a role
  deleteRole(id: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { deleteRole(id: ${id}) }`
    });
  }
}

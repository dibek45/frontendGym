import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = 'http://localhost:3000/graphql';

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `query { permissions { id name } }`
    });
  }

  createPermission(name: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { createPermission(createPermissionInput: { name: "${name}" }) { id name } }`
    });
  }

  updatePermission(id: number, name: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { updatePermission(updatePermissionInput: { id: ${id}, name: "${name}" }) { id name } }`
    });
  }

  deletePermission(id: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      query: `mutation { deletePermission(id: ${id}) }`
    });
  }
}

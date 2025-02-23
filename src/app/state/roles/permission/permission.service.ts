import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from './permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = 'https://your-api-url.com/permissions'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all permissions
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }

  // Create a new permission
  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  // Update an existing permission
  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.apiUrl}/${permission.id}`, permission);
  }

  // Delete a permission by ID
  deletePermission(permissionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${permissionId}`);
  }
}

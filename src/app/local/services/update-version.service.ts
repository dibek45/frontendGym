import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.prod';

export interface UpdateVersion {
  id: number;
  gym_id: number;
  table_name: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateVersionService {
  private graphqlEndpoint = environment.apiUrl;

  constructor(private http: HttpClient) {}

getUpdateVersionsByGym(gymId: number, tableName?: string): Promise<UpdateVersion[]> {
  const query = `
    query GetAllUpdateVersions($gymId: Float!) {
      getAllUpdateVersions(gymId: $gymId) {
        id
        gym_id
        table_name
        updated_at
      }
    }
  `;

  return this.http
    .post<{ data: { getAllUpdateVersions: UpdateVersion[] } }>(this.graphqlEndpoint, {
      query,
      variables: { gymId }
    })
    .toPromise()
    .then(res => {
      const list = res?.data?.getAllUpdateVersions ?? [];
      return tableName ? list.filter(v => v.table_name === tableName) : list;
    });
}
    

async getVersionMapByGym(gymId: number): Promise<Map<string, string>> {
  const versions = await this.getUpdateVersionsByGym(gymId);
  const versionMap = new Map<string, string>();

  for (const v of versions) {
    const table = v.table_name?.trim().toLowerCase();
    const updated = v.updated_at ?? new Date().toISOString();

    if (table) {
      versionMap.set(table, new Date(updated).toISOString());
      console.log(`📌 Agregando '${table}' -> ${updated}`);
    }
  }
console.log('🧾 versionMap completo:', Array.from(versionMap.entries()));

  return versionMap;
}


}

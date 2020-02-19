import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CKAN_User } from '../newgroup/newgroup.component';

@Injectable({ providedIn: 'root' })
export class GroupsService {

  /** start http service client */
  constructor(private http: HttpClient) {
  }

  public async get_groups(): Promise<any> {
    const response = await this.http.get(`http://127.0.0.1:8090/api/v1.0/groups`).toPromise();
    return response['groups'];
  }

  public async get_categories(): Promise<any> {
    const response = await this.http.get(`http://127.0.0.1:8090/api/v1.0/categories`).toPromise();
    return response;
  }

  public async get_users(): Promise<any> {
    const response = await this.http.get(`http://localhost:5000/api/3/action/user_list`).toPromise();
    return response;
  }

  public async get_users_db(): Promise<any> {
    const response = await this.http.get(`http://localhost:8090/api/v1.0/users`).toPromise();
    return response;
  }

  public async create_group(userToken: string, name: string, description: string, image: string, maintainer: string, language: string, users: CKAN_User[], created_on: string, ckan_api_key: string): Promise<any> {
          
    /*
    CREATE GROUP
    */
    const reponseGroup = await this.http.post(`http://127.0.0.1:8090/api/v1.0/groups`, {'name': name, 'abstract': description,  'maintainer': maintainer, 'created_on': created_on, 'language': language, 'image': 'assets/images/ocean-snow-island.jpg'}, {
      headers: new HttpHeaders ({
          Authorization: 'Bearer ' + userToken
      })
      }).toPromise();

      let group_id = reponseGroup[0]['group_id']

    for (let index = 0; index < users.length; index++) {
      
      /*
      CREATE USER_GROUP_REL
      */
      const responseUserGroup = await this.http.post(`http://127.0.0.1:8090/api/v1.0/user_group_rel`, {'user_id': users[index].user_id, 'group_id': group_id}, {
        headers: new HttpHeaders ({
            Authorization: 'Bearer ' + userToken
        })
        }).toPromise();
    }

    /*
    CREATE GROUP CKAN
    */
    const responseGroupCkan = await this.http.post(`http://localhost:5000/api/3/action/group_create`, {'name': name, 'title': name, 'description': description, 'state': 'active', 'users': users }, {
      headers: new HttpHeaders ({
        Authorization: ckan_api_key
      })
    }).toPromise();

      return reponseGroup;
  }
}
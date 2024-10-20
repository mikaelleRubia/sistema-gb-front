import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../../core/login/interface/login-response';
import { TProfile } from '../../types/profile-response.type';

@Injectable({
  providedIn: 'root',
})
export class LoginRegisterService {
  private readonly prefix = 'https://sistema-grupo-brasileiro-backend.onrender.com/api/v1/auth';

  constructor(private httpClient: HttpClient) { }

  registerUser(
    name: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string,
    sector: string,
    occupation: string,
    agency: string,
    avatar: number = 1,
    profile: number = 3
  ) {
    const payload = {
      employeeForm: {
        name,
        lastname,
        phoneNumber,
        sector,
        occupation,
        agency,
        avatar
      },
      userForm: {
        email,
        password,
        profile
      }
    };

    return this.httpClient.post(`${this.prefix}/register`, payload);
  }

  registerCollaborator(
    name: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string,
    sector: string,
    occupation: string,
    agency: string,
    avatar: number = 1,
    profile: number = 2,
  ) {
    const payload = {
      employeeForm: {
        name,
        lastname,
        phoneNumber,
        sector,
        occupation,
        agency,
        avatar
      },
      userForm: {
        email,
        password,
        profile
      }
    };

    return this.httpClient.post(`${this.prefix}/register`, payload);
  }

  loginUser(email: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(`${this.prefix}/login`, {
        email,
        password,
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          sessionStorage.setItem('idUser', value.employee.id.toString());
          sessionStorage.setItem('userRole', value.employee.userView.profileView.description);

          const userProfile: TProfile = {
            userId: value.employee.id,
            email: value.employee.userView.email = email,
            name: value.employee.name,
            lastname: value.employee.lastname,
            phone: value.employee.phonenumber,
            sector: value.employee.sector,
            occupation: value.employee.occupation,
            agency: value.employee.agency,
          };

          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        })
      );
  }

  recoveryPassword(email: string) {
    return this.httpClient
      .post(`${this.prefix}/requestReset`, { email }, { responseType: 'text' });
  }


  resetPassword(password: string, token: string) {
    return this.httpClient
      .post(`${this.prefix}/resetPassword`, { password, token }, { responseType: 'text' });
  }

  getUserRole() {
    return sessionStorage.getItem('userRole');
  }


  getUserName(): string | null {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      const userProfile: TProfile = JSON.parse(profile);
      return userProfile.name + " " + userProfile.lastname;
    }
    return null;
  }

  getUserProfile(): TProfile | null {
    const profile = sessionStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('auth-token');
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('idUser');
    sessionStorage.clear();
  }
}

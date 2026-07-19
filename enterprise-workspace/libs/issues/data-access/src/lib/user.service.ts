import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  // We moved the mock data here!
  private user = { 
    name: 'Jane Doe', 
    role: 'System Administrator', 
    email: 'jane@enterprise.com' 
  };

  getCurrentUser() {
    return this.user;
  }
}
export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  age: number;
  gender: string;
  pastIllnesses: string;
}

export interface UserProfileFormData {
  name: string;
  age: string; // Using string for form input
  gender: string;
  pastIllnesses: string;
}

export const defaultUserProfile: UserProfileFormData = {
  name: '',
  age: '',
  gender: '',
  pastIllnesses: ''
};
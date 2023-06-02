export interface UserInput {
  // this model comes from B2C, thats why we cant enforce camelCase here
  iss: string;
  exp: number;
  nbf: number;
  aud: string;
  // sub: string;
  name: string;

  // given_name: string;

  // family_name: string;
  emails: string[];
  tfp: string;
  scp: string;
  azp: string;
  ver: string;
  iat: number;
}

export interface UserModel {
  // id: string;
  email: string;
  name: string;
  // firstName: string;
  // lastName: string;
  picture: string;
}

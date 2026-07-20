import { Workspace } from "./workspace.type";



export interface SocialLink {
  url: string;
  visible: boolean;
}


export interface  User {
  _id: string;

  fullName: string;
  email: string;

  banner?: string;
  profilePic?: string;
  about?: string;

  gender?: "male" | "female" | "other";

  location?: string;

  socials?: {
    linkedin:   SocialLink;
    github:     SocialLink;
    x:          SocialLink;
    facebook:   SocialLink;
    instagram:  SocialLink;
    youtube:    SocialLink;
    discord:    SocialLink;
  };

  defaultWorkspace?: Workspace; 

  createdAt: string;
  updatedAt?: string; 

}
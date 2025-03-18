/*
 * File: post.ts
 */

export interface Pagination {
  CurrentPage: number;
  TotalPages: number;
  PageSize: number;
  TotalCount: number;
  HasPrevious: boolean;
  HasNext: boolean;
}

export interface PostListResponse {
  data: PostForList[];
  pagination: Pagination;
}

export interface Location {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
}

export interface Image {
  id: string;
  path: string;
  order: number;
}

export interface Plan {
  id: number;
  priorityLevel: number;
  duration: number;
  price: number;
}

export interface User {
  id: string;
  fullName: string;
  avatar: string;
  contactPhoneNumber: string;
  zalo: string | null;
  facebook: string | null;
}


export interface PostForList {
  id: string;
  title: string;
  price: number;
  isNegotiatedPrice: boolean;
  address: string | null;
  area: number;
  description: string | null;
  latitude: number;
  longitude: number;
  thumbnail: string;
  ward: Location | null;
  district: Location | null;
  province: Location | null;
  regionAddress: string;
  bedRoomCount: number;
  bathRoomCount: number;
  planPriority: number;
  createdAt: string;
  createdUser: User;
  isHidden: boolean;
  isApproved: boolean;
  isDeleted: boolean;
}



export interface PostDetail {
  id: string;
  title: string;
  price: number;
  isNegotiatedPrice: boolean;
  address: string;
  area: number;
  description: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  isHidden: boolean;
  isApproved: boolean;
  ward: Location;
  district: Location;
  province: Location;
  bedRoomCount: number;
  bathRoomCount: number;
  planPriority: number;
  plans: Plan[]; // Định nghĩa cụ thể cấu trúc mảng plans
  image360: string | null;
  panorama: string | null;
  images: Image[];
  createdUser: User;
}

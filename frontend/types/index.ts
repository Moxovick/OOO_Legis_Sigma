export interface Setting {
  key: string;
  value: string | null;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ServiceDetail extends Service {
  content_design: string | null;
  content_install: string | null;
  content_maintain: string | null;
}

export interface Offer {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  sort_order: number;
}

export interface Lead {
  id: number;
  name: string | null;
  phone: string;
  message: string | null;
  form_type: string;
  created_at: string;
  is_read: boolean;
}

export interface LeadList {
  items: Lead[];
  total: number;
  page: number;
  per_page: number;
}

export type SettingsMap = Record<string, string>;

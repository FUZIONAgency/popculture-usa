export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogTagRelation {
  id: string;
  blog_id: string | null;
  tag_id: string | null;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  blog_image_url: string | null;
  author_id: string | null;
  status: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
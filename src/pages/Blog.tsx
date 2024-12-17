import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  blog_image_url: string | null;
  published_at: string | null;
  tags: { name: string; slug: string }[];
};

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("blogs")
        .select(`
          id,
          title,
          slug,
          excerpt,
          blog_image_url,
          published_at,
          blog_tags_relation(
            blog_tags(name, slug)
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;

      return posts.map((post) => ({
        ...post,
        tags: post.blog_tags_relation?.map((relation: any) => relation.blog_tags) || [],
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pop Culture & Gaming Blog | Latest News & Updates</title>
        <meta name="description" content="Stay updated with the latest news in gaming, pop culture, conventions, and community events. Read articles, guides, and insights from our community." />
        <meta property="og:title" content="Pop Culture & Gaming Blog | Latest News & Updates" />
        <meta property="og:description" content="Stay updated with the latest news in gaming, pop culture, conventions, and community events. Read articles, guides, and insights from our community." />
        <meta name="keywords" content="gaming news, pop culture blog, convention updates, community stories, gaming guides" />
      </Helmet>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="hover-card h-full">
                {post.blog_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.blog_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  {post.published_at && (
                    <p className="text-sm text-gray-500">
                      {format(new Date(post.published_at), "MMMM d, yyyy")}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.slug} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;

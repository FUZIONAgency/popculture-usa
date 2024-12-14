import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_tags_relation(
            blog_tags(name, slug)
          )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;

      return {
        ...data,
        tags: data.blog_tags_relation?.map((relation: any) => relation.blog_tags) || [],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="h-64 bg-gray-200 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <button
          onClick={() => navigate("/blog")}
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to blog
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <button
        onClick={() => navigate("/blog")}
        className="text-blue-500 hover:underline flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={16} /> Back to blog
      </button>
      
      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>
        {post.published_at && (
          <p className="text-gray-500">
            Published on {format(new Date(post.published_at), "MMMM d, yyyy")}
          </p>
        )}
        
        {post.blog_image_url && (
          <img
            src={post.blog_image_url}
            alt={post.title}
            className="w-full rounded-lg shadow-lg my-8"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: { name: string; slug: string }) => (
            <Badge key={tag.slug} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
};

export default BlogPost;
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
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
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
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <button
          onClick={() => navigate("/blog")}
          className="text-primary hover:text-primary/80 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate("/blog")}
          className="text-primary hover:text-primary/80 flex items-center gap-2 mb-8"
        >
          <ArrowLeft size={16} /> Back to blog
        </button>
        
        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {post.published_at && (
              <time className="text-muted-foreground block mb-4">
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </time>
            )}
            
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: { name: string; slug: string }) => (
                  <Badge key={tag.slug} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {post.blog_image_url && (
              <img
                src={post.blog_image_url}
                alt={post.title}
                className="w-full rounded-lg shadow-md mb-8 object-cover h-[400px]"
              />
            )}

            {post.excerpt && (
              <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
                {post.excerpt}
              </p>
            )}
          </header>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  author: {
    name: string | null;
  };
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center py-4">No posts found</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  <Link href={`/posts/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600">
                  by {post.author?.name || 'Unknown'} • {post.published ? 'Published' : 'Draft'}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                #{post.id}
              </span>
            </div>
            <p className="mt-2 text-gray-700 line-clamp-2">{post.content}</p>
            <Link 
              href={`/posts/${post.id}`} 
              className="inline-block mt-3 text-blue-500 hover:underline text-sm"
            >
              Read more →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
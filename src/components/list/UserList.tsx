'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  name: string | null;
  posts: Post[];
}

interface Post {
  id: number;
  title: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border p-4 rounded">
          <h3 className="font-medium">{user.name || 'Anonymous'}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.posts.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold">Posts:</p>
              <ul className="text-xs space-y-1 mt-1">
                {user.posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
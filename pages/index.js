import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => setPosts(data));
    }
  }, [session]);

  if (!session) {
    return (
      <>
        <p>Not signed in</p>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </>
    );
  }

  return (
    <>
      <p>Signed in as {session.user.email} <button onClick={() => signOut()}>Sign out</button></p>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/post/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

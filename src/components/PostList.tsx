export function PostList({ list }) {
  return (
    <ol>
      {list.map(({ id, title, body }) => (
        <li key={id}>
          <h2>
            {id}. {title}
          </h2>
          <p>{body}</p>
        </li>
      ))}
    </ol>
  );
}
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";

export default function Test (){
  const location = useLocation();
  const { selectedTest, selectedDate } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage =1;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const firstPostIndex = (currentPage - 1) * postsPerPage;
  const lastPostIndex = firstPostIndex + postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Selected Test: {selectedTest}</p>
      <p>Selected Date: {selectedDate}</p>

      <main>
        <PostList list={currentPosts} />
      </main>

      <footer>
        <Pagination
          postsNum={posts.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </footer>
    </div>
  )
}
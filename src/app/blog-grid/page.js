"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import BlogSidebar from "@/components/BlogSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header/Header";
import { db } from "../../lib/firebaseConfig"; 
import { ref, onValue } from "firebase/database";
import DOMPurify from "dompurify";

export default function BlogGrid() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  useEffect(() => {
    const blogRef = ref(db, 'blogs');
    onValue(blogRef, (snapshot) => {
      const data = snapshot.val();
      const blogList = [];
      for (let id in data) {
        blogList.push({ id, ...data[id] });
      }
      setBlogs(blogList);
    });
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Breadcrumbs title="Blog Grid" menuText="Blog Grid" />
      <section className="blog grid section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12">
              <div className="row">
                {currentPosts.map((blog) => (
                  <div key={blog.id} className="col-lg-6 col-md-6 col-12">
                    <Link href={`/blog-single/${blog.id}`}>
                      <BlogCard
                        image={blog.thumbnail}
                        date={blog.date}
                        title={blog.title}
                        desc={DOMPurify.sanitize(blog.content).replace(/<\/?[^>]+(>|$)/g, "")}
                      />
                    </Link>
                  </div>
                ))}
                <div className="col-12">
                  <div className="pagination">
                    <ul className="pagination-list">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={currentPage === index + 1 ? 'active' : ''}>
                          <Link href="#" onClick={() => paginate(index + 1)}>
                            {index + 1}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="#" onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>
                          <i className="icofont-rounded-right"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-12">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

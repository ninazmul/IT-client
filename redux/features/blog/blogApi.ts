import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch all blogs
    getAllBlogs: builder.query({
      query: () => ({
        url: "all-blog",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Query to fetch a single blog by ID
    getSingleBlog: builder.query({
      query: (id) => ({
        url: `blog/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Mutation to upload a new blog (admin only)
    uploadBlog: builder.mutation({
      query: (blogData) => ({
        url: "upload-blog", // This gets appended to the base URL
        method: "POST",
        body: blogData,
        credentials: "include" as const,
      }),
    }),

    // Mutation to delete a blog by ID (admin only)
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blog/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

// Exporting hooks for the blog endpoints
export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useUploadBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

import { useUploadBlogMutation } from "@/redux/features/blog/blogApi";
import { useState } from "react";
import { toast } from "react-hot-toast";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState<File | null>(null); // Explicitly type the file
  const [uploadBlog, { isLoading }] = useUploadBlogMutation(); // Track loading state

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Ensure file exists before setting it
    setHeaderImage(file || null); // Set file or null if no file selected
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!title || !description || !headerImage) {
      toast.error("Please fill out all fields.");
      return;
    }

    // Create form data object to include file and text inputs
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("headerImage", headerImage);

    try {
      // Call the uploadBlog mutation to send the blog data to the backend
      await uploadBlog(formData).unwrap();

      toast.success("Blog uploaded successfully!");

      // Clear the form after successful submission
      setTitle("");
      setDescription("");
      setHeaderImage(null);
    } catch (error) {
      // Type-check or cast 'error' to safely handle it
      if (error instanceof Error) {
        // Handle known Error types
        toast.error(error.message);
      } else if ((error as any)?.data?.message) {
        // Handle custom API errors
        toast.error((error as any).data.message);
      } else {
        // Fallback for unknown errors
        toast.error("Failed to upload blog. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-[80%] m-auto mt-24">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="headerImage"
          className="block text-sm font-medium text-gray-700"
        >
          Header Image
        </label>
        <input
          type="file"
          id="headerImage"
          onChange={handleImageUpload}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          accept="image/*"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading} // Disable the button while loading
        className={`mt-4 px-4 py-2 rounded-md text-white ${
          isLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Uploading..." : "Upload Blog"}
      </button>
    </form>
  );
};

export default CreateBlog;

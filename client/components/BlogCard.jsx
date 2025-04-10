export default function BlogCard({ blog }) {
    return (
      <div className="border p-4 rounded shadow-md bg-white">
        <h3 className="text-xl font-bold">{blog.title}</h3>
        <p className="text-sm text-gray-600 mb-2">By {blog.author}</p>
        <p>{blog.content}</p>
      </div>
    );
  }
  
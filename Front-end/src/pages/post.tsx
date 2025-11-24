import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { createPost, getAll } from "../services/post"

export default function Post() {
  const [post, setPost] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  const fetchData = async (pageNumber = 1) => {
    try {
      const data = await getAll(pageNumber, 2)
      setPost(data?.data)
      setTotalPage(data?.totalPages)
      setPage(pageNumber)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSavePost = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("tags", tags)
      if (image) formData.append("image", image)

      const res = await createPost(formData)
      console.log("Post created:", res)
      await fetchData(1)

      setTitle("")
      setContent("")
      setTags("")
      setImage(null)
      setPreview("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* FORM CARD */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create New Post</h2>

        <form onSubmit={handleSavePost} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none h-32 resize-none"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-lg"
          />

          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                className="w-full h-60 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
          >
            Save Post
          </button>
        </form>
      </div>

      {/* POSTS LIST */}
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">All Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {post.map((p: any, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-xl transition rounded-2xl border overflow-hidden"
          >
            <img
              src={p?.imageURL}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">{p?.title}</h3>
              <p className="text-gray-600 mb-2">{p?.content}</p>
              <p className="text-sm text-blue-600 font-medium">#{p?.tags}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-10">
        <button
          onClick={() => fetchData(page - 1)}
          disabled={page === 1}
          className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>

        <div className="font-semibold text-gray-700">
          Page {page} of {totalPage}
        </div>

        <button
          onClick={() => fetchData(page + 1)}
          disabled={page === totalPage}
          className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

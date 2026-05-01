import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/course/all");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 Filter logic
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Explore Courses 🔍
      </h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-6"
      />

      {/* COURSE LIST */}
      <div className="grid grid-cols-2 gap-6">

        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="border p-5 rounded shadow"
          >
            <h2 className="text-xl font-bold">
              {course.title}
            </h2>

            <p className="text-gray-600">
              Tutor: {course.tutorId?.name}
            </p>

            <p className="font-bold mt-2">
              ₹{course.price}
            </p>

            <button
              onClick={() => navigate(`/course/${course._id}`)}
              className="bg-purple-600 text-white px-4 py-2 mt-4 rounded"
            >
              View Course
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
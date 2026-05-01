import { Link } from "react-router-dom";

export default function Landing(){
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-purple-600">
          EduSite
        </h1>

        <div className="flex gap-6 items-center">
          <Link to="/login" className="font-medium">
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center mt-24 px-4">

        <p className="text-purple-500 mb-4">
          ⚡ Launch your teaching website in minutes
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          Build Your Own Teaching <br/>
          <span className="text-purple-600">
            Website in Minutes
          </span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl mx-auto">
          Create a professional, branded website for your courses.
          Upload content, manage students, and get paid — all in one place.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            Start Free Trial
          </Link>

          <button className="border px-6 py-3 rounded-lg">
            Watch Demo
          </button>
        </div>

        <p className="text-gray-500 mt-4 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>

      </section>
    </div>
  );
}

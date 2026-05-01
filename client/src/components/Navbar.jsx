const Navbar = () => {
    return (
      <nav className="flex justify-between items-center px-10 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-purple-600">EduSite</h1>
  
        <div className="flex gap-8 items-center text-gray-700 font-medium">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Testimonials</a>
  
          <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700">
            Get Started
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  
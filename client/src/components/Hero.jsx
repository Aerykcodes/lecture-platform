const Hero = () => {
    return (
      <section className="text-center mt-24 px-6">
        <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm">
          ⚡ Launch your teaching website in minutes
        </span>
  
        <h2 className="text-6xl font-bold mt-6 leading-tight">
          Build Your Own Teaching <br />
          <span className="text-purple-600">Website in Minutes</span>
        </h2>
  
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg">
          Create a professional, branded website for your courses.
          Upload content, manage students, and get paid — all in one place.
        </p>
  
        <div className="mt-10 flex gap-5 justify-center">
          <button className="bg-purple-600 text-white px-7 py-3 rounded-xl text-lg hover:bg-purple-700">
            Start Free Trial
          </button>
  
          <button className="border px-7 py-3 rounded-xl text-lg hover:bg-gray-100">
            Watch Demo
          </button>
        </div>
  
        <p className="mt-4 text-gray-400 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>
    );
  };
  
  export default Hero;
  
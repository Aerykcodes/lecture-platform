export default function Features() {
    return (
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-12">
          Everything You Need to Teach Online
        </h2>
  
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Custom Branding",
            "Course Management",
            "Student Management",
            "Analytics Dashboard",
            "Secure & Reliable",
            "Lightning Fast",
          ].map((item, i) => (
            <div key={i} className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{item}</h3>
              <p className="text-gray-500">
                Powerful tools to grow your teaching business.
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
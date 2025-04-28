import Link from 'next/link';

const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6 leading-tight">
          Book Doctor Appointments <span className="text-blue-600">with Ease</span>
        </h1>
        
        <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Find and book your preferred doctor in just a few clicks. Our platform makes healthcare access simple, fast, and reliable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard/patient/book-appointments" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
            aria-label="Book an appointment now"
          >
            Book Now
          </Link>
          
          <Link 
            href="/doctors" 
            className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-3 px-8 rounded-lg border border-blue-200 transition duration-300"
            aria-label="Browse our doctors"
          >
            Browse Doctors
          </Link>
        </div>
        
        <div className="mt-12 flex justify-center gap-8 text-gray-600">
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple check icon component
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default Banner;
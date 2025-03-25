import Image from "next/image";

export const LandingPage: React.FC = () => {
  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-gray-50 to-white">
      <section className="pt-12 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="px-6 text-lg text-gray-600 font-inter">
              Create, Edit, and Share Your Media Like Never Before
            </h1>
            <p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
              Transform your images with{" "}
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative">custom overlays</span>
              </span>
            </p>

            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
              A powerful media editor that lets you add custom text overlays,
              edit images, and manage your media gallery with ease.
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
              <a
                href="/edit"
                className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-blue-600 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                role="button"
              >
                Start Editing
              </a>
              <a
                href="/galleries"
                className="inline-flex items-center justify-center w-full px-8 py-3 mt-4 text-lg font-bold text-gray-900 transition-all duration-200 border-2 border-gray-300 sm:w-auto sm:mt-0 rounded-xl font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-50"
                role="button"
              >
                View Gallery
              </a>
            </div>

            <p className="mt-8 text-base text-gray-500 font-inter">
              No credit card required · Free plan available
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Custom Text Overlays
                </h3>
                <p className="text-gray-600">
                  Add and position text overlays with complete control over
                  placement and style
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Media Management</h3>
                <p className="text-gray-600">
                  Organize and manage your images and videos in one central
                  gallery
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Download and share your edited media instantly
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent"></div>
          <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  className="w-full h-auto object-cover"
                  src="https://ik.imagekit.io/gus5alhna/Screenshot%20from%202024-12-25%2019-49-31.png?updatedAt=1742913428082"
                  alt="Media Editor Preview"
                  width={1200}
                  height={675}
                  priority
                />
                {/* Optional: Add a gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

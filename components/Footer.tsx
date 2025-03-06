'use client'
function Footer() {
    return (
      <>
          <footer className="bg-emerald-900 text-emerald-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">VARK Learning Styles</h3>
                <p className="mb-4">
                  Discover your unique learning preferences and optimize your educational journey with our comprehensive
                  VARK assessment.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick as</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About VARK
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Learning Resources
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      For Educators
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Research
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li>support@varklearning.com</li>
                  <li>1-800-LEARN-VARK</li>
                  <li>123 Education Ave, Learning City</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-sm">
              <p>© {new Date().getFullYear()} VARK Learning Styles. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </>
  )}
  
  export default Footer
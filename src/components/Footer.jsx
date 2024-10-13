import React from 'react'

const Footer = () => {
  return (
    <>
    <footer class="bg-gray-800 text-white py-6 mt-10">
      <div class="container mx-auto text-center">
        <p class="text-sm">&copy; 2024 EnerXchange. All rights reserved.</p>
        <ul class="flex justify-center space-x-6 mt-2">
          <li>
            <a href="#privacy" class="hover:text-gray-400 transition duration-300">Privacy Policy</a>
          </li>
          <li>
            <a href="#terms" class="hover:text-gray-400 transition duration-300">Terms of Service</a>
          </li>
        </ul>
      </div>
    </footer>
    </>
  )
}

export default Footer

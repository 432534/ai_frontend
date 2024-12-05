"use client"
const Navbar = () => {
  return <div>
    <header className='bg-gray-300 text-gray-900 mt-0'>
        <div className='container mx-auto flex justify-between items-center py-4 px-6'>
            <h1 className='font-bold text-xl flex items-center'>
                <span className='text-indigo-600'>
                ZEKO
                </span>
                <span className='ml-2 text-sm text-gray-500'>
                    AI
                </span>
            </h1>
            <div className="w-[100vw] flex justify-center">
                <button className='p-2 flex '>
                    <svg xmlns='https://w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    </svg>
                </button>
            </div>
        </div>
    </header>
  </div>
}

export default Navbar
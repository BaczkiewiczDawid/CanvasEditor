import React from 'react';
import Logo from './assets/images/logo.svg';
import Text from './assets/images/text.svg';
import Image from './assets/images/img.svg';
import Background from './assets/images/background.svg';
import Reset from "./assets/images/reset.svg";

function App() {
    return (
        <div className="min-w-screen min-h-screen flex bg-white px-24 py-8">
            <div className="w-2/5 bg-primary25 min-h-full flex flex-col justify-center items-center">
                <div className="w-24 h-36 border border-purple-700 rounded-md flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </div>
                <div className={"w-2/5 h-1 bg-primary50 opacity-50 mt-4 rounded-full"}></div>
                <div className="text-center flex flex-col items-center justify-center gap-y-3 mt-4 w-2/3">
                    <h1 className="text-xl font-bold text-gray-900">Create your own Poster!</h1>
                    <p className="font-medium text-sm text-gray-700">
                        It's so simple. Start creating your own poster by clicking one of the action buttons located on the right.
                    </p>
                    <p className="font-light text-gray-600 text-xs">(Ratio 4:5)</p>
                </div>
            </div>
            <div className="w-3/5 bg-gray-50 min-h-full px-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <img src={Logo} alt={"Canvas Editor"} />
                        <h1 className="font-bold text-gray-800 text-32 ml-4">CanvasEditor</h1>
                    </div>
                    <button className={"border-b-2 border-redPrimary flex items-center justify-between gap-x-2"}>
                        <p className="text-redPrimary text-sm">Reset</p>
                        <img src={Reset} alt="Reset" className={"w-6"} />
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-medium font-bold text-gray-800 mb-4">Add content</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow-sm flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center mb-2">
                                <img className={"w-[32px] h-[32px]"} src={Text} alt={"Text"} />
                            </div>
                            <p className="text-18 text-black100 font-medium">Text</p>
                        </div>
                        <div className="bg-white p-16 rounded shadow-sm flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center mb-2">
                                <img className={"w-[32px] h-[32px]"} src={Image} alt={"Image"} />
                            </div>
                            <p className="text-18 text-black100 font-medium">Image</p>
                        </div>
                        <br></br>
                        <div className="bg-white p-4 rounded shadow-sm flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center mb-2">
                                <img className={"w-[32px] h-[32px]"} src={Background} alt={"Background"} />
                            </div>
                            <p className="text-18 text-black100 font-medium">Background</p>
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex justify-end">
                    <button className="bg-primary text-white py-2 px-4 rounded hover:bg-buttonHover focus:border-primary50 disabled:bg-black25 transition-colors">
                        Export to PNG
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;

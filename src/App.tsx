import React from 'react';

function App() {
    return (
        <div className="min-w-screen min-h-screen flex py-4 px-16">
            <div className={"w-2/5 bg-blue-500 min-h-full flex flex-col justify-center items-center"}>
                <div className={"w-24 h-36 bg-red-300"}></div>
                <div className={"text-center flex flex-col items-center justify-center gap-y-4 mt-4 w-2/3"}>
                    <h1 className={"text-2xl font-bold"}>Create your own Poster!</h1>
                    <p>It's so simple. Start createing your own poster by clicking one of the action buttons locaten on
                        the right.</p>
                    <p className={"font-light"}>(Ratio 4:5)</p>
                </div>

            </div>
            <div className={"w-3/5 bg-red-500 min-h-full"}>B</div>
        </div>
    );
}

export default App;

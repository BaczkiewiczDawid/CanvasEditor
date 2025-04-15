import React, {useRef, useState} from 'react';
import Logo from './assets/images/logo.svg';
import Text from './assets/images/text.svg';
import Image from './assets/images/img.svg';
import Reset from "./assets/images/reset.svg";
import Move from "./assets/images/move.svg";
import Delete from "./assets/images/delete.svg";
import Warning from "./assets/images/alert.svg";
import {Button} from "./components/button";
import Close from "./assets/images/close.svg"
import Background from "./assets/images/background.svg";

type CanvasItem = {
    id: number;
    type: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    dragging: boolean;
    isDraggable: boolean;
    width?: number;
    height?: number;
    alt?: string;
}

function App() {
    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const backgroundInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [dragOffsetX, setDragOffsetX] = useState<number>(0);
    const [dragOffsetY, setDragOffsetY] = useState<number>(0);

    const handleBackgroundSelectorClick = () => {
        if (backgroundInputRef.current) {
            backgroundInputRef.current.click();
        }
    }

    const handleImageSelectorClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    }

    const handleFileChange = (e: any, type: "image" | "background") => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        if (type === "background") {
            if (canvasItems.find((item) => item.type === 'background')) {
                const updatedItems = canvasItems.map((item) => {
                    if (item.type === 'background') {
                        return {
                            ...item,
                            content: URL.createObjectURL(file),
                        };
                    }
                    return item;
                });
                setCanvasItems(updatedItems);
                return;
            } else {
                setCanvasItems([...canvasItems, {
                    id: canvasItems.length + 1,
                    type: "background",
                    content: URL.createObjectURL(file),
                    x: 0,
                    y: 0,
                    fontSize: 0,
                    color: "#000000",
                    dragging: false,
                    isDraggable: false,
                }]);
            }
        } else if (type === "image") {
            const newImage = {
                id: canvasItems.length + 1,
                type: "image",
                content: URL.createObjectURL(file),
                x: 150,
                y: 150,
                fontSize: 0,
                color: "#000000",
                dragging: false,
                isDraggable: true,
            }

            setCanvasItems([...canvasItems, newImage]);
        } else {
            return
        }

    }


    const handleText = () => {
        const newText = {
            id: canvasItems.length + 1,
            type: "text",
            content: "New text",
            x: 150,
            y: 150,
            fontSize: 18,
            color: "#000000",
            dragging: false,
            isDraggable: true,
        }

        setCanvasItems([...canvasItems, newText]);
    }


    const handleMouseDown = (e: React.MouseEvent, id: number) => {
        const draggedItem = canvasItems.find(item => item.id === id);
        if (!draggedItem || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();

        const offsetX = e.clientX - rect.left - draggedItem.x;
        const offsetY = e.clientY - rect.top - draggedItem.y;

        setDragOffsetX(offsetX);
        setDragOffsetY(offsetY);

        const updatedItems = canvasItems.map(item => {
            if (item.id === id) {
                return {...item, dragging: true};
            }
            return item;
        });
        setCanvasItems(updatedItems);
    };

    const handleMoveItem = (e: React.MouseEvent) => {
        if (!canvasItems.some((item) => item.dragging) || !canvasRef.current) {
            return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const draggingItem = canvasItems.find(item => item.dragging);

        if (!draggingItem) return;

        let x = e.clientX - rect.left - dragOffsetX;
        let y = e.clientY - rect.top - dragOffsetY;

        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        const itemWidth = draggingItem.width || 100;
        const itemHeight = draggingItem.height || 50;

        if (draggingItem.type === 'image') {
            x = Math.max(0, Math.min(x, canvasWidth));
            y = Math.max(0, Math.min(y, canvasHeight));
        } else {
            x = Math.max(0, Math.min(x, canvasWidth - itemWidth));
            y = Math.max(0, Math.min(y, canvasHeight - itemHeight));
        }

        const updatedItems = canvasItems.map((item) => {
            if (item.dragging) {
                return {
                    ...item,
                    x,
                    y,
                };
            }
            return item;
        });

        setCanvasItems(updatedItems);
    };

    const handleMouseUp = () => {
        const updatedItems = canvasItems.map(item => {
            if (item.dragging) {
                return {...item, dragging: false};
            }
            return item;
        });
        setCanvasItems(updatedItems);
    };

    const deleteItem = (id: number) => {
        const updatedItems = canvasItems.filter(item => item.id !== id);
        setCanvasItems(updatedItems);
    }

    const colors = [
        '#000000',
        '#FFFFFF',
        '#FF0000',
        '#0000FF',
        '#00FF00',
    ];

    const handleColorChange = (color: string, id: number) => {
        const updatedItems = canvasItems.map(item => {
            if (item.id === id) {
                return {...item, color};
            }
            return item;
        });
        setCanvasItems(updatedItems);
    }

    const handleResetCanvas = () => {
        setCanvasItems([])
    }

    return (
        <div className="min-w-screen min-h-screen flex bg-white px-24 py-8">
            {/* @ts-ignore */}
            <div ref={canvasRef}
                 onMouseMove={(e) => handleMoveItem(e)}
                 onMouseUp={handleMouseUp}
                 className="w-2/5 bg-primary25 min-h-full flex flex-col justify-center items-center max-h-screen">
                {canvasItems.length === 0 ? (
                    <div
                        className={"w-full bg-primary25 min-h-full flex flex-col justify-center items-center max-h-screen"}>
                        <div className="w-24 h-36 border border-purple-700 rounded-md flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                 className="text-purple-700">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <div className={"w-2/5 h-1 bg-primary50 opacity-50 mt-4 rounded-full"}></div>
                        <div className="text-center flex flex-col items-center justify-center gap-y-3 mt-4 w-2/3">
                            <h1 className="text-xl font-bold text-black100">Create your own Poster!</h1>
                            <p className="font-medium text-sm text-black75">
                                It's so simple. Start creating your own poster by clicking one of the action buttons
                                located on
                                the right.
                            </p>
                            <p className="font-light text-black75 text-xs">(Ratio 4:5)</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`w-full h-full relative ${canvasItems.find((item) => item.type === 'background') ? 'bg-cover bg-center' : 'bg-black75'}`}
                        style={{backgroundImage: `url(${canvasItems.find((item) => item.type === 'background')?.content})`}}>
                        {canvasItems.map((item: any) => {
                            if (item.type === 'text') {
                                return (
                                    <div
                                        key={item.id}
                                        className={"relative border-2 border-primary p-8"}
                                        style={{
                                            position: 'absolute',
                                            left: item.x,
                                            top: item.y,
                                            minWidth: '100px',
                                            minHeight: '50px',
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border cursor-move"
                                            onMouseDown={(e) => handleMouseDown(e, item.id)}
                                        >
                                            <img src={Move} alt={"Move"} className={"w-4 h-4 select-none"}
                                                 onDragStart={(e) => e.preventDefault()}/>
                                        </div>
                                        <div
                                            className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2 border cursor-pointer"
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            <img src={Delete} alt={"Delete item"} className={"w-4 h-4"}/>
                                        </div>
                                        <div
                                            className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center translate-x-1/2 translate-y-1/2">
                                            <div
                                                className="w-4 h-4 bg-primary border-white border-2 rounded-full"></div>
                                        </div>
                                        <input
                                            className="text-center bg-transparent border-none outline-none w-full"
                                            style={{
                                                color: item.color,
                                                fontSize: `${item.fontSize}px`,
                                            }}
                                            value={item.content}
                                            placeholder="Type your text here"
                                            onChange={(e) => {
                                                const updatedItems = canvasItems.map((i) => {
                                                    if (i.id === item.id) {
                                                        return {...i, content: e.target.value};
                                                    }
                                                    return i;
                                                });
                                                setCanvasItems(updatedItems);
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-0 translate-y-8 flex space-x-2">
                                            {colors.map((color) => (
                                                <div
                                                    key={color}
                                                    className={`w-4 h-4 rounded-full cursor-pointer ${item.color === color ? 'ring-2 ring-white' : ''}`}
                                                    style={{
                                                        backgroundColor: color,
                                                        border: color === '#FFFFFF' ? '1px solid #D3D3D3' : 'none'
                                                    }}
                                                    onClick={() => handleColorChange(color, item.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            } else if (item.type === 'image') {
                                return (
                                    <div
                                        key={item.id}
                                        className={"relative border-2 border-primary p-2"}
                                        style={{
                                            position: 'absolute',
                                            left: item.x,
                                            top: item.y,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border cursor-move"
                                            onMouseDown={(e) => handleMouseDown(e, item.id)}
                                        >
                                            <img src={Move} alt={"Move"} className={"w-4 h-4"}/>
                                        </div>
                                        <div
                                            className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2 border cursor-pointer"
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            <img src={Delete} alt={"Delete item"} className={"w-4 h-4"}/>
                                        </div>
                                        <div
                                            className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center translate-x-1/2 translate-y-1/2">
                                            <div
                                                className="w-4 h-4 bg-primary border-white border-2 rounded-full"></div>
                                        </div>
                                        <img
                                            src={item.content}
                                            alt={item.alt || "Canvas image"}
                                            style={{
                                                maxWidth: item.width || '300px',
                                                maxHeight: item.height || '200px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
            <div className="w-3/5  min-h-full px-8 flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={Logo} alt={"Canvas Editor"}/>
                        <h1 className="font-bold text-black100 text-32 ml-4">CanvasEditor</h1>
                    </div>
                    <button className={"border-b-2 border-redPrimary flex items-center justify-between gap-x-2"}
                            onClick={() => {
                                setIsModalOpen(true)
                            }}>
                        <p className="text-redPrimary text-sm">Reset</p>
                        <img src={Reset} alt="Reset" className={"w-6"}/>
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-medium font-bold text-gray-800 mb-4 bg-white97 p-4">Add content</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <button onClick={handleText}
                                className="bg-white97 p-4 rounded shadow-sm flex flex-col items-center justify-center ">
                            <div className="flex items-center justify-center mb-2">
                                <img className={"w-32 h-32"} src={Text} alt={"Text"}/>
                            </div>
                            <p className="text-18 text-black100 font-medium">Text</p>
                        </button>
                        <div>
                            <button
                                className="bg-white97 p-4 rounded shadow-sm flex flex-col items-center justify-center"
                                onClick={handleImageSelectorClick}
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <img className={"w-32 h-32"} src={Image} alt={"Image"}/>
                                </div>
                                <p className="text-18 text-black100 font-medium">Image</p>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "image")}
                                ref={imageInputRef}
                                className="hidden"/>
                        </div>
                        <div>
                            <button
                                onClick={handleBackgroundSelectorClick}
                                className="bg-white97 p-4 rounded shadow-sm flex flex-col items-center justify-center w-full"
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <img className={"w-32 h-32"} src={Background} alt={"Background"}/>
                                </div>
                                <p className="text-18 text-black100 font-medium">Background</p>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "background")}
                                ref={backgroundInputRef}
                                className="hidden"/>
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex justify-end">
                    <Button text={"Export to PNG"}/>
                </div>
            </div>
            {isModalOpen && (
                <div className={"absolute left-0 top-0 w-screen h-screen"}>
                    <div className={"absolute left-0 top-0 w-screen h-screen bg-black opacity-40 z-999"}></div>
                    <div
                        className={"w-1/2 py-16 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg flex flex-col items-center justify-center z-1000"}>
                        <button className={"absolute top-6 right-6"} onClick={() => setIsModalOpen(false)}>
                            <img src={Close} alt={"Close modal"} className={"w-4 h-4"}/>
                        </button>
                        <img src={Warning} alt={"Warning"} className={"w-1/4"}/>
                        <div className={"w-3/4 text-center"}>
                            <h2 className={"font-bold text-32 text-black"}>Warning</h2>
                            <p className={"font-medium text-18 text-center text-black75"}>You're about to reset your
                                whole progress.
                                Are you sure you want to do it?</p>
                            <div className={"flex gap-x-4 justify-center mt-8"}>
                                <button className={"font-medium text-18"} onClick={() => setIsModalOpen(false)}>Cancel
                                </button>
                                <Button text={"Reset"} onClick={() => {
                                    handleResetCanvas()
                                    setIsModalOpen(false)
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

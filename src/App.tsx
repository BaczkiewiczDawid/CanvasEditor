import React, {useRef, useState} from 'react';
import Move from "./assets/images/move.svg";
import Delete from "./assets/images/delete.svg";
import {Button} from "./components/button";
import Background from "./assets/images/background.svg";
import {Header} from "./components/header";
import {ActionButton} from "./components/action-button";
import Image from "./assets/images/img.svg"
import Text from "./assets/images/text.svg"
import {Modal} from "./components/modal";
import html2canvas from 'html2canvas';

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
    resizing?: boolean;
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
    const [resizeStartX, setResizeStartX] = useState<number>(0);
    const [resizeStartY, setResizeStartY] = useState<number>(0);
    const [initialWidth, setInitialWidth] = useState<number>(0);
    const [initialHeight, setInitialHeight] = useState<number>(0);
    const [initialFontSize, setInitialFontSize] = useState<number>(0);
    const [isChanged, setIsChanged] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const colors = [
        '#000000',
        '#FFFFFF',
        '#FF0000',
        '#0000FF',
        '#00FF00',
    ];

    const handleImageSelectorClick = (type: "image" | "background") => {
        if (type === "background") {
            if (backgroundInputRef.current) {
                backgroundInputRef.current.click();
            }
        } else if (type === "image") {
            if (imageInputRef.current) {
                imageInputRef.current.click();
            }
        } else {
            return
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
                width: 300,
                height: 200,
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
            content: "Type your text here",
            x: 100,
            y: 150,
            fontSize: 18,
            color: "#000000",
            dragging: false,
            isDraggable: true,
            width: 200,
            height: 50,
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

    const handleResizeStart = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const resizingItem = canvasItems.find(item => item.id === id);

        if (!resizingItem) return;

        setResizeStartX(e.clientX - rect.left);
        setResizeStartY(e.clientY - rect.top);
        setInitialWidth(resizingItem.width || 200);
        setInitialHeight(resizingItem.height || 50);
        setInitialFontSize(resizingItem.fontSize);

        const updatedItems = canvasItems.map(item => {
            if (item.id === id) {
                return {...item, resizing: true};
            }
            return item;
        });

        setCanvasItems(updatedItems);
    };

    const handleMoveItem = (e: React.MouseEvent) => {
        if (!canvasRef.current) {
            return;
        }

        const rect = canvasRef.current.getBoundingClientRect();

        const resizingItem = canvasItems.find(item => item.resizing);
        if (resizingItem) {
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            const deltaX = currentX - resizeStartX;
            const deltaY = currentY - resizeStartY;

            const newWidth = Math.max(50, initialWidth + deltaX);
            const newHeight = Math.max(30, initialHeight + deltaY);

            let newFontSize = resizingItem.fontSize;
            if (resizingItem.type === 'text') {
                const scaleFactor = newHeight / initialHeight;
                newFontSize = Math.max(10, Math.round(initialFontSize * scaleFactor));
            }

            const updatedItems = canvasItems.map(item => {
                if (item.resizing) {
                    return {
                        ...item,
                        width: newWidth,
                        height: newHeight,
                        fontSize: item.type === 'text' ? newFontSize : item.fontSize
                    };
                }
                return item;
            });

            setCanvasItems(updatedItems);
            return;
        }

        const draggingItem = canvasItems.find(item => item.dragging);
        if (!draggingItem) return;

        let x = e.clientX - rect.left - dragOffsetX;
        let y = e.clientY - rect.top - dragOffsetY;

        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        const itemWidth = draggingItem.width || 100;
        const itemHeight = draggingItem.height || 50;

        x = Math.max(0, Math.min(x, canvasWidth - itemWidth));
        y = Math.max(0, Math.min(y, canvasHeight - itemHeight));

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
            if (item.dragging || item.resizing) {
                return {...item, dragging: false, resizing: false};
            }
            return item;
        });
        setCanvasItems(updatedItems);
    };

    const deleteItem = (id: number) => {
        const updatedItems = canvasItems.filter(item => item.id !== id);
        setCanvasItems(updatedItems);
    }

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

    const exportCanvasToPng = async () => {
        if (!canvasRef.current || canvasItems.length === 0) {
            return;
        }

        try {
            setIsExporting(true);

            const controlsClass = 'canvas-export-controls';
            const controlElements = canvasRef.current.querySelectorAll(
                `.${controlsClass}`
            );

            controlElements.forEach(el => {
                (el as HTMLElement).style.display = 'none';
            });

            const canvas = await html2canvas(canvasRef.current, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                allowTaint: true,
                useCORS: true
            });

            controlElements.forEach(el => {
                (el as HTMLElement).style.display = '';
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'my-poster.png';
            link.href = dataUrl;
            link.click();

        } catch (error) {
            console.error("Error exporting canvas:", error);
            alert("An error occurred while exporting. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-w-screen min-h-screen flex bg-white px-24 py-8">
            {/* @ts-ignore */}
            <div ref={canvasRef}
                 onMouseMove={(e) => handleMoveItem(e)}
                 onMouseUp={handleMouseUp}
                 className="w-2/5 bg-primary25 min-h-full flex flex-col justify-center items-center max-h-screen relative overflow-hidden">
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
                        className={`w-full h-full ${canvasItems.find((item) => item.type === 'background') ? 'bg-cover bg-center' : 'bg-black75'}`}
                        style={{backgroundImage: `url(${canvasItems.find((item) => item.type === 'background')?.content})`}}>
                        {canvasItems.map((item: any) => {
                            if (item.type === 'text') {
                                return (
                                    <div
                                        key={item.id}
                                        className="relative border-2 border-primary p-4 flex items-center justify-center"
                                        style={{
                                            position: 'absolute',
                                            left: item.x,
                                            top: item.y,
                                            width: item.width || 'auto',
                                            height: item.height || 'auto',
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border cursor-move"
                                            onMouseDown={(e) => handleMouseDown(e, item.id)}
                                        >
                                            <img src={Move} alt="Move" className="w-4 h-4 select-none"
                                                 onDragStart={(e) => e.preventDefault()}/>
                                        </div>

                                        <div
                                            className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center translate-x-1/2 -translate-y-1/2 border cursor-pointer"
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            <img src={Delete} alt="Delete item" className="w-4 h-4"
                                                 onDragStart={(e) => e.preventDefault()}/>
                                        </div>

                                        <div
                                            className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center translate-x-1/2 translate-y-1/2 cursor-se-resize"
                                            onMouseDown={(e) => handleResizeStart(e, item.id)}
                                        >
                                            <div className="w-4 h-4 bg-primary border-white border-2 rounded-full"/>
                                        </div>

                                        <div
                                            className="bg-transparent border-none outline-none text-center whitespace-pre-wrap break-words min-w-[50px] min-h-[24px] w-full h-full flex items-center justify-center"
                                            contentEditable
                                            suppressContentEditableWarning
                                            ref={(el) => {
                                                if (el && el.innerText !== item.content) {
                                                    el.innerText = item.content;
                                                }
                                            }}
                                            style={{
                                                color: item.color,
                                                fontSize: `${item.fontSize}px`,
                                                opacity: isChanged ? 1 : .25,
                                            }}
                                            onInput={(e) => {
                                                const newValue = (e.target as HTMLElement).innerText;
                                                const updatedItems = canvasItems.map((i) =>
                                                    i.id === item.id ? {...i, content: newValue} : i
                                                );

                                                setIsChanged(true)
                                                setCanvasItems(updatedItems);
                                            }}/>

                                        <div className="absolute bottom-0 left-0 translate-y-8 flex space-x-2">
                                            {colors.map((color) => (
                                                <div
                                                    key={color}
                                                    className={`w-4 h-4 rounded-full cursor-pointer ${item.color === color ? 'ring-2 ring-white' : ''}`}
                                                    style={{
                                                        backgroundColor: color,
                                                        border: color === '#FFFFFF' ? '1px solid #D3D3D3' : 'none',
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
                                            width: item.width || '300px',
                                            height: item.height || '200px',
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
                                            className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center translate-x-1/2 translate-y-1/2 cursor-se-resize"
                                            onMouseDown={(e) => handleResizeStart(e, item.id)}
                                        >
                                            <div
                                                className="w-4 h-4 bg-primary border-white border-2 rounded-full"></div>
                                        </div>
                                        <img
                                            src={item.content}
                                            alt={item.alt || "Canvas image"}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
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
                <Header setIsModalOpen={setIsModalOpen}/>
                <div className="mt-8">
                    <h2 className="text-medium font-bold text-gray-800 mb-4 bg-white97 p-4">Add content</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <ActionButton onClick={handleText} name={"Text"} image={Text}/>
                        <ActionButton onClick={() => handleImageSelectorClick("image")}
                                      handleFileChange={handleFileChange}
                                      imageInputRef={imageInputRef} image={Image}
                                      name={"Image"}/>
                        <ActionButton onClick={() => handleImageSelectorClick("background")}
                                      handleFileChange={(e: any) => handleFileChange(e, "background")}
                                      imageInputRef={backgroundInputRef}
                                      image={Background}
                                      name={"Background"}
                        />
                    </div>
                </div>
                <div className="mt-auto flex justify-end">
                    <Button disabled={!canvasItems.length} onClick={exportCanvasToPng} text={"Export to PNG"}/>
                </div>
            </div>
            {isModalOpen && (
                <Modal setIsModalOpen={setIsModalOpen} handleResetCanvas={handleResetCanvas}/>
            )}
        </div>
    );
}

export default App;
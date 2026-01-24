import { useGame } from "../context/GameContext";
import { useEffect, useState } from "react";
import { IoThunderstormSharp } from "react-icons/io5";

function HighstormModal() {
    const { showHighstormModal, setShowHighstormModal } = useGame()

    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!showHighstormModal) return;

        setIsClosing(false);

        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [showHighstormModal]);

    const handleClose = () => {
        setIsClosing(true);

        setTimeout(() => {
            setShowHighstormModal(false);
            setIsClosing(false);
        }, 500);
    };

    const animationClass = isClosing 
        ? "animate-fade-out"
        : "animate-blurred-fade-in";

    if (!showHighstormModal) return null

    return (
        <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center ${animationClass} `}>
            <div className="bg-radial text-blue-200/60 text-5xl from-gray-800 border-none w-300 py-20 px-30 text-center relative flex flex-col items-center space-y-6 select-none">
                <IoThunderstormSharp className="text-8xl"/>
                <div>A highstorm passes by</div>
                <div>and diminishes your troops</div>
            </div>
        </div>
    );
}

export default HighstormModal;
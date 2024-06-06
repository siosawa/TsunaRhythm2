import React from 'react';
import Image from 'next/image';

const ClamCafe = () => {
    return (
        <div className="flex items-center justify-center fixed inset-0 z-10">
                <Image 
                    src="/CalmCafe.PNG" 
                    alt="Calm Cafe" 
                    width={800} 
                    height={600} 
                    layout="intrinsic" 
                />
        </div>
    );
}

export default ClamCafe;

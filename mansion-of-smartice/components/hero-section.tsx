// Hero Section Component - 野百灵·贵州酸汤
// Features responsive fullscreen video background with bilingual hero text
// Video plays at 1/3 speed for cinematic effect

'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './hero-section.module.css'

export function HeroSection() {
    const [language, setLanguage] = useState<'en' | 'cn'>('cn');
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.0; // Play at normal speed
        }
        // Trigger animations after component mounts
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    return (
        <>
            {/* Fullscreen Cover with Video Background */}
            <div className="relative h-screen w-full overflow-hidden">
                {/* Fullscreen Background Video */}
                <video 
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/hero-background.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                {/* Hero Content */}
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white px-6 z-10">
                        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 tracking-wider drop-shadow-2xl whitespace-nowrap ${
                            isLoaded ? styles.heroTitle : ''
                        }`}>
                            野百灵·贵州酸汤
                        </h1>
                        <p className={`text-xl md:text-2xl lg:text-3xl font-light mb-4 drop-shadow-lg ${
                            isLoaded ? styles.heroSubtitle1 : ''
                        }`}>
                            出山入林，一川一味
                        </p>
                        <p className={`text-lg md:text-xl lg:text-2xl font-light drop-shadow-md ${
                            isLoaded ? styles.heroSubtitle2 : ''
                        }`}>
                            Yunnan · Guizhou · Sichuan Bistro
                        </p>
                        
                        {/* Decorative divider with unfold animation */}
                        <div className="flex items-center justify-center mt-8 overflow-hidden">
                            <div className={`h-px bg-white/50 ${
                                isLoaded ? styles.decorativeLine : ''
                            }`}></div>
                            <div className={`w-2 h-2 mx-3 bg-white/60 rounded-full ${
                                isLoaded ? styles.decorativeDot : ''
                            }`}></div>
                            <div className={`h-px bg-white/50 ${
                                isLoaded ? styles.decorativeLine : ''
                            }`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specials Section - Authentic Regional Dishes */}
            <section id="specials" className="py-20 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-light text-center mb-4">今日特色 Today&apos;s Specials</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
                        云贵川经典风味 · Authentic Flavors from the Mountains
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Special Item 1 - Guizhou Sour Fish Soup */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">贵州酸汤鱼</h3>
                            <p className="text-sm text-gray-500 mb-2">Guizhou Sour Fish Soup</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                传统红酸汤配新鲜江团鱼，番茄与野山椒的完美融合
                            </p>
                            <p className="text-2xl font-light">¥168</p>
                        </div>

                        {/* Special Item 2 - Sichuan Boiled Fish */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">川味水煮鱼</h3>
                            <p className="text-sm text-gray-500 mb-2">Sichuan Boiled Fish</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                麻辣鲜香，花椒与辣椒的经典搭配，鱼片嫩滑
                            </p>
                            <p className="text-2xl font-light">¥158</p>
                        </div>

                        {/* Special Item 3 - Yunnan Crossing Bridge Noodles */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">云南过桥米线</h3>
                            <p className="text-sm text-gray-500 mb-2">Yunnan Crossing Bridge Noodles</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                滚烫鸡汤配十余种新鲜配菜，传统工艺米线
                            </p>
                            <p className="text-2xl font-light">¥88</p>
                        </div>

                        {/* Special Item 4 - Guizhou Huaxi Beef Noodles */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">花溪牛肉粉</h3>
                            <p className="text-sm text-gray-500 mb-2">Huaxi Beef Rice Noodles</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                贵州特色牛肉粉，香浓牛骨汤配秘制辣椒油
                            </p>
                            <p className="text-2xl font-light">¥68</p>
                        </div>

                        {/* Special Item 5 - Sichuan Mapo Tofu */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">麻婆豆腐</h3>
                            <p className="text-sm text-gray-500 mb-2">Mapo Tofu</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                正宗川味，麻辣鲜香烫，嫩豆腐配牛肉末
                            </p>
                            <p className="text-2xl font-light">¥48</p>
                        </div>

                        {/* Special Item 6 - Tea & Dim Sum Set */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">下午茶点套餐</h3>
                            <p className="text-sm text-gray-500 mb-2">Afternoon Tea Set</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                精选云贵小吃配普洱茶，14:00-17:00供应
                            </p>
                            <p className="text-2xl font-light">¥98/2人</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* About Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">关于我们 About</h3>
                            <p className="text-gray-400 text-sm">
                                野百灵·贵州酸汤，专注云贵川传统美食，
                                将山野风味带入都市，一川一味，匠心独运。
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Authentic Yunnan-Guizhou-Sichuan cuisine, 
                                bringing mountain flavors to the city.
                            </p>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">快速链接 Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/menu" className="text-gray-400 hover:text-white">菜单 Menu</a></li>
                                <li><a href="/ingredients" className="text-gray-400 hover:text-white">食材 Ingredients</a></li>
                                <li><a href="/gallery" className="text-gray-400 hover:text-white">相册 Gallery</a></li>
                                <li><a href="/our-team" className="text-gray-400 hover:text-white">团队 Our Team</a></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">联系方式 Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>北京市朝阳区三里屯</li>
                                <li>Sanlitun, Chaoyang District, Beijing</li>
                                <li>电话 Tel: 010-8888-6666</li>
                                <li>微信 WeChat: wildlark_bistro</li>
                                <li>info@wildlark-bistro.com</li>
                            </ul>
                        </div>

                        {/* Hours Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">营业时间 Hours</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>午餐 Lunch: 11:30 - 14:30</li>
                                <li>晚餐 Dinner: 17:30 - 22:00</li>
                                <li>周末早午餐 Weekend Brunch:</li>
                                <li>周六日 Sat-Sun: 10:00 - 15:00</li>
                                <li>每周一休息 Closed on Mondays</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>&copy; 2024 野百灵·贵州酸汤 Wildlark · Guizhou Sour Soup. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
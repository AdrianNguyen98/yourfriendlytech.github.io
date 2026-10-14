// =========================================================================
        // 1. Apple-Grade Kinetic Smooth Scroll Engine (Lenis)
        // =========================================================================
        function initAppleSmoothScroll() {
            // Respect user motion preferences
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            if (typeof Lenis === 'undefined') {
                return;
            }

            if (window.lenis && typeof window.lenis.destroy === 'function') {
                window.lenis.destroy();
            }

            const lenis = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential deceleration ease-out
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.0,
                touchMultiplier: 1.0,
                syncTouch: false, // Maintain native 120Hz gesture response on iOS/Android
                infinite: false,
                autoRaf: true,
                anchors: {
                    offset: -76
                }
            });

            window.lenis = lenis;

            // Handle anchor navigation if URL already has a hash on initial load
            if (window.location.hash) {
                const initialTarget = document.querySelector(window.location.hash);
                if (initialTarget) {
                    setTimeout(() => {
                        lenis.scrollTo(initialTarget, { offset: -76, immediate: false, duration: 1.15 });
                    }, 150);
                }
            }
        }

        // =========================================================================
        // 2. Apple Keynote Scroll & Appear Motion Engine
        // =========================================================================
        function initAppleAppearEngine() {
            const targets = document.querySelectorAll('.reveal-element, .apple-reveal, .apple-reveal-zoom, [data-apple-appear]');
            if (!targets.length) return;

            // Respect user motion preferences
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                targets.forEach(el => el.classList.add('is-visible'));
                return;
            }

            const appearObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            targets.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    requestAnimationFrame(() => {
                        el.classList.add('is-visible');
                    });
                } else {
                    appearObserver.observe(el);
                }
            });
        }

        function initGlobalLabExperience() {
            initAppleSmoothScroll();
            initAppleAppearEngine();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGlobalLabExperience);
        } else {
            initGlobalLabExperience();
        }

        // =========================================================================
        // 3. Mobile Hamburger Navigation
        // =========================================================================
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });

        // =========================================================================
        // 4. Device & Service Catalog (Metadata Only — All Prices Kept on Backend)
        // =========================================================================
        let currentPartGrade = 'premium'; 

        const gradeConfig = {
            aftermarket: { label: 'Aftermarket (Budget)', warranty: '3 Months Warranty' },
            premium: { label: 'Premium (OEM-Spec)', warranty: '3 Months Warranty' },
            genuine: { label: 'Genuine (Original Pack)', warranty: '3 Months Warranty' }
        };

        const phone13Services = [
            { id: 'screen', name: 'Screen Replacement' },
            { id: 'battery', name: 'Battery' },
            { id: 'back_glass', name: 'Back Glass Replacement' },
            { id: 'charging', name: 'Charging Socket' },
            { id: 'rear_camera', name: 'Rear Camera' },
            { id: 'front_camera', name: 'Front Camera' },
            { id: 'rear_lens', name: 'Rear Camera Lens' },
            { id: 'ear_speaker', name: 'Ear Speaker/Ear Speaker Flex' },
            { id: 'vibrator', name: 'Vibrator' },
            { id: 'power_flex', name: 'Power Button Flex' },
            { id: 'volume_flex', name: 'Mute and Volume Button Flex' },
            { id: 'nfc', name: 'Wireless Charging Pad (NFC)' },
            { id: 'sim_tray', name: 'Sim Tray' }
        ];

        const catalog = {
            iphone: {
                name: 'Apple iPhone', supportsGrades: true,
                models: [
                    { id: 'ip18pm', name: 'iPhone 18 Pro Max' },
                    { id: 'ip18p', name: 'iPhone 18 Pro' },
                    { id: 'ip17pm', name: 'iPhone 17 Pro Max' },
                    { id: 'ip17p', name: 'iPhone 17 Pro' },
                    { id: 'ip17air', name: 'iPhone Air (17 Air)' },
                    { id: 'ip17', name: 'iPhone 17' },
                    { id: 'ip17e', name: 'iPhone 17e' },
                    { id: 'ip16pm', name: 'iPhone 16 Pro Max' },
                    { id: 'ip16p', name: 'iPhone 16 Pro' },
                    { id: 'ip16plus', name: 'iPhone 16 Plus' },
                    { id: 'ip16', name: 'iPhone 16' },
                    { id: 'ip16e', name: 'iPhone 16e' },
                    { id: 'ip15pm', name: 'iPhone 15 Pro Max' },
                    { id: 'ip15p', name: 'iPhone 15 Pro' },
                    { id: 'ip15plus', name: 'iPhone 15 Plus' },
                    { id: 'ip15', name: 'iPhone 15' },
                    { id: 'ip14pm', name: 'iPhone 14 Pro Max' },
                    { id: 'ip14p', name: 'iPhone 14 Pro' },
                    { id: 'ip14plus', name: 'iPhone 14 Plus' },
                    { id: 'ip14', name: 'iPhone 14' },
                    { id: 'ip13pm', name: 'iPhone 13 Pro Max' },
                    { id: 'ip13p', name: 'iPhone 13 Pro' },
                    { id: 'ip13', name: 'iPhone 13' },
                    { id: 'ip13mini', name: 'iPhone 13 mini' },
                    { id: 'ip12pm', name: 'iPhone 12 Pro Max' },
                    { id: 'ip12p', name: 'iPhone 12 Pro' },
                    { id: 'ip12', name: 'iPhone 12' },
                    { id: 'ip12mini', name: 'iPhone 12 mini' },
                    { id: 'ip11pm', name: 'iPhone 11 Pro Max' },
                    { id: 'ip11p', name: 'iPhone 11 Pro' },
                    { id: 'ip11', name: 'iPhone 11' },
                    { id: 'ipxsmax', name: 'iPhone XS Max' },
                    { id: 'ipxs', name: 'iPhone XS' },
                    { id: 'ipxr', name: 'iPhone XR' },
                    { id: 'ipx', name: 'iPhone X' },
                    { id: 'ipse3', name: 'iPhone SE (3rd Gen, 2022)' },
                    { id: 'ipse2', name: 'iPhone SE (2nd Gen, 2020)' },
                    { id: 'ip8plus', name: 'iPhone 8 Plus' },
                    { id: 'ip8', name: 'iPhone 8' }
                ],
                services: phone13Services
            },
            apple_ipad: {
                name: 'Apple iPad', supportsGrades: true,
                models: [
                    { id: 'ipad_pro_13_m4', name: 'iPad Pro 13" (M4)' },
                    { id: 'ipad_pro_11_m4', name: 'iPad Pro 11" (M4)' },
                    { id: 'ipad_pro_12_9', name: 'iPad Pro 12.9" (5th/6th Gen)' },
                    { id: 'ipad_pro_11', name: 'iPad Pro 11" (3rd/4th Gen)' },
                    { id: 'ipad_air_13_m2', name: 'iPad Air 13" (M2)' },
                    { id: 'ipad_air_11_m2', name: 'iPad Air 11" (M2)' },
                    { id: 'ipad_air_5', name: 'iPad Air (5th Gen)' },
                    { id: 'ipad_10', name: 'iPad 10th Gen (10.9")' },
                    { id: 'ipad_9', name: 'iPad 9th Gen (10.2")' },
                    { id: 'ipad_mini_7', name: 'iPad mini 7 (A17 Pro)' },
                    { id: 'ipad_mini_6', name: 'iPad mini 6' }
                ],
                services: [
                    { id: 'ipad_screen', name: 'Screen / Glass Replacement' },
                    { id: 'ipad_battery', name: 'Battery Replacement' },
                    { id: 'ipad_charging', name: 'Charging Port Replacement' },
                    { id: 'ipad_board', name: 'Logic Board Micro-soldering' },
                    { id: 'ipad_housing', name: 'Chassis / Bent Housing Realignment' }
                ]
            },
            apple_watch: {
                name: 'Apple Watch', supportsGrades: true,
                models: [
                    { id: 'aw_u2', name: 'Apple Watch Ultra 2 (49mm)' },
                    { id: 'aw_u1', name: 'Apple Watch Ultra (49mm)' },
                    { id: 'aw_s10', name: 'Apple Watch Series 10 (46mm / 42mm)' },
                    { id: 'aw_s9', name: 'Apple Watch Series 9 (45mm / 41mm)' },
                    { id: 'aw_s8', name: 'Apple Watch Series 8 (45mm / 41mm)' },
                    { id: 'aw_s7', name: 'Apple Watch Series 7 (45mm / 41mm)' },
                    { id: 'aw_s6', name: 'Apple Watch Series 6 / SE 2' },
                    { id: 'aw_s5', name: 'Apple Watch Series 5 / SE 1' },
                    { id: 'aw_s4', name: 'Apple Watch Series 4' }
                ],
                services: [
                    { id: 'aw_screen', name: 'OLED Screen / Glass Digitizer' },
                    { id: 'aw_battery', name: 'Battery Replacement' },
                    { id: 'aw_sensor', name: 'Rear Glass & Heart Rate Sensor' },
                    { id: 'aw_crown', name: 'Digital Crown / Haptic Vibrator' }
                ]
            },
            apple_ipod: {
                name: 'Apple iPod', supportsGrades: true,
                models: [
                    { id: 'ipod_touch_7', name: 'iPod touch (7th Gen)' },
                    { id: 'ipod_touch_6', name: 'iPod touch (6th Gen)' },
                    { id: 'ipod_touch_5', name: 'iPod touch (5th Gen)' },
                    { id: 'ipod_classic', name: 'iPod Classic (Flash Mod & Battery)' }
                ],
                services: [
                    { id: 'ipod_screen', name: 'Screen Replacement' },
                    { id: 'ipod_battery', name: 'Battery Replacement' },
                    { id: 'ipod_jack', name: 'Headphone Jack / Lightning Port' },
                    { id: 'ipod_storage', name: 'SSD / SD Storage Upgrade (Classic)' }
                ]
            },
            samsung_s: {
                name: 'Samsung S Series', supportsGrades: true,
                models: [
                    { id: 's25u', name: 'Galaxy S25 Ultra' },
                    { id: 's25plus', name: 'Galaxy S25+' },
                    { id: 's25', name: 'Galaxy S25' },
                    { id: 's24u', name: 'Galaxy S24 Ultra' },
                    { id: 's24plus', name: 'Galaxy S24+' },
                    { id: 's24', name: 'Galaxy S24' },
                    { id: 's24fe', name: 'Galaxy S24 FE' },
                    { id: 's23u', name: 'Galaxy S23 Ultra' },
                    { id: 's23plus', name: 'Galaxy S23+' },
                    { id: 's23', name: 'Galaxy S23' },
                    { id: 's23fe', name: 'Galaxy S23 FE' },
                    { id: 's22u', name: 'Galaxy S22 Ultra' },
                    { id: 's22plus', name: 'Galaxy S22+' },
                    { id: 's22', name: 'Galaxy S22' },
                    { id: 's21u', name: 'Galaxy S21 Ultra' },
                    { id: 's21plus', name: 'Galaxy S21+' },
                    { id: 's21', name: 'Galaxy S21' },
                    { id: 's21fe', name: 'Galaxy S21 FE' },
                    { id: 's20u', name: 'Galaxy S20 Ultra' },
                    { id: 's20plus', name: 'Galaxy S20+' },
                    { id: 's20', name: 'Galaxy S20' },
                    { id: 's20fe', name: 'Galaxy S20 FE' }
                ],
                services: phone13Services
            },
            samsung_z: {
                name: 'Samsung Z Series', supportsGrades: true,
                models: [
                    { id: 'z_fold_6', name: 'Galaxy Z Fold 6' },
                    { id: 'z_flip_6', name: 'Galaxy Z Flip 6' },
                    { id: 'z_fold_5', name: 'Galaxy Z Fold 5' },
                    { id: 'z_flip_5', name: 'Galaxy Z Flip 5' },
                    { id: 'z_fold_4', name: 'Galaxy Z Fold 4' },
                    { id: 'z_flip_4', name: 'Galaxy Z Flip 4' },
                    { id: 'z_fold_3', name: 'Galaxy Z Fold 3' },
                    { id: 'z_flip_3', name: 'Galaxy Z Flip 3' }
                ],
                services: [
                    { id: 'z_inner_screen', name: 'Inner Folding OLED Screen' },
                    { id: 'z_outer_screen', name: 'Outer Cover Display' },
                    { id: 'z_hinge', name: 'Hinge Mechanism Cleaning / Realignment' },
                    { id: 'z_battery', name: 'Dual Battery Replacement' },
                    { id: 'z_back', name: 'Rear Glass Panel' },
                    { id: 'z_charging', name: 'Charging Socket Flex' }
                ]
            },
            samsung_note: {
                name: 'Samsung Note Series', supportsGrades: true,
                models: [
                    { id: 'note_20u', name: 'Galaxy Note 20 Ultra 5G' },
                    { id: 'note_20', name: 'Galaxy Note 20' },
                    { id: 'note_10p', name: 'Galaxy Note 10+' },
                    { id: 'note_10', name: 'Galaxy Note 10' },
                    { id: 'note_9', name: 'Galaxy Note 9' },
                    { id: 'note_8', name: 'Galaxy Note 8' }
                ],
                services: phone13Services
            },
            samsung_a: {
                name: 'Samsung A Series', supportsGrades: true,
                models: [
                    { id: 'a55', name: 'Galaxy A55 5G' },
                    { id: 'a54', name: 'Galaxy A54 5G' },
                    { id: 'a53', name: 'Galaxy A53 5G' },
                    { id: 'a52s', name: 'Galaxy A52s / A52' },
                    { id: 'a35', name: 'Galaxy A35 5G' },
                    { id: 'a34', name: 'Galaxy A34 5G' },
                    { id: 'a25', name: 'Galaxy A25 5G' },
                    { id: 'a15', name: 'Galaxy A15 5G' },
                    { id: 'a14', name: 'Galaxy A14' }
                ],
                services: phone13Services
            },
            samsung_tab_s: {
                name: 'Samsung Tab S Series', supportsGrades: true,
                models: [
                    { id: 'tab_s10u', name: 'Galaxy Tab S10 Ultra / S10+' },
                    { id: 'tab_s9u', name: 'Galaxy Tab S9 Ultra / S9+' },
                    { id: 'tab_s9', name: 'Galaxy Tab S9 (11")' },
                    { id: 'tab_s8u', name: 'Galaxy Tab S8 Ultra / S8+' },
                    { id: 'tab_s8', name: 'Galaxy Tab S8 (11")' },
                    { id: 'tab_s7', name: 'Galaxy Tab S7 / S7+' }
                ],
                services: [
                    { id: 'tab_screen', name: 'Super AMOLED Display Assembly' },
                    { id: 'tab_battery', name: 'High-Capacity Battery' },
                    { id: 'tab_charging', name: 'Type-C Charging Daughterboard' },
                    { id: 'tab_board', name: 'Motherboard IC Repair' }
                ]
            },
            samsung_tab_a: {
                name: 'Samsung Tab A Series', supportsGrades: true,
                models: [
                    { id: 'tab_a9p', name: 'Galaxy Tab A9+ (11")' },
                    { id: 'tab_a9', name: 'Galaxy Tab A9 (8.7")' },
                    { id: 'tab_a8', name: 'Galaxy Tab A8 10.5 (2022)' },
                    { id: 'tab_a7', name: 'Galaxy Tab A7 10.4' }
                ],
                services: [
                    { id: 'tab_a_screen', name: 'LCD Screen & Touch Glass' },
                    { id: 'tab_a_battery', name: 'Battery Replacement' },
                    { id: 'tab_a_charging', name: 'Charging Port Replacement' }
                ]
            },
            google_pixel: {
                name: 'Google Pixel', supportsGrades: true,
                models: [
                    { id: 'pix_9p_fold', name: 'Google Pixel 9 Pro Fold' },
                    { id: 'pix_9pxl', name: 'Google Pixel 9 Pro XL' },
                    { id: 'pix_9p', name: 'Google Pixel 9 Pro' },
                    { id: 'pix_9', name: 'Google Pixel 9' },
                    { id: 'pix_8p', name: 'Google Pixel 8 Pro' },
                    { id: 'pix_8', name: 'Google Pixel 8' },
                    { id: 'pix_8a', name: 'Google Pixel 8a' },
                    { id: 'pix_7p', name: 'Google Pixel 7 Pro' },
                    { id: 'pix_7', name: 'Google Pixel 7' },
                    { id: 'pix_7a', name: 'Google Pixel 7a' },
                    { id: 'pix_6p', name: 'Google Pixel 6 Pro' },
                    { id: 'pix_6', name: 'Google Pixel 6' },
                    { id: 'pix_6a', name: 'Google Pixel 6a' }
                ],
                services: phone13Services
            },
            oppo: {
                name: 'OPPO', supportsGrades: true,
                models: [
                    { id: 'oppo_fx7', name: 'OPPO Find X7 / X6 Pro' },
                    { id: 'oppo_fx5', name: 'OPPO Find X5 Pro / X5' },
                    { id: 'oppo_reno11', name: 'OPPO Reno 11 / 10 Pro' },
                    { id: 'oppo_a98', name: 'OPPO A98 / A78 / A58' }
                ],
                services: phone13Services
            },
            microsoft_surface: {
                name: 'Microsoft Surface', supportsGrades: false,
                models: [
                    { id: 'surf_pro_9', name: 'Surface Pro 9 / 10' },
                    { id: 'surf_pro_8', name: 'Surface Pro 8 / Pro X' },
                    { id: 'surf_pro_7', name: 'Surface Pro 7 / 7+' },
                    { id: 'surf_lap_5', name: 'Surface Laptop 4 / 5' }
                ],
                services: [
                    { id: 'surf_screen', name: 'PixelSense Display Assembly' },
                    { id: 'surf_battery', name: 'Internal Battery Replacement' },
                    { id: 'surf_charging', name: 'Surface Connect / USB-C Port' },
                    { id: 'surf_board', name: 'Board Level Micro-soldering' }
                ]
            },
            nintendo_switch: {
                name: 'Nintendo Switch', supportsGrades: false,
                models: [
                    { id: 'sw_oled', name: 'Nintendo Switch OLED' },
                    { id: 'sw_v2', name: 'Nintendo Switch (V1 / V2)' },
                    { id: 'sw_lite', name: 'Nintendo Switch Lite' }
                ],
                services: [
                    { id: 'sw_screen', name: 'Screen Digitizer / OLED Panel' },
                    { id: 'sw_port', name: 'USB-C Charging Port Replacement' },
                    { id: 'sw_m92t36', name: 'M92T36 Power IC Micro-soldering' },
                    { id: 'sw_drift', name: 'Joy-Con Stick Drift Repair (Hall Effect)' },
                    { id: 'sw_card', name: 'Game Card Reader / Headphone Jack' },
                    { id: 'sw_battery', name: 'Battery Replacement' }
                ]
            },
            macbook: {
                name: 'MacBook & Laptops', supportsGrades: false,
                models: [
                    { id: 'mac_m3', name: 'MacBook Pro 14" / 16" (M-Series)' },
                    { id: 'mac_air_m2', name: 'MacBook Air (M1 / M2 / M3)' },
                    { id: 'mac_intel', name: 'MacBook Pro (Intel Models)' }
                ],
                services: [
                    { id: 'mb_screen', name: 'Retina Display Assembly' },
                    { id: 'mb_battery', name: 'Battery & Top Case Service' },
                    { id: 'mb_logic', name: 'Logic Board Micro-soldering' },
                    { id: 'mb_liquid', name: 'Ultrasonic Liquid Damage Clean' }
                ]
            },
            ps5: {
                name: 'PlayStation 5', supportsGrades: false,
                models: [
                    { id: 'ps5_slim', name: 'PlayStation 5 Slim' },
                    { id: 'ps5_orig', name: 'PlayStation 5 (Original)' }
                ],
                services: [
                    { id: 'ps5_hdmi', name: 'HDMI 2.1 Port Replacement' },
                    { id: 'ps5_liquid_metal', name: 'APU Liquid Metal Repaste & Clean' },
                    { id: 'ps5_psu', name: 'Internal Power Supply Repair' },
                    { id: 'ps5_drive', name: 'Optical Disc Drive Laser Repair' }
                ]
            },
            playstation_console: {
                name: 'PlayStation & Consoles', supportsGrades: false,
                models: [
                    { id: 'ps5_pro', name: 'PlayStation 5 Pro' },
                    { id: 'ps5_slim', name: 'PlayStation 5 Slim' },
                    { id: 'ps5_orig', name: 'PlayStation 5 (Original)' },
                    { id: 'xbox_sx', name: 'Xbox Series X' }
                ],
                services: [
                    { id: 'ps5_hdmi', name: 'HDMI 2.1 Port Replacement' },
                    { id: 'ps5_liquid_metal', name: 'APU Liquid Metal Repaste & Clean' },
                    { id: 'ps5_psu', name: 'Internal Power Supply Repair' },
                    { id: 'ps5_drive', name: 'Optical Disc Drive Laser Repair' }
                ]
            },
            other_devices: {
                name: 'Other Smartphones & Tablets', supportsGrades: true,
                models: [
                    { id: 'other_flagship', name: 'Flagship Smartphone / Tablet' },
                    { id: 'other_midrange', name: 'Mid-Range Smartphone / Tablet' }
                ],
                services: phone13Services
            }
        };

        // =========================================================================
        // 5. Quote Builder UI Synchronization (No Prices Shown on Website)
        // =========================================================================
        function setPartGrade(grade) {
            currentPartGrade = grade;
            
            ['aftermarket', 'premium', 'genuine'].forEach(g => {
                const btn = document.getElementById(`tier-btn-${g}`);
                if (g === grade) {
                    btn.className = "liquid-tier-btn active py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-center";
                } else {
                    btn.className = "liquid-tier-btn py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-center";
                }
            });

            calculateQuote();
        }

        function onFamilyChange() {
            const familyEl = document.getElementById('device-family');
            if (!familyEl) return;
            const familyKey = familyEl.value;
            const currentCat = catalog[familyKey];
            if (!currentCat) return;
            const modelSelect = document.getElementById('model-select');
            const tierWrapper = document.getElementById('part-tier-wrapper');
            
            if (currentCat.supportsGrades) {
                tierWrapper.classList.remove('opacity-40', 'pointer-events-none');
            } else {
                tierWrapper.classList.add('opacity-40', 'pointer-events-none');
            }

            modelSelect.innerHTML = '';
            currentCat.models.forEach((m, idx) => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.name;
                if (idx === 0) opt.selected = true;
                modelSelect.appendChild(opt);
            });

            renderChecklist();
            calculateQuote();
        }

        function renderChecklist() {
            const familyKey = document.getElementById('device-family').value;
            const currentCat = catalog[familyKey];
            const container = document.getElementById('services-checklist');
            container.innerHTML = '';

            currentCat.services.forEach((svc, index) => {
                const label = document.createElement('label');
                label.className = 'flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#F2F6FB] transition-all cursor-pointer border border-[#DFE7F0] select-none';
                label.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" value="${svc.id}" ${index === 0 ? 'checked' : ''} onchange="calculateQuote()" class="w-4 h-4 rounded cursor-pointer liquid-checkbox">
                        <span class="text-sm font-semibold text-[#172B46]">${svc.name}</span>
                    </div>
                    <span class="text-[11px] font-medium text-[#64748B]">Email Quote</span>
                `;
                container.appendChild(label);
            });
        }

        function calculateQuote() {
            const familyEl = document.getElementById('device-family');
            if (!familyEl) return;
            const familyKey = familyEl.value;
            const currentCat = catalog[familyKey];
            if (!currentCat) return;

            const modelSelect = document.getElementById('model-select');
            const selectedModelId = modelSelect.value;
            const selectedModel = currentCat.models.find(m => m.id === selectedModelId) || currentCat.models[0];

            document.getElementById('receipt-device-name').textContent = selectedModel.name;
            
            const gradeInfo = gradeConfig[currentPartGrade];
            const gradeBadge = document.getElementById('receipt-part-grade');
            if (currentCat.supportsGrades) {
                gradeBadge.style.display = 'inline-block';
                gradeBadge.textContent = `Quality: ${gradeInfo.label}`;
                document.getElementById('receipt-warranty').textContent = gradeInfo.warranty;
            } else {
                gradeBadge.style.display = 'none';
                document.getElementById('receipt-warranty').textContent = '3 Months Warranty';
            }

            const checkboxes = document.querySelectorAll('#services-checklist input[type="checkbox"]:checked');
            const receiptItems = document.getElementById('receipt-items');
            const countBadge = document.getElementById('receipt-service-count');
            receiptItems.innerHTML = '';

            if (countBadge) {
                countBadge.textContent = `${checkboxes.length} Selected`;
            }

            let timeEstimate = "30–45 mins";

            if (checkboxes.length === 0) {
                receiptItems.innerHTML = '<p class="text-[#94a3b8] text-xs text-center py-8">Select one or more services to include in your quote.</p>';
                document.getElementById('receipt-time').textContent = timeEstimate;
                return;
            }

            checkboxes.forEach(cb => {
                const svc = currentCat.services.find(s => s.id === cb.value);
                if (svc) {
                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center text-xs text-[#64748B] animate-in fade-in duration-200';
                    row.innerHTML = `<span class="text-[#172B46] font-medium">${svc.name}</span><span class="text-[11px] font-semibold text-[#526D91]">Included in Quote</span>`;
                    receiptItems.appendChild(row);
                }
            });

            if (checkboxes.length > 2) timeEstimate = "1–2 Hours";
            else if (Array.from(checkboxes).some(c => c.value.includes('back') || c.value.includes('hinge'))) timeEstimate = "1–2 Hours";
            else if (Array.from(checkboxes).every(c => c.value.includes('battery'))) timeEstimate = "20–30 mins";
            else if (familyKey === 'macbook' || familyKey === 'microsoft_surface') timeEstimate = "1–2 Days";

            document.getElementById('receipt-time').textContent = timeEstimate;
        }

        function clearAllRepairs() {
            document.querySelectorAll('#services-checklist input[type="checkbox"]').forEach(c => c.checked = false);
            calculateQuote();
        }

        // =========================================================================
        // 6. Booking Modal & Auto-Fill Transfer
        // =========================================================================
        function openBookingModal(deviceName = '', partsSummary = '') {
            if (deviceName) document.getElementById('modal-device').value = deviceName;
            if (partsSummary) document.getElementById('modal-issue').value = partsSummary;
            document.getElementById('booking-modal').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        }

        function closeBookingModal() {
            document.getElementById('booking-modal').classList.add('hidden');
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }

        function scheduleRepairFromQuote() {
            const familyKey = document.getElementById('device-family').value;
            const currentCat = catalog[familyKey];
            const modelName = document.getElementById('receipt-device-name').textContent;
            
            const selectedServices = [];
            document.querySelectorAll('#services-checklist input[type="checkbox"]:checked').forEach(cb => {
                const labelText = cb.closest('label').querySelector('span').textContent.trim();
                selectedServices.push(labelText);
            });

            const gradePart = currentCat.supportsGrades ? `[${gradeConfig[currentPartGrade].label}] ` : '';
            const summary = selectedServices.length > 0 
                ? `${gradePart}${selectedServices.join(', ')}`
                : 'General Diagnostic / Inspection';

            openBookingModal(modelName, summary);
        }

        // =========================================================================
        // 6B. Email Quote Dispatch (POST to Backend /api/calculate-quote)
        // =========================================================================
        async function handleGetQuoteSubmit(event) {
            if (event) event.preventDefault();

            const emailInput = document.getElementById('quote-customer-email');
            const submitBtn = document.getElementById('get-quote-btn');
            const submitBtnText = document.getElementById('get-quote-btn-text');
            const statusEl = document.getElementById('quote-status-message');

            const email = emailInput ? emailInput.value.trim() : '';
            const familyKey = document.getElementById('device-family').value;
            const currentCat = catalog[familyKey];
            const modelId = document.getElementById('model-select').value;
            const grade = currentCat && currentCat.supportsGrades ? currentPartGrade : 'standard';

            // Collect checked repair service IDs and build composite PRICE_MAP keys
            const checkedBoxes = document.querySelectorAll('#services-checklist input[type="checkbox"]:checked');
            const rawPartIds = Array.from(checkedBoxes).map(cb => cb.value);
            const compositePartIds = rawPartIds.map(svcId => `${familyKey}:${modelId}:${grade}:${svcId}`);

            // Helper to render status banner inside the receipt panel
            function showQuoteStatus(type, message) {
                if (!statusEl) return;
                statusEl.classList.remove('hidden');
                if (type === 'success') {
                    statusEl.className = 'mt-3 text-xs font-medium rounded-xl px-3.5 py-2.5 text-center border border-[#7da6d8]/40 bg-[#172B46]/90 text-[#e2ecf7]';
                } else {
                    statusEl.className = 'mt-3 text-xs font-medium rounded-xl px-3.5 py-2.5 text-center border border-red-400/40 bg-red-950/60 text-red-200';
                }
                statusEl.textContent = message;
            }

            if (!email) {
                showQuoteStatus('error', 'Please enter a valid email address to receive your quote.');
                return;
            }

            if (compositePartIds.length === 0) {
                showQuoteStatus('error', 'Please select at least one repair service before requesting a quote.');
                return;
            }

            // Set button loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Sending...';
            if (statusEl) statusEl.classList.add('hidden');

            try {
                const response = await fetch('https://leenguyenlab.com.au/api/calculate-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        selectedItems: compositePartIds,
                        partIds: rawPartIds,
                        familyKey: familyKey,
                        modelId: modelId,
                        partGrade: grade
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || data.success === false) {
                    throw new Error(data.error || `Server responded with status ${response.status}`);
                }

                showQuoteStatus(
                    'success',
                    data.message || `Your itemized quote has been sent to ${email}. Please check your inbox.`
                );
            } catch (error) {
                console.error('Error submitting quote:', error);
                showQuoteStatus(
                    'error',
                    error.message || 'Unable to send quote right now. Please check your connection and try again.'
                );
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = 'Get Quote';
            }
        }

        
        // =========================================================================
        // 7. Custom Phone Case Studio & Live Mockup Engine (Official Model Colours + 3 Pre-Designs / Custom Print)
        // =========================================================================
        let currentCasePhone = 'iphone_18_pm';
        let currentPhoneColor = 'black';
        let currentCaseType = 'liquid_clear';
        let currentCasePrice = 49;
        let currentCaseZoom = 1.0;
        let currentCaseDesignMode = 'design_1';
        let currentCaseImageSrc = '';
        let customUploadedImageSrc = '';

        function makeColorTheme(name, dot, c1, c2, c3, border, isLight) {
            return {
                name: name,
                dot: dot,
                canvasBg: c2,
                swatchBg: `linear-gradient(135deg, ${c1} 0%, ${c3} 100%)`,
                bodyBg: `linear-gradient(145deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
                frameBorder: border,
                bumpBg: `linear-gradient(145deg, ${c1}eb 0%, ${c2}f5 100%)`,
                bumpBorder: isLight ? 'rgba(82, 109, 145, 0.35)' : 'rgba(255, 255, 255, 0.25)',
                lensRing: `linear-gradient(135deg, ${c1} 0%, ${c3} 55%, ${border} 100%)`,
                labelColor: isLight ? 'rgba(23, 43, 70, 0.68)' : 'rgba(255, 255, 255, 0.62)',
                artPrimary: isLight ? '%23172B46' : '%23f8fafc',
                artSecondary: isLight ? '%23526D91' : '%2393c5fd',
                artAccent: isLight ? '%23334155' : '%23e2e8f0'
            };
        }

        // Master dictionary of Official Apple iPhone Finishes (iPhone 18 Series down to iPhone 11)
        const phoneColorThemes = {
            // iPhone 18 Pro / 18 Pro Max (2026) — Black, Silver, Glacier, Burgundy
            black:            makeColorTheme('Black', '#1c2026', '#2b303a', '#181c22', '#0f1217', '#3a414d', false),
            silver:           makeColorTheme('Silver', '#e4e9f0', '#ffffff', '#e6ebf2', '#cfd7e3', '#b8c4d4', true),
            glacier:          makeColorTheme('Glacier', '#c8dced', '#e3eff8', '#c8dced', '#a9c3da', '#8faec9', true),
            burgundy:         makeColorTheme('Burgundy', '#5c1d2a', '#732637', '#4c1622', '#300c14', '#8f394c', false),

            // iPhone 17 Pro / 17 Pro Max — Silver, Cosmic Orange, Deep Blue
            cosmic_orange:    makeColorTheme('Cosmic Orange', '#d96b38', '#ec824e', '#d1622e', '#a8471b', '#f0986c', false),
            deep_blue:        makeColorTheme('Deep Blue', '#1e3557', '#2e4c78', '#1d3354', '#112038', '#4b6e9e', false),

            // iPhone Air (17 Air) — Space Black, Cloud White, Light Gold, Sky Blue
            space_black:      makeColorTheme('Space Black', '#202328', '#2f333b', '#1d2026', '#121418', '#434954', false),
            cloud_white:      makeColorTheme('Cloud White', '#f4f6f9', '#ffffff', '#f2f5f9', '#dfe5ee', '#c7d1de', true),
            light_gold:       makeColorTheme('Light Gold', '#e5d6c3', '#f5ece0', '#e3d2bd', '#cbb69d', '#bba387', true),
            sky_blue:         makeColorTheme('Sky Blue', '#b8d4ec', '#d8eaf8', '#b8d4ec', '#96bad9', '#82aad0', true),

            // iPhone 17 & 17e — Black, White, Lavender, Mist Blue, Sage, Soft Pink
            white:            makeColorTheme('White', '#f5f7fa', '#ffffff', '#f1f4f9', '#dde3ec', '#c5d0de', true),
            lavender:         makeColorTheme('Lavender', '#d5c8e8', '#ebe2f7', '#d5c6eb', '#bba8d6', '#a792c6', true),
            mist_blue:        makeColorTheme('Mist Blue', '#b5cde0', '#d6e6f2', '#b5cde0', '#94b3cc', '#7fa2be', true),
            sage:             makeColorTheme('Sage', '#b8cbb9', '#d7e6d8', '#b8cbb9', '#98b09a', '#839e85', true),
            soft_pink:        makeColorTheme('Soft Pink', '#f0ccd4', '#fae4e9', '#f0ccd4', '#deb0bb', '#cc9aa6', true),

            // iPhone 16 Pro / 15 Pro — Black Titanium, White Titanium, Natural Titanium, Desert Titanium, Blue Titanium
            black_titanium:   makeColorTheme('Black Titanium', '#23262b', '#32363e', '#202328', '#14161a', '#464c57', false),
            white_titanium:   makeColorTheme('White Titanium', '#f0f2f5', '#ffffff', '#eceff4', '#d8dde6', '#c0c8d4', true),
            natural_titanium: makeColorTheme('Natural Titanium', '#bab5ad', '#d5d1c8', '#b8b3a8', '#9c968b', '#8c867b', true),
            desert_titanium:  makeColorTheme('Desert Titanium', '#d4b89e', '#ead6c4', '#cfb299', '#b39276', '#a68568', true),
            blue_titanium:    makeColorTheme('Blue Titanium', '#33445c', '#475c7a', '#304057', '#1e293b', '#5c7496', false),

            // iPhone 16 / 16 Plus — Pink, Teal, Ultramarine
            pink_16:          makeColorTheme('Pink', '#eba6be', '#f7c3d5', '#e89eb8', '#cf7e9b', '#bf6b89', true),
            teal:             makeColorTheme('Teal', '#78b6b4', '#9ed1cf', '#76b5b3', '#569694', '#488583', true),
            ultramarine:      makeColorTheme('Ultramarine', '#5c73c9', '#7b91e3', '#586fc4', '#3d52a3', '#8ba0eb', false),

            // iPhone 15 / 15 Plus — Pastel Blue, Green, Yellow, Pink
            pastel_blue:      makeColorTheme('Blue', '#d6e4f0', '#ebf3fa', '#d4e3f0', '#b8cde0', '#9fb8cf', true),
            pastel_green:     makeColorTheme('Green', '#d4e6d5', '#eaf5eb', '#d2e6d4', '#b5cfb7', '#9cb89e', true),
            pastel_yellow:    makeColorTheme('Yellow', '#f5eec6', '#fcf8e1', '#f2e9bc', '#dfd39b', '#cbbd82', true),
            pastel_pink:      makeColorTheme('Pink', '#f2d1d8', '#fce8ec', '#f0cdd5', '#dbb0ba', '#c79aa4', true),

            // iPhone 14 Pro / 13 Pro / 12 Pro / 11 Pro — Gold, Deep Purple, Graphite, Sierra Blue, Alpine Green, Pacific Blue, Space Gray, Midnight Green
            gold:             makeColorTheme('Gold', '#e5d3b3', '#f7ebd4', '#e3cfa9', '#c9b186', '#b89d6f', true),
            deep_purple:      makeColorTheme('Deep Purple', '#4e415e', '#66567a', '#493c59', '#31273d', '#7b6891', false),
            graphite:         makeColorTheme('Graphite', '#36383d', '#4a4d54', '#33353a', '#212327', '#5e626b', false),
            sierra_blue:      makeColorTheme('Sierra Blue', '#9bb5ce', '#bdd4ea', '#9ab4cd', '#7996b3', '#6886a3', true),
            alpine_green:     makeColorTheme('Alpine Green', '#445748', '#586e5d', '#3f5243', '#29382c', '#6c8572', false),
            pacific_blue:     makeColorTheme('Pacific Blue', '#2c495c', '#3d6178', '#294457', '#1a2e3d', '#4f7691', false),
            space_gray:       makeColorTheme('Space Gray', '#36383d', '#4a4d54', '#33353a', '#212327', '#5e626b', false),
            midnight_green:   makeColorTheme('Midnight Green', '#47544a', '#5b6b5e', '#424f45', '#2b362e', '#6e8072', false),

            // iPhone 14 / 13 / 12 / 11 Standard — Midnight, Starlight, (PRODUCT)RED, Blue, Purple, Yellow, Green
            midnight:         makeColorTheme('Midnight', '#1c222b', '#2b3340', '#191f28', '#0f1319', '#3d4758', false),
            starlight:        makeColorTheme('Starlight', '#f2eee6', '#ffffff', '#f2ede4', '#dfd8cc', '#c9c0b2', true),
            product_red:      makeColorTheme('(PRODUCT)RED', '#c41e2e', '#e03142', '#bd1b2b', '#8f111d', '#ec5362', false),
            slate_blue:       makeColorTheme('Blue', '#9ab4c9', '#bad1e3', '#98b2c7', '#7894ab', '#67849c', true),
            lilac_purple:     makeColorTheme('Purple', '#ded4e8', '#f0e9f7', '#ddd2e8', '#c3b5d1', '#b0a0c0', true),
            yellow_14:        makeColorTheme('Yellow', '#f5df65', '#fceb8b', '#f2dc5c', '#d9c13f', '#c4ac2b', true),
            blue_13:          makeColorTheme('Blue', '#2d5a7b', '#3f7399', '#2b5575', '#1b3a52', '#5289b3', false),
            pink_13:          makeColorTheme('Pink', '#f2d4d7', '#fcebed', '#f0d1d4', '#dbb5b9', '#c79ea2', true),
            green_13:         makeColorTheme('Green', '#364a3a', '#49614e', '#334737', '#202e23', '#5c7861', false),
            mint_green:       makeColorTheme('Green', '#c7e6d3', '#e1f5e9', '#c5e6d1', '#a6ccb4', '#8fb89e', true),
            royal_blue:       makeColorTheme('Blue', '#1c3f6e', '#2b568f', '#1a3b69', '#0f2545', '#3d6ba8', false),
            purple_12:        makeColorTheme('Purple', '#b8afe6', '#d2cbf5', '#b6ade3', '#988ec9', '#857ab8', true),

            // Samsung Galaxy Finishes
            titanium_black:   makeColorTheme('Titanium Black', '#1e2229', '#2e333d', '#1c2026', '#121418', '#3d4452', false),
            titanium_gray:    makeColorTheme('Titanium Gray', '#6c6f78', '#828690', '#676a73', '#4a4d54', '#9ca0aa', false),
            titanium_silver:  makeColorTheme('Titanium Silver', '#e2e6eb', '#f8fafc', '#e2e6eb', '#c8ced6', '#b4bcc6', true),
            titanium_blue:    makeColorTheme('Titanium Blue', '#2b476e', '#3c5d8a', '#294369', '#1a2e4a', '#4d70a3', false),
            silver_shadow:    makeColorTheme('Silver Shadow', '#dce1e8', '#f1f4f8', '#dce1e8', '#c4cbda', '#adb6c6', true),
            phantom_black:    makeColorTheme('Phantom Black', '#181b20', '#252930', '#181a1f', '#0f1114', '#343a45', false),
            cream:            makeColorTheme('Cream', '#f4efe6', '#fdfbf7', '#f4eee6', '#ded6c7', '#c9c0b0', true),

            // Google Pixel Finishes
            obsidian:         makeColorTheme('Obsidian', '#1a1d22', '#282c34', '#181a1f', '#0f1114', '#3c414d', false),
            porcelain:        makeColorTheme('Porcelain', '#f2f4f7', '#ffffff', '#eef1f5', '#d7dce4', '#c0c8d4', true),
            hazel:            makeColorTheme('Hazel', '#85897e', '#9fa497', '#83877c', '#60645a', '#b2b7a9', false),
            rose_quartz:      makeColorTheme('Rose Quartz', '#ebd3db', '#fae8ee', '#ebd1da', '#d2b4bf', '#be9ea9', true)
        };

        // Official Colours Mapped per Phone Model (Apple, Samsung Galaxy, Google Pixel)
        const modelOfficialColors = {
            // iPhone 18 Series (2026)
            iphone_18_pm:   ['black', 'silver', 'glacier', 'burgundy'],
            iphone_18_p:    ['black', 'silver', 'glacier', 'burgundy'],

            // iPhone 17 Series & iPhone Air
            iphone_17_pm:   ['silver', 'cosmic_orange', 'deep_blue'],
            iphone_17_p:    ['silver', 'cosmic_orange', 'deep_blue'],
            iphone_17_air:  ['space_black', 'cloud_white', 'light_gold', 'sky_blue'],
            iphone_17:      ['black', 'white', 'lavender', 'mist_blue', 'sage'],
            iphone_17e:     ['black', 'white', 'soft_pink'],

            // iPhone 16 Series
            iphone_16_pm:   ['black_titanium', 'white_titanium', 'natural_titanium', 'desert_titanium'],
            iphone_16_p:    ['black_titanium', 'white_titanium', 'natural_titanium', 'desert_titanium'],
            iphone_16_plus: ['black', 'white', 'pink_16', 'teal', 'ultramarine'],
            iphone_16:      ['black', 'white', 'pink_16', 'teal', 'ultramarine'],
            iphone_16e:     ['black', 'white'],

            // iPhone 15 Series
            iphone_15_pm:   ['black_titanium', 'white_titanium', 'blue_titanium', 'natural_titanium'],
            iphone_15_p:    ['black_titanium', 'white_titanium', 'blue_titanium', 'natural_titanium'],
            iphone_15_plus: ['black', 'pastel_blue', 'pastel_green', 'pastel_yellow', 'pastel_pink'],
            iphone_15:      ['black', 'pastel_blue', 'pastel_green', 'pastel_yellow', 'pastel_pink'],

            // iPhone 14 Series
            iphone_14_pm:   ['space_black', 'silver', 'gold', 'deep_purple'],
            iphone_14_p:    ['space_black', 'silver', 'gold', 'deep_purple'],
            iphone_14_plus: ['midnight', 'starlight', 'product_red', 'slate_blue', 'lilac_purple', 'yellow_14'],
            iphone_14:      ['midnight', 'starlight', 'product_red', 'slate_blue', 'lilac_purple', 'yellow_14'],

            // iPhone 13 Series
            iphone_13_pm:   ['graphite', 'silver', 'gold', 'sierra_blue', 'alpine_green'],
            iphone_13_p:    ['graphite', 'silver', 'gold', 'sierra_blue', 'alpine_green'],
            iphone_13:      ['midnight', 'starlight', 'product_red', 'blue_13', 'pink_13', 'green_13'],
            iphone_13_mini: ['midnight', 'starlight', 'product_red', 'blue_13', 'pink_13', 'green_13'],

            // iPhone 12 Series
            iphone_12_pm:   ['graphite', 'silver', 'gold', 'pacific_blue'],
            iphone_12_p:    ['graphite', 'silver', 'gold', 'pacific_blue'],
            iphone_12:      ['black', 'white', 'product_red', 'mint_green', 'royal_blue', 'purple_12'],
            iphone_12_mini: ['black', 'white', 'product_red', 'mint_green', 'royal_blue', 'purple_12'],

            // iPhone 11 Series
            iphone_11_pm:   ['space_gray', 'silver', 'gold', 'midnight_green'],
            iphone_11_p:    ['space_gray', 'silver', 'gold', 'midnight_green'],
            iphone_11:      ['black', 'white', 'mint_green', 'pastel_yellow', 'lilac_purple', 'product_red'],

            // Samsung Galaxy Series
            samsung_s25_u:    ['titanium_black', 'titanium_gray', 'titanium_silver', 'titanium_blue'],
            samsung_s25_plus: ['titanium_black', 'silver_shadow', 'titanium_blue'],
            samsung_s25:      ['titanium_black', 'silver_shadow', 'titanium_blue'],
            samsung_s24_u:    ['titanium_black', 'titanium_gray', 'titanium_silver'],
            samsung_s24_plus: ['phantom_black', 'silver_shadow', 'cream'],
            samsung_s24:      ['phantom_black', 'silver_shadow', 'cream'],
            samsung_s23_u:    ['phantom_black', 'cream', 'green_13', 'lavender'],
            samsung_s23_plus: ['phantom_black', 'cream', 'green_13', 'lavender'],
            samsung_s23:      ['phantom_black', 'cream', 'green_13', 'lavender'],
            samsung_s22_u:    ['phantom_black', 'white', 'burgundy'],
            samsung_s22:      ['phantom_black', 'white', 'pink_13'],
            samsung_s21_u:    ['phantom_black', 'silver'],
            samsung_z_fold6:  ['silver_shadow', 'titanium_black', 'titanium_blue'],
            samsung_z_flip6:  ['silver_shadow', 'mint_green', 'pastel_blue', 'pastel_yellow'],
            samsung_z_fold5:  ['phantom_black', 'pastel_blue', 'cream'],
            samsung_z_flip5:  ['graphite', 'mint_green', 'cream', 'lavender'],
            samsung_a55:      ['phantom_black', 'pastel_blue', 'lavender', 'pastel_yellow'],
            samsung_a54:      ['phantom_black', 'white', 'mint_green', 'lavender'],

            // Google Pixel Series
            pixel_9_pxl:      ['obsidian', 'porcelain', 'hazel', 'rose_quartz'],
            pixel_9_p:        ['obsidian', 'porcelain', 'hazel', 'rose_quartz'],
            pixel_9:          ['obsidian', 'porcelain', 'mint_green', 'rose_quartz'],
            pixel_8_p:        ['obsidian', 'porcelain', 'slate_blue', 'mint_green'],
            pixel_8:          ['obsidian', 'hazel', 'rose_quartz'],
            pixel_8a:         ['obsidian', 'porcelain', 'slate_blue', 'mint_green'],
            pixel_7_p:        ['obsidian', 'porcelain', 'hazel'],
            pixel_7:          ['obsidian', 'porcelain', 'yellow_14']
        };

        const artisticDesignNames = {
            design_1: 'Pre-Design 01 · Great Wave & Koi',
            design_2: 'Pre-Design 02 · Botanical Flora',
            design_3: 'Pre-Design 03 · Geo Topography',
            custom: 'Print Your Own Design'
        };

        // Generates transparent-backed SVG data URLs for the 3 Signature Artistic Pre-Designs
        // with crisp high-contrast cured UV inks on the dark case shell
        function getArtisticPreDesignSvg(designKey, colorKey) {
            const theme = phoneColorThemes[colorKey] || phoneColorThemes.black;
            const c1 = '%23f8fafc'; // Crisp high-contrast artwork ink on dark case shell
            const c2 = '%237da6d8'; // Soft Sydney Lab tech-blue ink on dark case shell
            const c3 = '%23cbd5e1'; // Clean platinum subtitle accent

            if (designKey === 'design_1') {
                // Pre-Design 01: Great Wave & Koi (Japanese Ukiyo-e Artistic Line Art on Clear Glass)
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<g fill="none" stroke-linecap="round">` +
                    `<circle cx="420" cy="480" r="85" fill="${c2}" fill-opacity="0.18" stroke="${c1}" stroke-opacity="0.55" stroke-width="2.5"/>` +
                    `<path d="M-40,780 C110,650 240,860 390,720 C490,630 560,710 640,660" stroke="${c1}" stroke-opacity="0.75" stroke-width="4.5"/>` +
                    `<path d="M-40,820 C120,690 250,900 400,760 C500,670 570,750 640,700" stroke="${c2}" stroke-opacity="0.6" stroke-width="3"/>` +
                    `<path d="M-40,860 C130,730 260,940 410,800 C510,710 580,790 640,740" stroke="${c1}" stroke-opacity="0.45" stroke-width="2.2"/>` +
                    `<path d="M-40,910 C150,790 280,990 430,850 C520,760 580,830 640,790" stroke="${c2}" stroke-opacity="0.35" stroke-width="1.8"/>` +
                    `<path d="M60,740 C110,640 220,630 250,700 C210,675 145,690 125,745" stroke="${c1}" stroke-opacity="0.8" stroke-width="3.5"/>` +
                    `<path d="M310,720 C370,610 480,600 515,675 C470,650 405,665 385,725" stroke="${c1}" stroke-opacity="0.8" stroke-width="3.5"/>` +
                    `<path d="M210,540 C260,490 340,510 365,570 C320,595 250,585 210,540 Z" fill="${c2}" fill-opacity="0.2" stroke="${c1}" stroke-opacity="0.75" stroke-width="2.8"/>` +
                    `<path d="M365,570 C395,550 425,565 435,595 C405,595 385,585 365,570 Z" stroke="${c1}" stroke-opacity="0.7" stroke-width="2.2"/>` +
                    `<circle cx="150" cy="610" r="5" fill="${c1}" fill-opacity="0.65"/>` +
                    `<circle cx="185" cy="595" r="3.5" fill="${c1}" fill-opacity="0.5"/>` +
                    `<circle cx="465" cy="605" r="4.5" fill="${c1}" fill-opacity="0.6"/>` +
                    `</g>` +
                    `<text x="300" y="1075" fill="${c3}" fill-opacity="0.75" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" letter-spacing="5">ARTISTIC SERIES · 01</text>` +
                    `</svg>`;
            } else if (designKey === 'design_2') {
                // Pre-Design 02: Botanical Flora (Minimalist Continuous Line Art & Monstera / Olive Leaves)
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
                    `<path d="M180,1040 C210,860 280,700 390,460" stroke="${c1}" stroke-opacity="0.75" stroke-width="3.5"/>` +
                    `<path d="M235,890 C150,860 120,780 165,735 C220,760 245,825 235,890 Z" fill="${c2}" fill-opacity="0.18" stroke="${c1}" stroke-opacity="0.7" stroke-width="2.5"/>` +
                    `<path d="M275,785 C365,765 415,695 380,640 C320,660 285,720 275,785 Z" fill="${c2}" fill-opacity="0.18" stroke="${c1}" stroke-opacity="0.7" stroke-width="2.5"/>` +
                    `<path d="M315,675 C225,640 195,560 240,510 C295,535 320,605 315,675 Z" fill="${c2}" fill-opacity="0.18" stroke="${c1}" stroke-opacity="0.7" stroke-width="2.5"/>` +
                    `<path d="M355,565 C435,540 475,475 440,425 C385,445 360,505 355,565 Z" fill="${c2}" fill-opacity="0.18" stroke="${c1}" stroke-opacity="0.7" stroke-width="2.5"/>` +
                    `<circle cx="300" cy="680" r="190" stroke="${c2}" stroke-opacity="0.32" stroke-width="1.8" stroke-dasharray="8 8"/>` +
                    `<circle cx="410" cy="430" r="18" fill="${c2}" fill-opacity="0.28" stroke="${c1}" stroke-opacity="0.65" stroke-width="2"/>` +
                    `</g>` +
                    `<text x="300" y="1075" fill="${c3}" fill-opacity="0.75" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" letter-spacing="5">ARTISTIC SERIES · 02</text>` +
                    `</svg>`;
            } else {
                // Pre-Design 03: Geo Topography (Architectural Contour Rings & Precision Grid)
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<g fill="none">` +
                    `<rect x="95" y="380" width="410" height="620" rx="44" stroke="${c1}" stroke-opacity="0.35" stroke-width="2"/>` +
                    `<path d="M95,560 Q240,480 350,600 T505,540" stroke="${c1}" stroke-opacity="0.65" stroke-width="2.5"/>` +
                    `<path d="M95,620 Q250,530 355,660 T505,600" stroke="${c2}" stroke-opacity="0.55" stroke-width="2.2"/>` +
                    `<path d="M95,680 Q260,580 360,720 T505,660" stroke="${c1}" stroke-opacity="0.5" stroke-width="2"/>` +
                    `<path d="M95,740 Q270,630 365,780 T505,720" stroke="${c2}" stroke-opacity="0.45" stroke-width="1.8"/>` +
                    `<path d="M95,800 Q280,680 370,840 T505,780" stroke="${c1}" stroke-opacity="0.35" stroke-width="1.5"/>` +
                    `<circle cx="300" cy="690" r="115" stroke="${c1}" stroke-opacity="0.6" stroke-width="2.4"/>` +
                    `<circle cx="300" cy="690" r="70" fill="${c2}" fill-opacity="0.14" stroke="${c2}" stroke-opacity="0.5" stroke-width="1.8"/>` +
                    `<line x1="300" y1="380" x2="300" y2="1000" stroke="${c1}" stroke-opacity="0.22" stroke-width="1.2" stroke-dasharray="6 6"/>` +
                    `<line x1="95" y1="690" x2="505" y2="690" stroke="${c1}" stroke-opacity="0.22" stroke-width="1.2" stroke-dasharray="6 6"/>` +
                    `</g>` +
                    `<text x="300" y="1075" fill="${c3}" fill-opacity="0.75" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" letter-spacing="5">ARTISTIC SERIES · 03</text>` +
                    `</svg>`;
            }
        }

        // Dynamically renders the official colours for the selected phone model
        function renderPhoneColorSwatches(modelValue) {
            const grid = document.getElementById('case-phone-color-grid');
            const colorKeys = modelOfficialColors[modelValue] || ['black', 'silver', 'glacier', 'burgundy'];

            if (grid) {
                const colsClass = colorKeys.length <= 3
                    ? 'grid-cols-3'
                    : (colorKeys.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-5');
                grid.className = `grid ${colsClass} gap-2.5`;

                grid.innerHTML = colorKeys.map(key => {
                    const t = phoneColorThemes[key] || phoneColorThemes.black;
                    return `
                        <button type="button" onclick="setPhoneColor('${key}')" id="phone-col-${key}" class="liquid-tier-btn py-2.5 px-2 flex flex-col items-center justify-center gap-1.5" title="${t.name}">
                            <span class="w-6 h-6 rounded-full border border-white/20 shadow-inner" style="background: ${t.swatchBg};"></span>
                            <span class="text-[11px] font-semibold text-[#f5f5f7] leading-tight text-center">${t.name}</span>
                        </button>
                    `;
                }).join('');
            }

            // Keep current colour if supported by the newly selected model; otherwise select its first official colour
            const nextColor = colorKeys.includes(currentPhoneColor) ? currentPhoneColor : colorKeys[0];
            setPhoneColor(nextColor);
        }

        function initCaseStudio() {
            const modelSelect = document.getElementById('case-phone-model');
            const fileInput = document.getElementById('case-file-input');
            const dropzone = document.getElementById('case-dropzone');
            const zoomRange = document.getElementById('case-zoom-range');
            const zoomVal = document.getElementById('case-zoom-val');
            const magSafeToggle = document.getElementById('case-magsafe-toggle');
            const previewImg = document.getElementById('case-preview-img');

            if (!modelSelect || !previewImg) return;

            currentCasePhone = modelSelect.value;
            renderPhoneColorSwatches(currentCasePhone);
            selectArtisticDesign('design_1');
            updateCaseCameraBump(currentCasePhone);
            updateCaseBadge();

            modelSelect.addEventListener('change', (e) => {
                currentCasePhone = e.target.value;
                renderPhoneColorSwatches(currentCasePhone);
                updateCaseCameraBump(currentCasePhone);
                updateCaseBadge();
            });

            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        handleUploadedCaseImage(file);
                    }
                });
            }

            if (dropzone) {
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropzone.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        dropzone.classList.add('dragover');
                    });
                });
                ['dragleave', 'drop'].forEach(eventName => {
                    dropzone.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        dropzone.classList.remove('dragover');
                    });
                });
                dropzone.addEventListener('drop', (e) => {
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                        handleUploadedCaseImage(file);
                    }
                });
            }

            if (zoomRange && zoomVal) {
                zoomRange.addEventListener('input', (e) => {
                    currentCaseZoom = e.target.value / 100;
                    zoomVal.textContent = e.target.value + '%';
                    previewImg.style.transform = 'scale(' + currentCaseZoom + ')';
                });
            }

            if (magSafeToggle) {
                magSafeToggle.addEventListener('change', (e) => {
                    const ring = document.getElementById('case-magsafe-ring');
                    if (ring) {
                        if (e.target.checked) ring.classList.remove('hidden');
                        else ring.classList.add('hidden');
                    }
                });
            }
        }

        function setPhoneColor(colorKey) {
            const theme = phoneColorThemes[colorKey] || phoneColorThemes.black;
            currentPhoneColor = colorKey;

            // Update active button state on colour swatches
            const grid = document.getElementById('case-phone-color-grid');
            if (grid) {
                grid.querySelectorAll('button').forEach(btn => {
                    if (btn.id === 'phone-col-' + colorKey) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
            }

            // Update phone colour label & indicator dot
            const colorLabel = document.getElementById('case-phone-color-label');
            if (colorLabel) colorLabel.textContent = theme.name;

            const colorDot = document.getElementById('case-mockup-color-dot');
            if (colorDot) colorDot.style.background = theme.dot;

            // Apply phone colour ONLY to parts of the phone not covered by the case:
            // The camera bump / island cutout, lens rings, and hardware cutouts.
            // DO NOT change the whole case body - the case covers the phone!
            const mockup = document.getElementById('case-mockup-container');
            if (mockup) {
                // Keep the case shell body dark and protective
                mockup.style.background = '#090c12';
                mockup.style.borderColor = 'rgba(148, 184, 230, 0.35)';

                // Set CSS variables for exposed phone components
                mockup.style.setProperty('--phone-bump-bg', theme.bumpBg);
                mockup.style.setProperty('--phone-bump-border', theme.bumpBorder);
                mockup.style.setProperty('--phone-frame-border', theme.frameBorder);
                mockup.style.setProperty('--phone-lens-ring', theme.frameBorder);
                mockup.style.setProperty('--phone-label-color', theme.labelColor);

                // Update exposed camera lens rings to match phone finish metal
                mockup.querySelectorAll('.camera-lens, .air-camera-lens').forEach(lens => {
                    lens.style.borderColor = theme.frameBorder;
                });
            }

            // Directly update all camera bump elements (the phone parts sticking through the case cutout)
            const bumpIds = [
                'bump-iphone-plateau',
                'bump-iphone-air',
                'bump-iphone-pill',
                'bump-iphone-pro-classic',
                'bump-iphone-diagonal',
                'bump-iphone-dual-vert',
                'bump-samsung',
                'bump-pixel'
            ];
            bumpIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.background = theme.bumpBg;
                    el.style.borderColor = theme.bumpBorder;
                }
            });

            // Update exposed Camera Control chassis cutout if present
            const controlCutout = document.getElementById('case-camera-control-cutout');
            if (controlCutout) {
                controlCutout.style.background = theme.frameBorder;
            }

            // If an Artistic Pre-Design is active, refresh its SVG
            if (currentCaseDesignMode.startsWith('design_')) {
                const svgUrl = getArtisticPreDesignSvg(currentCaseDesignMode, currentPhoneColor);
                currentCaseImageSrc = svgUrl;
                const previewImg = document.getElementById('case-preview-img');
                if (previewImg) {
                    previewImg.src = svgUrl;
                }
            }

            updateCaseBadge();
        }

        function selectArtisticDesign(designKey) {
            currentCaseDesignMode = designKey;

            const btnMap = {
                design_1: 'case-design-btn-1',
                design_2: 'case-design-btn-2',
                design_3: 'case-design-btn-3',
                custom: 'case-design-btn-custom'
            };
            Object.values(btnMap).forEach(id => {
                document.getElementById(id)?.classList.remove('active');
            });
            if (btnMap[designKey]) {
                document.getElementById(btnMap[designKey])?.classList.add('active');
            }

            const modeLabel = document.getElementById('case-design-mode-label');
            if (modeLabel) {
                modeLabel.textContent = artisticDesignNames[designKey] || 'Artistic Case';
            }

            const uploadPrompt = document.getElementById('case-upload-prompt');
            const dropzone = document.getElementById('case-dropzone');

            if (designKey === 'custom') {
                if (uploadPrompt) {
                    uploadPrompt.textContent = customUploadedImageSrc
                        ? 'Custom design loaded! Click or drop another image to replace'
                        : 'Click here or drop your image file to print your own design';
                }
                if (dropzone) {
                    dropzone.classList.add('dragover');
                    setTimeout(() => dropzone.classList.remove('dragover'), 900);
                }
                if (customUploadedImageSrc) {
                    applyCasePreviewImage(customUploadedImageSrc);
                } else {
                    const fileInput = document.getElementById('case-file-input');
                    if (fileInput) fileInput.click();
                }
            } else {
                if (uploadPrompt) {
                    uploadPrompt.textContent = 'Want to print your own design? Click or drop your photo / artwork here';
                }
                const svgUrl = getArtisticPreDesignSvg(designKey, currentPhoneColor);
                applyCasePreviewImage(svgUrl);
            }

            updateCaseBadge();
        }

        function applyCasePreviewImage(srcUrl) {
            currentCaseImageSrc = srcUrl;
            const previewImg = document.getElementById('case-preview-img');
            if (previewImg) {
                previewImg.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
                previewImg.style.opacity = '0.35';
                previewImg.style.transform = `scale(${currentCaseZoom * 0.96})`;
                setTimeout(() => {
                    previewImg.src = srcUrl;
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = `scale(${currentCaseZoom})`;
                }, 100);
            }
        }

        function handleUploadedCaseImage(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                customUploadedImageSrc = event.target.result;
                currentCaseDesignMode = 'custom';

                // Highlight "Print Your Own" button
                ['case-design-btn-1', 'case-design-btn-2', 'case-design-btn-3'].forEach(id => {
                    document.getElementById(id)?.classList.remove('active');
                });
                document.getElementById('case-design-btn-custom')?.classList.add('active');

                const modeLabel = document.getElementById('case-design-mode-label');
                if (modeLabel) modeLabel.textContent = 'Print Your Own Design (Uploaded)';

                const uploadPrompt = document.getElementById('case-upload-prompt');
                if (uploadPrompt) {
                    uploadPrompt.textContent = `Loaded "${file.name}" · Click or drop to change artwork`;
                }

                applyCasePreviewImage(customUploadedImageSrc);
                updateCaseBadge();
            };
            reader.readAsDataURL(file);
        }

        function loadSampleCaseArt(presetKey) {
            const legacyMap = {
                spatial: 'design_1',
                marble: 'design_1',
                obsidian: 'design_2',
                blueprint: 'design_3'
            };
            selectArtisticDesign(legacyMap[presetKey] || 'design_1');
        }

        function setCaseFinish(finishKey) {
            if (finishKey === 'clear') setCaseType('liquid_clear', 49);
            else if (finishKey === 'matte') setCaseType('matte_frosted', 49);
            else if (finishKey === 'magsafe') setCaseType('magsafe_armor', 59);
        }

        function setCaseType(typeKey, price) {
            currentCaseType = typeKey;
            currentCasePrice = price;

            ['case-mat-clear', 'case-mat-matte', 'case-mat-magsafe', 'case-type-clear', 'case-type-matte', 'case-type-magsafe'].forEach(id => {
                document.getElementById(id)?.classList.remove('active');
            });

            if (typeKey === 'liquid_clear') {
                document.getElementById('case-type-clear')?.classList.add('active');
                document.getElementById('case-mat-clear')?.classList.add('active');
            } else if (typeKey === 'matte_frosted') {
                document.getElementById('case-type-matte')?.classList.add('active');
                document.getElementById('case-mat-matte')?.classList.add('active');
            } else if (typeKey === 'magsafe_armor') {
                document.getElementById('case-type-magsafe')?.classList.add('active');
                document.getElementById('case-mat-magsafe')?.classList.add('active');
                const toggle = document.getElementById('case-magsafe-toggle');
                if (toggle && !toggle.checked) {
                    toggle.checked = true;
                    document.getElementById('case-magsafe-ring')?.classList.remove('hidden');
                }
            }

            const mockup = document.getElementById('case-mockup-container');
            if (mockup) {
                if (typeKey === 'matte_frosted') mockup.classList.add('case-finish-matte');
                else mockup.classList.remove('case-finish-matte');
            }

            const priceEl = document.getElementById('case-total-price');
            if (priceEl) {
                priceEl.textContent = 'A$' + Number(price).toFixed(2);
                priceEl.classList.remove('price-pulse');
                void priceEl.offsetWidth;
                priceEl.classList.add('price-pulse');
            }

            updateCaseBadge();
        }

        function updateCaseCameraBump(modelValue) {
            const bumps = {
                plateau: document.getElementById('bump-iphone-plateau'),
                air: document.getElementById('bump-iphone-air'),
                pill: document.getElementById('bump-iphone-pill'),
                proClassic: document.getElementById('bump-iphone-pro-classic'),
                diagonal: document.getElementById('bump-iphone-diagonal'),
                dualVert: document.getElementById('bump-iphone-dual-vert'),
                samsung: document.getElementById('bump-samsung'),
                pixel: document.getElementById('bump-pixel')
            };

            // Hide all bumps and reset animation state
            Object.values(bumps).forEach(b => {
                if (b) {
                    b.classList.add('hidden');
                    b.classList.remove('bump-animate');
                }
            });

            let activeBump = bumps.plateau; // Default fallback

            if (modelValue.startsWith('samsung')) {
                activeBump = bumps.samsung;
            } else if (modelValue.startsWith('pixel')) {
                activeBump = bumps.pixel;
            } else if (modelValue === 'iphone_18_pm' || modelValue === 'iphone_18_p' || 
                       modelValue === 'iphone_17_pm' || modelValue === 'iphone_17_p') {
                // iPhone 18 & 17 Pro Max / Pro: The Big Plateau
                activeBump = bumps.plateau;
            } else if (modelValue === 'iphone_17_air') {
                // iPhone Air (17 Air): Ultra-slim Horizontal Capsule Island
                activeBump = bumps.air;
            } else if (['iphone_17', 'iphone_17e', 'iphone_16', 'iphone_16_plus', 'iphone_16e'].includes(modelValue)) {
                // iPhone 16 / 17 Standard, Plus & e-Series: Vertical Spatial Pill / Single Island
                activeBump = bumps.pill;
            } else if (['iphone_16_pm', 'iphone_16_p', 'iphone_15_pm', 'iphone_15_p', 'iphone_14_pm', 'iphone_14_p', 'iphone_13_pm', 'iphone_13_p', 'iphone_12_pm', 'iphone_12_p', 'iphone_11_pm', 'iphone_11_p'].includes(modelValue)) {
                // Classic Rounded-Square Triple Lens Pro Island
                activeBump = bumps.proClassic;
            } else if (['iphone_15', 'iphone_15_plus', 'iphone_14', 'iphone_14_plus', 'iphone_13', 'iphone_13_mini'].includes(modelValue)) {
                // Classic Diagonal Dual Lens
                activeBump = bumps.diagonal;
            } else if (['iphone_12', 'iphone_12_mini', 'iphone_11'].includes(modelValue)) {
                // Classic Vertical Dual Lens Square
                activeBump = bumps.dualVert;
            }

            if (activeBump) {
                const theme = phoneColorThemes[currentPhoneColor] || phoneColorThemes.black;
                activeBump.style.background = theme.bumpBg;
                activeBump.style.borderColor = theme.bumpBorder;
                activeBump.classList.remove('hidden');
                void activeBump.offsetWidth; // Trigger reflow for spring animation
                activeBump.classList.add('bump-animate');
            }
        }

        function updateCaseBadge() {
            const badge = document.getElementById('case-preview-badge');
            const modelSelect = document.getElementById('case-phone-model');
            if (!badge || !modelSelect) return;

            const modelName = modelSelect.options[modelSelect.selectedIndex]?.text || 'iPhone 18 Pro Max';
            const colorName = phoneColorThemes[currentPhoneColor]?.name || 'Black Titanium';
            const shortDesign = {
                design_1: 'Pre-Design 01 (Great Wave)',
                design_2: 'Pre-Design 02 (Botanical)',
                design_3: 'Pre-Design 03 (Topography)',
                custom: 'Custom Print'
            }[currentCaseDesignMode] || 'Artistic Case';

            badge.textContent = `${modelName} · ${colorName} · ${shortDesign}`;
        }

        function orderCustomCase() {
            const modelSelect = document.getElementById('case-phone-model');
            const modelName = modelSelect?.options[modelSelect.selectedIndex]?.text || 'Custom Device';
            const colorName = phoneColorThemes[currentPhoneColor]?.name || 'Black Titanium';
            const designLabel = artisticDesignNames[currentCaseDesignMode] || 'Artistic Case';
            const typeNames = {
                liquid_clear: 'Liquid Clear Optical Glass Case',
                matte_frosted: 'Frosted Matte Glass Case',
                magsafe_armor: 'MagSafe Optical Armor Glass Case'
            };
            const caseTitle = typeNames[currentCaseType] || 'Artistic Glass Case';
            const summary = `Artistic Case [${caseTitle} · ${designLabel} · Phone Colour: ${colorName}] — A$${currentCasePrice}.00`;

            openBookingModal(modelName, summary);
        }

        function downloadCaseMockup() {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');
            const theme = phoneColorThemes[currentPhoneColor] || phoneColorThemes.black;

            ctx.fillStyle = '#090c12';
            ctx.fillRect(0, 0, 600, 1200);

            const img = document.getElementById('case-preview-img');
            if (img && img.src) {
                const tempImg = new Image();
                tempImg.crossOrigin = 'anonymous';
                tempImg.onload = () => {
                    ctx.save();
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(50, 50, 500, 1100, 70);
                    else ctx.rect(50, 50, 500, 1100);
                    ctx.clip();

                    // Fill dark case body shell
                    ctx.fillStyle = '#090c12';
                    ctx.fillRect(50, 50, 500, 1100);

                    // Draw exposed camera bump island in chosen phone colour
                    ctx.save();
                    ctx.fillStyle = theme.canvasBg;
                    if (ctx.roundRect) ctx.roundRect(75, 80, 450, 225, 55);
                    else ctx.rect(75, 80, 450, 225);
                    ctx.fill();
                    ctx.strokeStyle = theme.frameBorder;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    ctx.restore();

                    const scale = currentCaseZoom || 1;
                    const dw = 500 * scale;
                    const dh = 1100 * scale;
                    const dx = 50 + (500 - dw) / 2;
                    const dy = 50 + (1100 - dh) / 2;
                    ctx.drawImage(tempImg, dx, dy, dw, dh);

                    const grad = ctx.createLinearGradient(50, 50, 550, 1150);
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
                    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
                    grad.addColorStop(0.6, 'transparent');
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(50, 50, 500, 1100);

                    ctx.restore();

                    ctx.lineWidth = 9;
                    ctx.strokeStyle = 'rgba(148, 184, 230, 0.45)';
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(50, 50, 500, 1100, 70);
                    else ctx.rect(50, 50, 500, 1100);
                    ctx.stroke();

                    const link = document.createElement('a');
                    link.download = 'Lee-Nguyen-Lab-Artistic-Case-Mockup.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                };
                tempImg.src = img.src;
            }
        }

        // =========================================================================
        // 8. Apple Spatial 3D Perspective Card Tilt & Header Dynamics
        // =========================================================================
        function init3DTiltCards() {
            const cards = document.querySelectorAll('.glass-card-lift');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotX = -((y / rect.height) - 0.5) * 5;
                    const rotY = ((x / rect.width) - 0.5) * 5;
                    card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-5px) scale(1.01)`;
                }, { passive: true });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });
        }

        function initMockup3DTilt() {
            const mockup = document.getElementById('case-mockup-container');
            if (!mockup) return;
            mockup.addEventListener('mousemove', (e) => {
                const rect = mockup.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotX = -((y / rect.height) - 0.5) * 9;
                const rotY = ((x / rect.width) - 0.5) * 9;
                mockup.style.animationPlayState = 'paused';
                mockup.style.transform = `perspective(850px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
            }, { passive: true });

            mockup.addEventListener('mouseleave', () => {
                mockup.style.animationPlayState = 'running';
                mockup.style.transform = '';
            });
        }

        // Header dynamic scroll state
        function updateHeaderState() {
            const header = document.querySelector('.apple-header-bar');
            if (header) {
                if (window.scrollY > 15) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }

        window.addEventListener('scroll', updateHeaderState, { passive: true });

        // =========================================================================
        // Precision Repair Services Central Info Hub Controller
        // =========================================================================
        const precisionServicesData = {
            screen: {
                id: 'screen',
                calcKey: 'screen',
                title: 'Screen & Optical OLED Restoration',
                protocolTag: 'PROTOCOL 01 // OPTICAL LAB',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
                desc: 'Complete cleanroom display restoration recovering true color fidelity, 120Hz ProMotion touch sampling, and pristine optical transparency. We transfer factory EEPROM calibration for TrueTone continuity and reinstall laser-cut acoustic water-resistant seals.',
                turnaround: '~25–40 Mins',
                warranty: '3 Months Comprehensive',
                tiers: 'OEM / Genuine / AF',
                tolerance: '±0.02mm Optical',
                station: 'ISO 5 CLEANROOM BENCH',
                caption: 'Dynamic Island Super Retina XDR OLED assembly & EEPROM TrueTone sync.',
                image: 'images/precision-services/screen-repair.jpg',
                imageAlt: 'Screen & Optical OLED Restoration Bench',
                checklist: [
                    'TrueTone EEPROM programmer sync & serial validation',
                    '32-point capacitive multi-touch & digitizer grid test',
                    'Oleophobic 9H surface coating scratch-resistance check',
                    'Laser-cut acoustic chassis perimeter gasket reseal'
                ]
            },
            battery: {
                id: 'battery',
                calcKey: 'battery',
                title: 'High-Cycle Battery & BMS Calibration',
                protocolTag: 'PROTOCOL 02 // POWER LAB',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
                desc: 'Certified high-cycle lithium cell replacements engineered for peak power delivery without throttle lag. For iPhone 18 Pro and modern Apple devices, our micro-spot welder transposes your original BMS logic board to eliminate "Unknown Part" system warnings and retain 100% telemetry.',
                turnaround: '~30–45 Mins',
                warranty: '3 Months Comprehensive',
                tiers: 'High-Cycle Cobalt / OEM',
                tolerance: '0.00V Delta Drift',
                station: 'ESD POWER ANALYSIS BENCH',
                caption: 'iPhone 18 Pro architecture with A20 Pro SoC & high-density steel-cased battery.',
                image: 'images/precision-services/battery-replacement.jpg',
                imageAlt: 'iPhone 18 Pro High-Cycle Battery & BMS Calibration Bench',
                checklist: [
                    'Original BMS board spot-welding transplant',
                    'Battery Health 100% capacity cycle counter recalibration',
                    'Dual-cycle charge/discharge thermistor thermal check',
                    'OEM stretch-release pull tabs and thermal interface pad'
                ]
            },
            board: {
                id: 'board',
                calcKey: 'board',
                title: 'Micro-Soldering & Logic Board Diagnostics',
                protocolTag: 'PROTOCOL 03 // BGA LAB',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>`,
                desc: 'Advanced board-level diagnostics under 40x optical stereo zoom and FLIR thermal imaging. We resolve complex board fractures, short circuits, sandwich board reballing, audio IC loop defects, and power management IC failures that other shops deem "unfixable".',
                turnaround: '24–48 Hours',
                warranty: '3 Months Comprehensive',
                tiers: 'Component-Level OEM ICs',
                tolerance: '0.01mm Micro-Jumper',
                station: 'STEREO OPTICAL 40X MICROSCOPE',
                caption: '40x optical stereoscopic micro-soldering on Apple Silicon A-series chip.',
                image: 'images/precision-services/logic-board.jpg',
                imageAlt: 'Micro-Soldering & Logic Board Diagnostics Bench',
                checklist: [
                    'FLIR thermal imaging to isolate power rail ground shorts',
                    '0.01mm insulated micro-jumper trace reconstruction',
                    'CNC precision interposer desoldering & reballing',
                    'Full multimeter impedance voltage line verification'
                ]
            },
            charging: {
                id: 'charging',
                calcKey: 'charging',
                title: 'Charging Port & Acoustic Flex Service',
                protocolTag: 'PROTOCOL 04 // I/O DOCK LAB',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4v1m6 11h2m-6 0h-4v4m0-4v-4m-6 0h2m4-7H8a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"/></svg>`,
                desc: 'Surgical recovery of loose, corroded, or non-responsive USB-C & Lightning ports. We perform micro-debris ultrasonic decontamination, CC1/CC2 pin handshake testing, and full component flex replacements incorporating the lower microphone array and antenna leads.',
                turnaround: '~30–45 Mins',
                warranty: '3 Months Comprehensive',
                tiers: 'OEM-Spec Multi-Layer Flex',
                tolerance: '10,000+ Cycle Rated',
                station: 'USB-PD TELEMETRY BENCH',
                caption: 'Brushed titanium USB-C flex with integrated beamforming mic array.',
                image: 'images/precision-services/charging-port.jpg',
                imageAlt: 'Charging Port & Acoustic Flex Service Bench',
                checklist: [
                    'Ultrasonic pin deoxidation & debris cavity vacuuming',
                    'USB-PD 20V/5A power negotiation handshake testing',
                    'Lower beamforming microphone acoustic response test',
                    'Cellular sub-6 antenna coax grounding verification'
                ]
            },
            software: {
                id: 'software',
                calcKey: 'software',
                title: 'Firmware Recovery & Forensic Data Rescue',
                protocolTag: 'PROTOCOL 05 // SYSTEM LAB',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
                desc: 'Specialized data preservation and firmware recovery for devices stuck in endless boot loops, white-apple loops, or error 4013/1110 storage overflow panics. Hardware-assisted NAND reading and kernel repairs preserve your invaluable photos and business files.',
                turnaround: 'Same-Day / 24h',
                warranty: '3 Months Comprehensive',
                tiers: 'Hardware-Assisted Rescue',
                tolerance: 'Bit-Level Integrity',
                station: 'SYS-RECOVERY NAND BENCH',
                caption: 'Hardware-assisted DFU kernel rescue & Apple Configurator telemetry.',
                image: 'images/precision-services/software-recovery.jpg',
                imageAlt: 'Firmware Recovery & Forensic Data Rescue Bench',
                checklist: [
                    'Kernel panic log extraction & storage error 1110 clearance',
                    'Hardware-assisted DFU mode firmware flashing',
                    'Direct NAND bit-level sector read & photo salvage',
                    'Baseband modem firmware sync & carrier activation test'
                ]
            },
            business: {
                id: 'business',
                calcKey: 'business',
                title: 'Fleet & Enterprise SLA Maintenance',
                protocolTag: 'PROTOCOL 06 // SLA ENTERPRISE',
                iconSvg: `<svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
                desc: 'End-to-end device lifecycle maintenance for corporate fleets, schools, and medical facilities across Greater Sydney. Offering priority bench dispatch, batch diagnostics, unified asset tracking, and strict privacy sanitization meeting enterprise compliance standards.',
                turnaround: 'Same-Day SLA',
                warranty: '3 Months Comprehensive',
                tiers: 'Enterprise Grade',
                tolerance: '32-Point QA Passed',
                station: 'COMMERCIAL SLA DISPATCH',
                caption: 'Enterprise partitioned ESD batch trays & serialized QA diagnostics.',
                image: 'images/precision-services/fleet-business.jpg',
                imageAlt: 'Fleet & Enterprise SLA Maintenance Bench',
                checklist: [
                    'Batch serialization & repair warranty tracking log',
                    'ISO compliant data privacy & non-disclosure protocol',
                    'Express courier pickup & bench dispatch turnaround',
                    '32-point hardware QA validation report per device'
                ]
            }
        };

        function activatePrecisionHubService(serviceId) {
            const data = precisionServicesData[serviceId];
            if (!data) return;

            // 1. Update tab active states
            const tabs = document.querySelectorAll('#hub-service-tabs .hub-service-card');
            tabs.forEach(tab => {
                const isCurrent = tab.getAttribute('data-service-id') === serviceId;
                tab.classList.toggle('active', isCurrent);
                tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
                
                const dot = tab.querySelector('.hub-active-dot');
                if (dot) {
                    dot.style.opacity = isCurrent ? '1' : '0';
                }
                const iconBox = tab.querySelector('.hub-icon-box');
                if (iconBox) {
                    if (isCurrent) {
                        iconBox.classList.add('text-[#7da6d8]');
                        iconBox.classList.remove('text-[#94a3b8]');
                    } else {
                        iconBox.classList.remove('text-[#7da6d8]');
                        iconBox.classList.add('text-[#94a3b8]');
                    }
                }
            });

            // 2. Animate and update Stage Content
            const container = document.getElementById('hub-content-container');
            if (container) {
                container.classList.remove('hub-fade-anim');
                void container.offsetWidth; // trigger reflow
                container.classList.add('hub-fade-anim');
            }

            // 3. Update DOM elements
            const iconEl = document.getElementById('hub-service-icon');
            if (iconEl) iconEl.innerHTML = data.iconSvg;

            const protocolTagEl = document.getElementById('hub-protocol-tag');
            if (protocolTagEl) protocolTagEl.textContent = data.protocolTag;

            const titleEl = document.getElementById('hub-service-title');
            if (titleEl) titleEl.textContent = data.title;

            const descEl = document.getElementById('hub-service-desc');
            if (descEl) descEl.textContent = data.desc;

            const turnaroundEl = document.getElementById('hub-spec-turnaround');
            if (turnaroundEl) turnaroundEl.textContent = data.turnaround;

            const warrantyEl = document.getElementById('hub-spec-warranty');
            if (warrantyEl) warrantyEl.textContent = data.warranty;

            const tiersEl = document.getElementById('hub-spec-tiers');
            if (tiersEl) tiersEl.textContent = data.tiers;

            const toleranceEl = document.getElementById('hub-spec-tolerance');
            if (toleranceEl) toleranceEl.textContent = data.tolerance;

            const checklistEl = document.getElementById('hub-checklist');
            if (checklistEl) {
                checklistEl.innerHTML = data.checklist.map(item => `
                    <li class="flex items-start space-x-2">
                        <span class="text-[#7da6d8] font-bold text-sm leading-none mt-0.5">✓</span>
                        <span class="text-[#f5f5f7]/90 leading-tight">${item}</span>
                    </li>
                `).join('');
            }

            const imageEl = document.getElementById('hub-bench-image');
            if (imageEl) {
                imageEl.src = data.image;
                imageEl.alt = data.imageAlt;
            }

            const stationEl = document.getElementById('hub-bench-station');
            if (stationEl) stationEl.textContent = data.station;

            const captionEl = document.getElementById('hub-bench-caption');
            if (captionEl) captionEl.textContent = data.caption;

            const quoteBtn = document.getElementById('hub-quote-btn');
            if (quoteBtn) {
                const hasLocalQuote = !!(document.getElementById('quote') || document.getElementById('services'));
                quoteBtn.href = hasLocalQuote ? '#quote' : 'services.html#quote';
                quoteBtn.onclick = (e) => {
                    if (hasLocalQuote) {
                        e.preventDefault();
                    }
                    selectServiceInCalculator(data.calcKey);
                };
            }
        }

        function selectServiceInCalculator(serviceKey) {
            const quoteEl = document.getElementById('quote') || document.getElementById('services');
            if (quoteEl) {
                if (window.lenis) {
                    window.lenis.scrollTo(quoteEl, { offset: -76, duration: 1.15 });
                } else {
                    quoteEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                const targetCheckbox = document.querySelector(`#services-checklist input[value="${serviceKey}"]`);
                if (targetCheckbox) {
                    targetCheckbox.checked = true;
                    if (typeof calculateQuote === 'function') {
                        calculateQuote();
                    }
                }
                if (typeof showToast === 'function') {
                    const data = precisionServicesData[serviceKey];
                    const name = data ? data.title : serviceKey;
                    showToast(`Selected protocol: ${name}`);
                }
            } else {
                try {
                    sessionStorage.setItem('preferredRepairService', serviceKey);
                } catch(e) {}
                window.location.href = 'services.html#quote';
            }
        }

        function initPrecisionServicesHub() {
            const tabs = document.querySelectorAll('#hub-service-tabs .hub-service-card');
            if (!tabs || tabs.length === 0) return;

            tabs.forEach(tab => {
                const serviceId = tab.getAttribute('data-service-id');
                // Click to activate
                tab.addEventListener('click', () => {
                    activatePrecisionHubService(serviceId);
                });
                // Hover preview (interactive effect)
                tab.addEventListener('mouseenter', () => {
                    activatePrecisionHubService(serviceId);
                });
                // Keyboard accessibility
                tab.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        activatePrecisionHubService(serviceId);
                    }
                });
            });

            // Default activate first service ('screen')
            activatePrecisionHubService('screen');
        }

        window.precisionServicesData = precisionServicesData;
        window.activatePrecisionHubService = activatePrecisionHubService;
        window.selectServiceInCalculator = selectServiceInCalculator;
        window.initPrecisionServicesHub = initPrecisionServicesHub;

        window.addEventListener('DOMContentLoaded', () => {
            onFamilyChange();
            initCaseStudio();
            initPrecisionServicesHub();

            // Auto-select preferred repair service if navigated from overview page
            try {
                const preferred = sessionStorage.getItem('preferredRepairService');
                if (preferred) {
                    sessionStorage.removeItem('preferredRepairService');
                    setTimeout(() => {
                        selectServiceInCalculator(preferred);
                    }, 300);
                }
            } catch(e) {}
        });

        // Mobile Navigation Accessories Dropdown Toggle
        function toggleMobileAccessories() {
            const menu = document.getElementById('mobile-acc-dropdown');
            const chevron = document.getElementById('mobile-acc-chevron');
            if (menu) {
                menu.classList.toggle('hidden');
                if (chevron) {
                    chevron.classList.toggle('rotate-180');
                }
            }
        }

        // =========================================================================
        // 9. Apple E-Commerce Shopping Cart, Filtering, and Drawer System
        // =========================================================================
        let labCart = [];
        try {
            const stored = localStorage.getItem('lab_cart_items');
            if (stored) labCart = JSON.parse(stored);
        } catch (e) {
            labCart = [];
        }

        function saveCart() {
            try {
                localStorage.setItem('lab_cart_items', JSON.stringify(labCart));
            } catch (e) {}
            updateCartUI();
        }

        function addToCart(item) {
            const existing = labCart.find(i => i.title === item.title && i.variant === item.variant);
            if (existing) {
                existing.qty = (existing.qty || 1) + (item.qty || 1);
            } else {
                labCart.push({
                    id: item.id || ('prod_' + Date.now()),
                    title: item.title,
                    variant: item.variant || 'Standard',
                    price: Number(item.price),
                    image: item.image,
                    qty: item.qty || 1,
                    category: item.category || 'all'
                });
            }
            saveCart();
            showToast(`Added "${item.title}" to cart 🛒`);
            openCartDrawer();
        }

        function addCustomCaseToCart() {
            const modelSelect = document.getElementById('case-phone-model');
            const modelName = modelSelect?.options[modelSelect.selectedIndex]?.text || 'iPhone 18 Pro Max';
            const colorName = phoneColorThemes[currentPhoneColor]?.name || 'Black Titanium';
            const designLabel = artisticDesignNames[currentCaseDesignMode] || 'Artistic Case';
            const typeNames = {
                liquid_clear: 'Liquid Clear Glass',
                matte_frosted: 'Frosted Matte Glass',
                magsafe_armor: 'MagSafe Armor Glass'
            };
            const caseImgMap = {
                liquid_clear: 'images/products/case_clear.jpg',
                matte_frosted: 'images/products/case_matte.jpg',
                magsafe_armor: 'images/products/case_magsafe.jpg'
            };
            const title = currentCaseDesignMode === 'custom'
                ? 'Custom Printed Artistic Case'
                : `Artistic Case (${designLabel})`;
            const variant = `${modelName} (${colorName}) · ${typeNames[currentCaseType] || 'Custom Glass'}`;
            const image = caseImgMap[currentCaseType] || 'images/products/case_clear.jpg';

            addToCart({
                id: 'custom-case-' + Date.now(),
                title: title,
                variant: variant,
                price: currentCasePrice,
                image: image,
                category: 'custom-cases'
            });
        }

        function updateCartQty(index, change) {
            if (!labCart[index]) return;
            labCart[index].qty += change;
            if (labCart[index].qty <= 0) {
                labCart.splice(index, 1);
            }
            saveCart();
        }

        function removeFromCart(index) {
            if (!labCart[index]) return;
            const removed = labCart[index].title;
            labCart.splice(index, 1);
            saveCart();
            showToast(`Removed "${removed}" from cart`);
        }

        function clearCart() {
            labCart = [];
            saveCart();
        }

        function openCartDrawer() {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-backdrop');
            if (drawer && backdrop) {
                backdrop.classList.add('active');
                drawer.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (window.lenis) window.lenis.stop();
            }
        }

        function closeCartDrawer() {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-backdrop');
            if (drawer && backdrop) {
                backdrop.classList.remove('active');
                drawer.classList.remove('active');
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }
        }

        function updateCartUI() {
            const totalCount = labCart.reduce((sum, item) => sum + (item.qty || 1), 0);
            const subtotal = labCart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);

            document.querySelectorAll('.cart-count-badge').forEach(el => {
                el.textContent = totalCount;
                if (totalCount > 0) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            });

            const itemsContainer = document.getElementById('cart-items-list');
            const emptyState = document.getElementById('cart-empty-state');
            const footerContainer = document.getElementById('cart-footer-summary');
            const subtotalEl = document.getElementById('cart-subtotal-val');
            const totalEl = document.getElementById('cart-total-val');

            if (subtotalEl) subtotalEl.textContent = `A$${subtotal.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `A$${subtotal.toFixed(2)}`;

            if (!itemsContainer) return;

            if (labCart.length === 0) {
                itemsContainer.innerHTML = '';
                if (emptyState) emptyState.classList.remove('hidden');
                if (footerContainer) footerContainer.classList.add('opacity-50', 'pointer-events-none');
            } else {
                if (emptyState) emptyState.classList.add('hidden');
                if (footerContainer) footerContainer.classList.remove('opacity-50', 'pointer-events-none');

                itemsContainer.innerHTML = labCart.map((item, index) => `
                    <div class="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white border border-[#DFE7F0] hover:border-[#3B6EA5]/50 transition-all shadow-sm">
                        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 bg-slate-900">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-xs sm:text-sm text-white truncate">${item.title}</h4>
                            <p class="text-[11px] text-[#64748B] truncate">${item.variant}</p>
                            <div class="flex items-center justify-between mt-1.5">
                                <span class="apple-price font-bold text-xs sm:text-sm text-white">A$${item.price}.00</span>
                                <div class="flex items-center space-x-1.5 bg-white/10 border border-white/15 rounded-lg px-1.5 py-0.5">
                                    <button type="button" onclick="updateCartQty(${index}, -1)" class="text-xs text-[#94a3b8] hover:text-white px-1 font-bold">−</button>
                                    <span class="text-xs apple-price font-bold text-white px-1">${item.qty}</span>
                                    <button type="button" onclick="updateCartQty(${index}, 1)" class="text-xs text-[#94a3b8] hover:text-white px-1 font-bold">+</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" onclick="removeFromCart(${index})" class="text-[#94a3b8] hover:text-red-400 p-1.5 transition-colors" title="Remove Item">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                `).join('');
            }
        }

        function showToast(message) {
            let toast = document.getElementById('lab-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'lab-toast';
                toast.className = 'toast-bubble';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<span class="text-[#7da6d8] font-bold">✓</span><span>${message}</span>`;
            toast.classList.add('show');
            clearTimeout(toast.timeout);
            toast.timeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 2800);
        }

        function checkoutCart() {
            if (labCart.length === 0) {
                showToast('Your cart is empty');
                return;
            }
            closeCartDrawer();
            const summaryItems = labCart.map(i => `${i.qty}x ${i.title} (${i.variant}) - A$${i.price * i.qty}.00`).join('\n');
            const total = labCart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
            const orderNotes = `ONLINE ACCESSORIES CART ORDER:\n${summaryItems}\n\nTOTAL: A$${total.toFixed(2)}\nFulfillment: Cabramatta Bench Pickup / Express Dispatch`;

            openBookingModal('Accessories Store Order', orderNotes);
        }

        function filterAccessories(cat, btn) {
            document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');

            const cards = document.querySelectorAll('.product-ecommerce-card');
            cards.forEach(card => {
                const itemCat = card.getAttribute('data-category');
                if (cat === 'all' || itemCat === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            const sections = document.querySelectorAll('.accessory-cat-section');
            sections.forEach(sec => {
                const secCat = sec.getAttribute('data-category');
                if (cat === 'all' || secCat === cat) {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = 'none';
                }
            });
        }

        function searchAccessories(query) {
            const q = (query || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.product-ecommerce-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (!q || text.includes(q)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Initialize cart on load
        window.addEventListener('DOMContentLoaded', () => {
            updateCartUI();
        });


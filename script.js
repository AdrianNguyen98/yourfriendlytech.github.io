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
        let currentPhoneColor = 'burgundy';
        let currentCaseType = 'liquid_clear';
        let currentCasePrice = 49;
        let currentCaseZoom = 1.0;
        let currentCasePanX = 0;
        let currentCasePanY = 0;
        let currentCaseCropMode = 'full';
        let currentCaseCropInset = 0;
        let currentCaseRotation = 0;
        let currentCaseFlipH = 1;
        let currentCaseDesignMode = 'design_1';
        let currentCaseImageSrc = '';
        let customUploadedImageSrc = '';
        let customUploadedImageObj = null;
        let cropGuideTimeout = null;

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

        // Master dictionary of Official Apple iPhone Finishes (iPhone 18 Series down to iPhone 11 & SE)
        const phoneColorThemes = {
            // iPhone 18 Pro / 18 Pro Max (2026 Flagship) — Burgundy, Glacier, Silver, Black
            burgundy:         makeColorTheme('Burgundy', '#4e252d', '#7d4351', '#4e252d', '#281116', '#8a4b59', false),
            glacier:          makeColorTheme('Glacier', '#b2c6da', '#d8e7f4', '#b2c6da', '#8ea8c2', '#7d98b5', true),
            silver:           makeColorTheme('Silver', '#d2d7de', '#f5f7fa', '#d2d7de', '#b8c0cc', '#a4aebc', true),
            black_titanium:   makeColorTheme('Black Titanium', '#2a2d32', '#3a3e46', '#2a2d32', '#16181c', '#4b505a', false),
            natural_titanium: makeColorTheme('Natural Titanium', '#aca8a0', '#cfc9be', '#aca8a0', '#8c877e', '#7d7870', true),
            black:            makeColorTheme('Black', '#26282c', '#363940', '#26282c', '#141619', '#454952', false),

            // iPhone 17 Pro / 17 Pro Max — Cosmic Orange, Deep Blue, Silver
            cosmic_orange:    makeColorTheme('Cosmic Orange', '#ce622c', '#e67c45', '#ce622c', '#9e4418', '#ec8d5b', false),
            deep_blue:        makeColorTheme('Deep Blue', '#264068', '#38588a', '#264068', '#152642', '#4c6fa3', false),

            // iPhone Air (17 Air) — Sky Blue, Cloud White, Light Gold, Space Black
            sky_blue:         makeColorTheme('Sky Blue', '#bad2e6', '#dcebf7', '#bad2e6', '#94b5d1', '#7fa3c2', true),
            cloud_white:      makeColorTheme('Cloud White', '#e8ebf0', '#ffffff', '#e8ebf0', '#cfd6e0', '#b8c2d0', true),
            light_gold:       makeColorTheme('Light Gold', '#e0d2bc', '#f5ece0', '#e0d2bc', '#c4b399', '#b09d82', true),
            space_black:      makeColorTheme('Space Black', '#2a2c30', '#3a3d44', '#2a2c30', '#16181b', '#484c54', false),

            // iPhone 17 & 17e — Lavender, Sage, Mist Blue, Soft Pink, White, Black
            lavender:         makeColorTheme('Lavender', '#ccbce0', '#e6dcf5', '#ccbce0', '#af9cc9', '#9b86b8', true),
            sage:             makeColorTheme('Sage', '#a0b8a2', '#c5dac7', '#a0b8a2', '#829c84', '#6f8a71', true),
            mist_blue:        makeColorTheme('Mist Blue', '#acc6de', '#d0e2f2', '#acc6de', '#8aa8c4', '#7696b4', true),
            soft_pink:        makeColorTheme('Soft Pink', '#ecc6d2', '#fae2ea', '#ecc6d2', '#d4a6b5', '#c291a1', true),
            white:            makeColorTheme('White', '#e8eaee', '#ffffff', '#e8eaee', '#cfd4dc', '#b8bfcc', true),

            // iPhone 16 Pro / 15 Pro — Desert Titanium, White Titanium, Blue Titanium
            desert_titanium:  makeColorTheme('Desert Titanium', '#c4ae98', '#dfd0c0', '#c4ae98', '#a38b73', '#917961', true),
            white_titanium:   makeColorTheme('White Titanium', '#e2e4e8', '#ffffff', '#e2e4e8', '#c8ccd4', '#b2b7c2', true),
            blue_titanium:    makeColorTheme('Blue Titanium', '#34445c', '#485c7a', '#34445c', '#1e293b', '#5c7496', false),

            // iPhone 16 / 16 Plus — Ultramarine, Teal, Pink
            ultramarine:      makeColorTheme('Ultramarine', '#4866d6', '#6884eb', '#4866d6', '#2e47ab', '#7c96f2', false),
            teal:             makeColorTheme('Teal', '#66a6a8', '#8ec4c6', '#66a6a8', '#498587', '#3b7375', true),
            pink_16:          makeColorTheme('Pink', '#e6a2c0', '#f7c4db', '#e6a2c0', '#c980a0', '#b56b8b', true),

            // iPhone 15 / 15 Plus — Pink, Yellow, Green, Blue, Black
            pastel_pink:      makeColorTheme('Pink', '#eabecc', '#fae1e9', '#eabecc', '#cf9eab', '#bd8a98', true),
            pastel_yellow:    makeColorTheme('Yellow', '#ece0a6', '#faf3cf', '#ece0a6', '#cfc182', '#bdb06e', true),
            pastel_green:     makeColorTheme('Green', '#b8d4ba', '#dcf0de', '#b8d4ba', '#96b598', '#82a384', true),
            pastel_blue:      makeColorTheme('Blue', '#a8c2da', '#cfe2f2', '#a8c2da', '#88a4bf', '#7492ae', true),

            // iPhone 14 Pro / 13 Pro / 12 Pro / 11 Pro — Deep Purple, Gold, Graphite, Sierra Blue, Alpine Green, Pacific Blue, Space Gray, Midnight Green
            deep_purple:      makeColorTheme('Deep Purple', '#4e3c60', '#68527e', '#4e3c60', '#312340', '#7c6594', false),
            gold:             makeColorTheme('Gold', '#decaa4', '#f5e8ce', '#decaa4', '#bfa87e', '#ab946a', true),
            graphite:         makeColorTheme('Graphite', '#36383d', '#4a4d54', '#33353a', '#212327', '#5e626b', false),
            sierra_blue:      makeColorTheme('Sierra Blue', '#98b6ce', '#bed8ed', '#98b6ce', '#7696b0', '#6485a0', true),
            alpine_green:     makeColorTheme('Alpine Green', '#48604e', '#5e7a65', '#48604e', '#2d3f31', '#6e8c76', false),
            pacific_blue:     makeColorTheme('Pacific Blue', '#305066', '#436982', '#305066', '#1c3342', '#527c99', false),
            space_gray:       makeColorTheme('Space Gray', '#36383d', '#4a4d54', '#33353a', '#212327', '#5e626b', false),
            midnight_green:   makeColorTheme('Midnight Green', '#404e44', '#56665b', '#404e44', '#28332b', '#687a6d', false),

            // iPhone 14 / 13 / 12 / 11 Standard — Midnight, Starlight, (PRODUCT)RED, Blue, Purple, Yellow, Green
            midnight:         makeColorTheme('Midnight', '#2a2d32', '#3a3e46', '#2a2d32', '#16181c', '#4b505a', false),
            starlight:        makeColorTheme('Starlight', '#eae8e2', '#ffffff', '#eae8e2', '#cfc9be', '#b8b2a6', true),
            product_red:      makeColorTheme('(PRODUCT)RED', '#c4262e', '#e03a42', '#c4262e', '#8f151b', '#ec565e', false),
            slate_blue:       makeColorTheme('Blue', '#a8c2da', '#cfe2f2', '#a8c2da', '#88a4bf', '#7492ae', true),
            lilac_purple:     makeColorTheme('Purple', '#ccc0de', '#e6ddf5', '#ccc0de', '#ad9ec2', '#998ab0', true),
            yellow_14:        makeColorTheme('Yellow', '#ece0a6', '#faf3cf', '#ece0a6', '#cfc182', '#bdb06e', true),
            blue_13:          makeColorTheme('Blue', '#2c588e', '#3f70ad', '#2c588e', '#1a3a61', '#5282bd', false),
            pink_13:          makeColorTheme('Pink', '#eabecc', '#fae1e9', '#eabecc', '#cf9eab', '#bd8a98', true),
            green_13:         makeColorTheme('Green', '#48604e', '#5e7a65', '#48604e', '#2d3f31', '#6e8c76', false),
            mint_green:       makeColorTheme('Green', '#b8dac6', '#dcf2e5', '#b8dac6', '#96baa5', '#82a892', true),
            royal_blue:       makeColorTheme('Blue', '#2c588e', '#3f70ad', '#2c588e', '#1a3a61', '#5282bd', false),
            purple_12:        makeColorTheme('Purple', '#c0b2de', '#ddd2f5', '#c0b2de', '#a191c2', '#8d7db0', true)
        };

        // Official Colours Mapped per Apple iPhone Model (From apple.com)
        const modelOfficialColors = {
            // iPhone 18 Series (2026 Flagship — Full-Width Camera Plateau)
            iphone_18_pm:   ['burgundy', 'glacier', 'silver', 'black_titanium'],
            iphone_18_p:    ['burgundy', 'glacier', 'silver', 'black_titanium'],

            // iPhone 17 Series & iPhone Air
            iphone_17_pm:   ['cosmic_orange', 'deep_blue', 'silver'],
            iphone_17_p:    ['cosmic_orange', 'deep_blue', 'silver'],
            iphone_17_air:  ['sky_blue', 'cloud_white', 'light_gold', 'space_black'],
            iphone_17:      ['lavender', 'sage', 'mist_blue', 'white', 'black'],
            iphone_17e:     ['black', 'white', 'soft_pink'],

            // iPhone 16 Series
            iphone_16_pm:   ['desert_titanium', 'natural_titanium', 'white_titanium', 'black_titanium'],
            iphone_16_p:    ['desert_titanium', 'natural_titanium', 'white_titanium', 'black_titanium'],
            iphone_16_plus: ['ultramarine', 'teal', 'pink_16', 'white', 'black'],
            iphone_16:      ['ultramarine', 'teal', 'pink_16', 'white', 'black'],
            iphone_16e:     ['black', 'white'],

            // iPhone 15 Series
            iphone_15_pm:   ['natural_titanium', 'blue_titanium', 'white_titanium', 'black_titanium'],
            iphone_15_p:    ['natural_titanium', 'blue_titanium', 'white_titanium', 'black_titanium'],
            iphone_15_plus: ['pastel_pink', 'pastel_yellow', 'pastel_green', 'pastel_blue', 'black'],
            iphone_15:      ['pastel_pink', 'pastel_yellow', 'pastel_green', 'pastel_blue', 'black'],

            // iPhone 14 Series
            iphone_14_pm:   ['deep_purple', 'gold', 'silver', 'space_black'],
            iphone_14_p:    ['deep_purple', 'gold', 'silver', 'space_black'],
            iphone_14_plus: ['slate_blue', 'lilac_purple', 'yellow_14', 'midnight', 'starlight', 'product_red'],
            iphone_14:      ['slate_blue', 'lilac_purple', 'yellow_14', 'midnight', 'starlight', 'product_red'],

            // iPhone 13 Series
            iphone_13_pm:   ['sierra_blue', 'alpine_green', 'gold', 'silver', 'graphite'],
            iphone_13_p:    ['sierra_blue', 'alpine_green', 'gold', 'silver', 'graphite'],
            iphone_13:      ['pink_13', 'slate_blue', 'midnight', 'starlight', 'product_red'],
            iphone_13_mini: ['pink_13', 'slate_blue', 'midnight', 'starlight', 'product_red'],

            // iPhone 12 Series
            iphone_12_pm:   ['pacific_blue', 'gold', 'silver', 'graphite'],
            iphone_12_p:    ['pacific_blue', 'gold', 'silver', 'graphite'],
            iphone_12:      ['royal_blue', 'mint_green', 'purple_12', 'product_red', 'white', 'black'],
            iphone_12_mini: ['royal_blue', 'mint_green', 'purple_12', 'product_red', 'white', 'black'],

            // iPhone 11 Series
            iphone_11_pm:   ['midnight_green', 'silver', 'space_gray', 'gold'],
            iphone_11_p:    ['midnight_green', 'silver', 'space_gray', 'gold'],
            iphone_11:      ['purple_12', 'pastel_yellow', 'mint_green', 'black', 'white', 'product_red'],

            // iPhone SE Series (3rd Generation)
            iphone_se_3:    ['midnight', 'starlight']
        };

        // Master dictionary of Calibrated 600x1200 Edge-to-Edge Apple iPhone Hardware Photos per Model & Official Colour
        const iphoneModelPhotos = {
            iphone_18_pm: {
                burgundy:       'images/phones/iphone-18-pro-burgundy.jpg',
                glacier:        'images/phones/iphone-18-pro-glacier.jpg',
                silver:         'images/phones/iphone-18-pro-silver.jpg',
                black_titanium: 'images/phones/iphone-18-pro-black.jpg'
            },
            iphone_18_p: {
                burgundy:       'images/phones/iphone-18-pro-burgundy.jpg',
                glacier:        'images/phones/iphone-18-pro-glacier.jpg',
                silver:         'images/phones/iphone-18-pro-silver.jpg',
                black_titanium: 'images/phones/iphone-18-pro-black.jpg'
            },
            iphone_17_pm: {
                cosmic_orange: 'images/phones/iphone-17-pro.jpg',
                deep_blue:     'images/phones/iphone-17-pro-deep-blue.jpg',
                silver:        'images/phones/iphone-17-pro-silver.jpg'
            },
            iphone_17_p: {
                cosmic_orange: 'images/phones/iphone-17-pro.jpg',
                deep_blue:     'images/phones/iphone-17-pro-deep-blue.jpg',
                silver:        'images/phones/iphone-17-pro-silver.jpg'
            },
            iphone_17_air: {
                sky_blue:    'images/phones/iphone-17-air-sky-blue.jpg',
                cloud_white: 'images/phones/iphone-17-air-cloud-white.jpg',
                light_gold:  'images/phones/iphone-17-air.jpg',
                space_black: 'images/phones/iphone-17-air-space-black.jpg'
            },
            iphone_17: {
                lavender:  'images/phones/iphone-17-lavender.jpg',
                sage:      'images/phones/iphone-17-sage.jpg',
                mist_blue: 'images/phones/iphone-17-mist-blue.jpg',
                white:     'images/phones/iphone-16-white.jpg',
                black:     'images/phones/iphone-16-black.jpg'
            },
            iphone_17e: {
                black:     'images/phones/iphone-17e-black.jpg',
                white:     'images/phones/iphone-17e-white.jpg',
                soft_pink: 'images/phones/iphone-17e-pink.jpg'
            },
            iphone_16_pm: {
                desert_titanium:  'images/phones/iphone-16-pro.jpg',
                natural_titanium: 'images/phones/iphone-15-pro.jpg',
                white_titanium:   'images/phones/iphone-16-pro-white.jpg',
                black_titanium:   'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_16_p: {
                desert_titanium:  'images/phones/iphone-16-pro.jpg',
                natural_titanium: 'images/phones/iphone-15-pro.jpg',
                white_titanium:   'images/phones/iphone-16-pro-white.jpg',
                black_titanium:   'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_16_plus: {
                ultramarine: 'images/phones/iphone-16.jpg',
                teal:        'images/phones/iphone-16-teal.jpg',
                pink_16:     'images/phones/iphone-16-pink.jpg',
                white:       'images/phones/iphone-16-white.jpg',
                black:       'images/phones/iphone-16-black.jpg'
            },
            iphone_16: {
                ultramarine: 'images/phones/iphone-16.jpg',
                teal:        'images/phones/iphone-16-teal.jpg',
                pink_16:     'images/phones/iphone-16-pink.jpg',
                white:       'images/phones/iphone-16-white.jpg',
                black:       'images/phones/iphone-16-black.jpg'
            },
            iphone_16e: {
                black: 'images/phones/iphone-17e-black.jpg',
                white: 'images/phones/iphone-17e-white.jpg'
            },
            iphone_15_pm: {
                natural_titanium: 'images/phones/iphone-15-pro.jpg',
                blue_titanium:    'images/phones/iphone-15-pro-blue.jpg',
                white_titanium:   'images/phones/iphone-16-pro-white.jpg',
                black_titanium:   'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_15_p: {
                natural_titanium: 'images/phones/iphone-15-pro.jpg',
                blue_titanium:    'images/phones/iphone-15-pro-blue.jpg',
                white_titanium:   'images/phones/iphone-16-pro-white.jpg',
                black_titanium:   'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_15_plus: {
                pastel_pink:   'images/phones/iphone-15-pink.jpg',
                pastel_yellow: 'images/phones/iphone-15-yellow.jpg',
                pastel_green:  'images/phones/iphone-15-green.jpg',
                pastel_blue:   'images/phones/iphone-15-blue.jpg',
                black:         'images/phones/iphone-14.jpg'
            },
            iphone_15: {
                pastel_pink:   'images/phones/iphone-15-pink.jpg',
                pastel_yellow: 'images/phones/iphone-15-yellow.jpg',
                pastel_green:  'images/phones/iphone-15-green.jpg',
                pastel_blue:   'images/phones/iphone-15-blue.jpg',
                black:         'images/phones/iphone-14.jpg'
            },
            iphone_14_pm: {
                deep_purple: 'images/phones/iphone-14-pro-purple.jpg',
                gold:        'images/phones/iphone-14-pro-gold.jpg',
                silver:      'images/phones/iphone-16-pro-white.jpg',
                space_black: 'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_14_p: {
                deep_purple: 'images/phones/iphone-14-pro-purple.jpg',
                gold:        'images/phones/iphone-14-pro-gold.jpg',
                silver:      'images/phones/iphone-16-pro-white.jpg',
                space_black: 'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_14_plus: {
                slate_blue:   'images/phones/iphone-15-blue.jpg',
                lilac_purple: 'images/phones/iphone-14-purple.jpg',
                yellow_14:    'images/phones/iphone-15-yellow.jpg',
                midnight:     'images/phones/iphone-14.jpg',
                starlight:    'images/phones/iphone-14-starlight.jpg',
                product_red:  'images/phones/iphone-14-red.jpg'
            },
            iphone_14: {
                slate_blue:   'images/phones/iphone-15-blue.jpg',
                lilac_purple: 'images/phones/iphone-14-purple.jpg',
                yellow_14:    'images/phones/iphone-15-yellow.jpg',
                midnight:     'images/phones/iphone-14.jpg',
                starlight:    'images/phones/iphone-14-starlight.jpg',
                product_red:  'images/phones/iphone-14-red.jpg'
            },
            iphone_13_pm: {
                sierra_blue:  'images/phones/iphone-13-pro-sierra.jpg',
                alpine_green: 'images/phones/iphone-13-pro-alpine.jpg',
                gold:         'images/phones/iphone-14-pro-gold.jpg',
                silver:       'images/phones/iphone-16-pro-white.jpg',
                graphite:     'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_13_p: {
                sierra_blue:  'images/phones/iphone-13-pro-sierra.jpg',
                alpine_green: 'images/phones/iphone-13-pro-alpine.jpg',
                gold:         'images/phones/iphone-14-pro-gold.jpg',
                silver:       'images/phones/iphone-16-pro-white.jpg',
                graphite:     'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_13: {
                pink_13:     'images/phones/iphone-15-pink.jpg',
                slate_blue:  'images/phones/iphone-15-blue.jpg',
                midnight:    'images/phones/iphone-14.jpg',
                starlight:   'images/phones/iphone-14-starlight.jpg',
                product_red: 'images/phones/iphone-14-red.jpg'
            },
            iphone_13_mini: {
                pink_13:     'images/phones/iphone-15-pink.jpg',
                slate_blue:  'images/phones/iphone-15-blue.jpg',
                midnight:    'images/phones/iphone-14.jpg',
                starlight:   'images/phones/iphone-14-starlight.jpg',
                product_red: 'images/phones/iphone-14-red.jpg'
            },
            iphone_12_pm: {
                pacific_blue: 'images/phones/iphone-12-pro-pacific.jpg',
                gold:         'images/phones/iphone-14-pro-gold.jpg',
                silver:       'images/phones/iphone-16-pro-white.jpg',
                graphite:     'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_12_p: {
                pacific_blue: 'images/phones/iphone-12-pro-pacific.jpg',
                gold:         'images/phones/iphone-14-pro-gold.jpg',
                silver:       'images/phones/iphone-16-pro-white.jpg',
                graphite:     'images/phones/iphone-16-pro-black.jpg'
            },
            iphone_12: {
                royal_blue:  'images/phones/iphone-12-blue.jpg',
                mint_green:  'images/phones/iphone-12-green.jpg',
                purple_12:   'images/phones/iphone-12-purple.jpg',
                product_red: 'images/phones/iphone-12-red.jpg',
                white:       'images/phones/iphone-12-white.jpg',
                black:       'images/phones/iphone-12.jpg'
            },
            iphone_12_mini: {
                royal_blue:  'images/phones/iphone-12-blue.jpg',
                mint_green:  'images/phones/iphone-12-green.jpg',
                purple_12:   'images/phones/iphone-12-purple.jpg',
                product_red: 'images/phones/iphone-12-red.jpg',
                white:       'images/phones/iphone-12-white.jpg',
                black:       'images/phones/iphone-12.jpg'
            },
            iphone_11_pm: {
                midnight_green: 'images/phones/iphone-11-pro-green.jpg',
                silver:         'images/phones/iphone-16-pro-white.jpg',
                space_gray:     'images/phones/iphone-16-pro-black.jpg',
                gold:           'images/phones/iphone-14-pro-gold.jpg'
            },
            iphone_11_p: {
                midnight_green: 'images/phones/iphone-11-pro-green.jpg',
                silver:         'images/phones/iphone-16-pro-white.jpg',
                space_gray:     'images/phones/iphone-16-pro-black.jpg',
                gold:           'images/phones/iphone-14-pro-gold.jpg'
            },
            iphone_11: {
                purple_12:     'images/phones/iphone-12-purple.jpg',
                pastel_yellow: 'images/phones/iphone-11-yellow.jpg',
                mint_green:    'images/phones/iphone-12-green.jpg',
                black:         'images/phones/iphone-12.jpg',
                white:         'images/phones/iphone-12-white.jpg',
                product_red:   'images/phones/iphone-12-red.jpg'
            },
            iphone_se_3: {
                midnight:  'images/phones/iphone-17e-black.jpg',
                starlight: 'images/phones/iphone-17e-white.jpg'
            }
        };

        // Fallback photo mapping by model
        const iphoneModelPhotoMap = {
            iphone_18_pm:   'images/phones/iphone-18-pro-burgundy.jpg',
            iphone_18_p:    'images/phones/iphone-18-pro-burgundy.jpg',
            iphone_17_pm:   'images/phones/iphone-17-pro.jpg',
            iphone_17_p:    'images/phones/iphone-17-pro.jpg',
            iphone_17_air:  'images/phones/iphone-17-air-sky-blue.jpg',
            iphone_17:      'images/phones/iphone-17-lavender.jpg',
            iphone_17e:     'images/phones/iphone-17e-black.jpg',
            iphone_16_pm:   'images/phones/iphone-16-pro.jpg',
            iphone_16_p:    'images/phones/iphone-16-pro.jpg',
            iphone_16_plus: 'images/phones/iphone-16.jpg',
            iphone_16:      'images/phones/iphone-16.jpg',
            iphone_16e:     'images/phones/iphone-17e-black.jpg',
            iphone_15_pm:   'images/phones/iphone-15-pro.jpg',
            iphone_15_p:    'images/phones/iphone-15-pro.jpg',
            iphone_15_plus: 'images/phones/iphone-15-pink.jpg',
            iphone_15:      'images/phones/iphone-15-pink.jpg',
            iphone_14_pm:   'images/phones/iphone-14-pro-purple.jpg',
            iphone_14_p:    'images/phones/iphone-14-pro-purple.jpg',
            iphone_14_plus: 'images/phones/iphone-14.jpg',
            iphone_14:      'images/phones/iphone-14.jpg',
            iphone_13_pm:   'images/phones/iphone-13-pro-sierra.jpg',
            iphone_13_p:    'images/phones/iphone-13-pro-sierra.jpg',
            iphone_13:      'images/phones/iphone-14.jpg',
            iphone_13_mini: 'images/phones/iphone-14.jpg',
            iphone_12_pm:   'images/phones/iphone-12-pro-pacific.jpg',
            iphone_12_p:    'images/phones/iphone-12-pro-pacific.jpg',
            iphone_12:      'images/phones/iphone-12.jpg',
            iphone_12_mini: 'images/phones/iphone-12.jpg',
            iphone_11_pm:   'images/phones/iphone-11-pro-green.jpg',
            iphone_11_p:    'images/phones/iphone-11-pro-green.jpg',
            iphone_11:      'images/phones/iphone-12.jpg',
            iphone_se_3:    'images/phones/iphone-17e-black.jpg'
        };

        const artisticDesignNames = {
            design_1: 'Pre-Design 01 · Great Wave & Koi',
            design_2: 'Pre-Design 02 · Botanical Flora',
            design_3: 'Pre-Design 03 · Geo Topography',
            custom: 'Print Your Own Design'
        };

        // Generates edge-to-edge full-bleed artwork for the 3 Signature Artistic Pre-Designs
        function getArtisticPreDesignSvg(designKey, colorKey) {
            if (designKey === 'design_1') {
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<defs>` +
                    `<linearGradient id="waveBg" x1="0" y1="0" x2="0" y2="1">` +
                    `<stop offset="0%" stop-color="%23091322"/>` +
                    `<stop offset="40%" stop-color="%23122744"/>` +
                    `<stop offset="85%" stop-color="%230b172a"/>` +
                    `<stop offset="100%" stop-color="%23060c17"/>` +
                    `</linearGradient>` +
                    `<linearGradient id="koiGrad" x1="0" y1="0" x2="1" y2="1">` +
                    `<stop offset="0%" stop-color="%23f59e0b"/>` +
                    `<stop offset="60%" stop-color="%23ea580c"/>` +
                    `<stop offset="100%" stop-color="%23b45309"/>` +
                    `</linearGradient>` +
                    `<linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="0">` +
                    `<stop offset="0%" stop-color="%231e3a8a"/>` +
                    `<stop offset="50%" stop-color="%232563eb"/>` +
                    `<stop offset="100%" stop-color="%231d4ed8"/>` +
                    `</linearGradient>` +
                    `</defs>` +
                    `<rect width="600" height="1200" fill="url(%23waveBg)"/>` +
                    `<g opacity="0.12" stroke="%2393c5fd" fill="none" stroke-width="1.5">` +
                    `<circle cx="100" cy="950" r="40"/><circle cx="100" cy="950" r="30"/><circle cx="100" cy="950" r="20"/><circle cx="100" cy="950" r="10"/>` +
                    `<circle cx="200" cy="950" r="40"/><circle cx="200" cy="950" r="30"/><circle cx="200" cy="950" r="20"/><circle cx="200" cy="950" r="10"/>` +
                    `<circle cx="300" cy="950" r="40"/><circle cx="300" cy="950" r="30"/><circle cx="300" cy="950" r="20"/><circle cx="300" cy="950" r="10"/>` +
                    `<circle cx="400" cy="950" r="40"/><circle cx="400" cy="950" r="30"/><circle cx="400" cy="950" r="20"/><circle cx="400" cy="950" r="10"/>` +
                    `<circle cx="500" cy="950" r="40"/><circle cx="500" cy="950" r="30"/><circle cx="500" cy="950" r="20"/><circle cx="500" cy="950" r="10"/>` +
                    `</g>` +
                    `<g fill="none" stroke-linecap="round">` +
                    `<path d="M-40,820 C120,680 250,910 400,750 C500,650 570,740 640,690 L640,1240 L-40,1240 Z" fill="url(%23seaGrad)" opacity="0.45"/>` +
                    `<path d="M-40,870 C130,730 260,950 420,790 C520,690 580,780 640,730 L640,1240 L-40,1240 Z" fill="%230f2347" opacity="0.85"/>` +
                    `<path d="M-40,780 C110,650 240,860 390,720 C490,630 560,710 640,660" stroke="%23ffffff" stroke-opacity="0.95" stroke-width="5"/>` +
                    `<path d="M-40,820 C120,690 250,900 400,760 C500,670 570,750 640,700" stroke="%237da6d8" stroke-opacity="0.75" stroke-width="3.5"/>` +
                    `<path d="M60,740 C110,640 220,630 250,700 C210,675 145,690 125,745" stroke="%23ffffff" stroke-opacity="0.9" stroke-width="4"/>` +
                    `<path d="M310,720 C370,610 480,600 515,675 C470,650 405,665 385,725" stroke="%23ffffff" stroke-opacity="0.9" stroke-width="4"/>` +
                    `<g transform="translate(180, 520) rotate(-28)">` +
                    `<path d="M0,0 C30,-40 70,-30 90,10 C60,30 20,25 0,0 Z" fill="url(%23koiGrad)" stroke="%23ffffff" stroke-width="1.5"/>` +
                    `<path d="M90,10 C120,0 145,15 155,30 C135,28 115,22 90,10 Z" fill="%23f59e0b" opacity="0.9"/>` +
                    `<circle cx="25" cy="-8" r="3.5" fill="%23000000"/><circle cx="26" cy="-9" r="1.2" fill="%23ffffff"/>` +
                    `</g>` +
                    `<g transform="translate(340, 780) rotate(42)">` +
                    `<path d="M0,0 C35,-35 80,-25 100,12 C70,32 25,28 0,0 Z" fill="url(%23koiGrad)" stroke="%23ffffff" stroke-width="1.5"/>` +
                    `<path d="M100,12 C130,2 155,18 165,34 C145,30 125,24 100,12 Z" fill="%23f59e0b" opacity="0.9"/>` +
                    `<circle cx="28" cy="-7" r="3.5" fill="%23000000"/><circle cx="29" cy="-8" r="1.2" fill="%23ffffff"/>` +
                    `</g>` +
                    `<circle cx="150" cy="610" r="5" fill="%23ffffff" opacity="0.85"/>` +
                    `<circle cx="185" cy="595" r="3.5" fill="%23ffffff" opacity="0.75"/>` +
                    `<circle cx="465" cy="605" r="4.5" fill="%23ffffff" opacity="0.8"/>` +
                    `<circle cx="280" cy="640" r="3" fill="%2393c5fd" opacity="0.8"/>` +
                    `<circle cx="360" cy="590" r="4" fill="%23ffffff" opacity="0.7"/>` +
                    `</g>` +
                    `<text x="300" y="1120" fill="%23cbd5e1" fill-opacity="0.85" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">LEE NGUYEN · GREAT WAVE &amp; KOI</text>` +
                    `</svg>`;
            } else if (designKey === 'design_2') {
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<defs>` +
                    `<linearGradient id="botanicalBg" x1="0" y1="0" x2="0" y2="1">` +
                    `<stop offset="0%" stop-color="%23061713"/>` +
                    `<stop offset="45%" stop-color="%230c2921"/>` +
                    `<stop offset="85%" stop-color="%23081c17"/>` +
                    `<stop offset="100%" stop-color="%23040e0c"/>` +
                    `</linearGradient>` +
                    `<linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">` +
                    `<stop offset="0%" stop-color="%2315483b"/>` +
                    `<stop offset="100%" stop-color="%230c2921"/>` +
                    `</linearGradient>` +
                    `</defs>` +
                    `<rect width="600" height="1200" fill="url(%23botanicalBg)"/>` +
                    `<g fill="url(%23leafGrad)" opacity="0.55">` +
                    `<path d="M120,480 C180,380 320,400 340,540 C350,650 250,720 160,670 C100,640 80,550 120,480 Z"/>` +
                    `<path d="M380,720 C460,620 580,680 560,820 C540,940 420,980 340,910 C280,860 320,780 380,720 Z"/>` +
                    `</g>` +
                    `<g fill="none" stroke="%23d4af37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
                    `<path d="M160,1080 C200,880 270,720 380,440" stroke-width="3.5" stroke="%23f7e39a"/>` +
                    `<path d="M230,920 C140,890 100,810 150,760 C210,790 240,860 230,920 Z" fill="%23d4af37" fill-opacity="0.12"/>` +
                    `<path d="M275,815 C370,795 425,720 390,660 C330,680 290,745 275,815 Z" fill="%23d4af37" fill-opacity="0.12"/>` +
                    `<path d="M315,705 C220,670 185,585 235,530 C295,560 320,635 315,705 Z" fill="%23d4af37" fill-opacity="0.12"/>` +
                    `<path d="M355,595 C440,570 485,500 450,445 C390,470 365,535 355,595 Z" fill="%23d4af37" fill-opacity="0.12"/>` +
                    `<circle cx="300" cy="710" r="195" stroke="%23d4af37" stroke-opacity="0.35" stroke-width="1.8" stroke-dasharray="8 8"/>` +
                    `<circle cx="410" cy="445" r="18" fill="%23f7e39a" fill-opacity="0.25" stroke="%23f7e39a" stroke-width="2"/>` +
                    `</g>` +
                    `<text x="300" y="1120" fill="%23f7e39a" fill-opacity="0.85" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">LEE NGUYEN · BOTANICAL FLORA</text>` +
                    `</svg>`;
            } else {
                return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200">` +
                    `<defs>` +
                    `<linearGradient id="topoBg" x1="0" y1="0" x2="0" y2="1">` +
                    `<stop offset="0%" stop-color="%230a0d13"/>` +
                    `<stop offset="50%" stop-color="%23141a24"/>` +
                    `<stop offset="100%" stop-color="%23070a0e"/>` +
                    `</linearGradient>` +
                    `</defs>` +
                    `<rect width="600" height="1200" fill="url(%23topoBg)"/>` +
                    `<g fill="none">` +
                    `<path d="M-20,480 Q160,390 320,510 T620,460" stroke="%23c9a875" stroke-opacity="0.45" stroke-width="2"/>` +
                    `<path d="M-20,530 Q170,430 330,560 T620,510" stroke="%23e2d1b3" stroke-opacity="0.65" stroke-width="2.5"/>` +
                    `<path d="M-20,580 Q180,470 340,610 T620,560" stroke="%23c9a875" stroke-opacity="0.5" stroke-width="2"/>` +
                    `<path d="M-20,630 Q190,510 350,660 T620,610" stroke="%23e2d1b3" stroke-opacity="0.75" stroke-width="2.8"/>` +
                    `<path d="M-20,680 Q200,550 360,710 T620,660" stroke="%2360a5fa" stroke-opacity="0.55" stroke-width="2.2"/>` +
                    `<path d="M-20,730 Q210,590 370,760 T620,710" stroke="%23c9a875" stroke-opacity="0.45" stroke-width="2"/>` +
                    `<path d="M-20,780 Q220,630 380,810 T620,760" stroke="%23e2d1b3" stroke-opacity="0.65" stroke-width="2.5"/>` +
                    `<path d="M-20,830 Q230,670 390,860 T620,810" stroke="%23c9a875" stroke-opacity="0.4" stroke-width="1.8"/>` +
                    `<path d="M-20,880 Q240,710 400,910 T620,860" stroke="%2360a5fa" stroke-opacity="0.45" stroke-width="2"/>` +
                    `<path d="M-20,930 Q250,750 410,960 T620,910" stroke="%23c9a875" stroke-opacity="0.35" stroke-width="1.5"/>` +
                    `<circle cx="300" cy="710" r="120" stroke="%23e2d1b3" stroke-opacity="0.6" stroke-width="2.4"/>` +
                    `<circle cx="300" cy="710" r="70" fill="%2360a5fa" fill-opacity="0.12" stroke="%2360a5fa" stroke-opacity="0.55" stroke-width="1.8"/>` +
                    `<circle cx="300" cy="710" r="6" fill="%23e2d1b3"/>` +
                    `<line x1="300" y1="360" x2="300" y2="1060" stroke="%23c9a875" stroke-opacity="0.25" stroke-width="1.2" stroke-dasharray="6 6"/>` +
                    `<line x1="60" y1="710" x2="540" y2="710" stroke="%23c9a875" stroke-opacity="0.25" stroke-width="1.2" stroke-dasharray="6 6"/>` +
                    `<text x="320" y="700" fill="%23e2d1b3" font-family="monospace" font-size="10" opacity="0.8">ELEV. 1,480M</text>` +
                    `<text x="320" y="725" fill="%2360a5fa" font-family="monospace" font-size="9" opacity="0.8">33°51'S 151°12'E</text>` +
                    `</g>` +
                    `<text x="300" y="1120" fill="%23cbd5e1" fill-opacity="0.85" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="4">LEE NGUYEN · GEO TOPOGRAPHY</text>` +
                    `</svg>`;
            }
        }

        // Dynamically renders the official colours for the selected phone model
        function renderPhoneColorSwatches(modelValue) {
            const grid = document.getElementById('case-phone-color-grid');
            const colorKeys = modelOfficialColors[modelValue] || ['burgundy', 'glacier', 'silver', 'black_titanium'];

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

            const nextColor = colorKeys.includes(currentPhoneColor) ? currentPhoneColor : colorKeys[0];
            setPhoneColor(nextColor);
        }

        let currentMockupView = 'case';

        function toggleMockupView(view) {
            currentMockupView = view;
            const artContainer = document.getElementById('case-art-container');
            const magsafe = document.getElementById('case-magsafe-ring');
            const btnCase = document.getElementById('btn-view-case');
            const btnPhone = document.getElementById('btn-view-phone');

            if (view === 'phone') {
                if (artContainer) artContainer.style.opacity = '0';
                if (magsafe) magsafe.style.opacity = '0';

                if (btnPhone) {
                    btnPhone.className = 'px-2.5 py-1 rounded-full bg-[#1c355c] text-[#f5f5f7] transition-all font-semibold';
                }
                if (btnCase) {
                    btnCase.className = 'px-2.5 py-1 rounded-full text-[#94a3b8] hover:text-[#f5f5f7] transition-all font-semibold';
                }
            } else {
                if (artContainer) artContainer.style.opacity = '1';
                if (magsafe) magsafe.style.opacity = '1';

                if (btnCase) {
                    btnCase.className = 'px-2.5 py-1 rounded-full bg-[#1c355c] text-[#f5f5f7] transition-all font-semibold';
                }
                if (btnPhone) {
                    btnPhone.className = 'px-2.5 py-1 rounded-full text-[#94a3b8] hover:text-[#f5f5f7] transition-all font-semibold';
                }
            }
        }

        // Updates the real edge-to-edge 600x1200 Apple iPhone hardware photo
        function updateRealPhonePhoto(modelValue, colorKey) {
            const baseImg = document.getElementById('case-phone-base-img');
            if (!baseImg) return;

            const modelPhotos = iphoneModelPhotos[modelValue] || {};
            const photoUrl = modelPhotos[colorKey] || iphoneModelPhotoMap[modelValue] || 'images/phones/iphone-18-pro-burgundy.jpg';

            baseImg.style.opacity = '0.35';
            setTimeout(() => {
                baseImg.src = photoUrl;
                baseImg.style.opacity = '1';
            }, 80);
        }

        function getCameraCutoutSpec(modelValue) {
            if (['iphone_18_pm', 'iphone_18_p', 'iphone_17_pm', 'iphone_17_p'].includes(modelValue)) {
                // iPhone 18 Pro / Pro Max & iPhone 17 Pro / Pro Max: Full-Width Rectangular Camera Plateau
                return { x: 13.5, y: 9.5, width: 258.5, height: 148, rx: 31.5 };
            } else if (modelValue === 'iphone_17_air') {
                // iPhone Air (17 Air): Full-Width Horizontal Pill Camera Plateau
                return { x: 12.5, y: 15, width: 265, height: 69, rx: 34.5 };
            } else if (['iphone_17', 'iphone_16', 'iphone_16_plus'].includes(modelValue)) {
                // iPhone 17 & iPhone 16 / 16 Plus: Contoured Vertical Pill Glass Bump + Side Flash/Mic Lobe
                return {
                    x: 15,
                    y: 12.5,
                    width: 80,
                    height: 149,
                    rx: 40,
                    keyhole: true,
                    lobe: { y1: 68, y2: 106, cx: 112, r: 19, fillet: 6 }
                };
            } else if (['iphone_16_pm', 'iphone_16_p', 'iphone_15_pm', 'iphone_15_p', 'iphone_14_pm', 'iphone_14_p', 'iphone_13_pm', 'iphone_13_p', 'iphone_12_pm', 'iphone_12_p', 'iphone_11_pm', 'iphone_11_p'].includes(modelValue)) {
                // iPhone 16 Pro down to 11 Pro: Raised Square Pro Triple-Camera Glass Plateau
                return { x: 14.5, y: 13.5, width: 150, height: 147.5, rx: 34 };
            } else if (['iphone_15', 'iphone_15_plus', 'iphone_14', 'iphone_14_plus', 'iphone_13', 'iphone_13_mini'].includes(modelValue)) {
                // iPhone 15 / 14 / 13: Top-Left Diagonal Dual-Camera Square Glass Bump
                return { x: 13.5, y: 11.5, width: 141.5, height: 149.5, rx: 35 };
            } else if (['iphone_12', 'iphone_12_mini', 'iphone_11'].includes(modelValue)) {
                // iPhone 12 / 11: Top-Left Vertical Dual-Camera Square Glass Bump
                return { x: 13.5, y: 11.5, width: 132, height: 149.5, rx: 35 };
            } else if (['iphone_17e', 'iphone_16e', 'iphone_se_3'].includes(modelValue)) {
                // iPhone 17e / 16e / SE: Top-Left Single 48MP Camera + Flash Glass Capsule
                return { x: 14.5, y: 12.5, width: 105, height: 72, rx: 36 };
            }
            return { x: 13.5, y: 9.5, width: 258.5, height: 148, rx: 31.5 };
        }

        function buildCutoutSvgPath(spec, scale = 1) {
            const s = (v) => Number((v * scale).toFixed(2));
            if (spec.keyhole && spec.lobe) {
                const x1 = s(spec.x);
                const x2 = s(spec.x + spec.width);
                const r = s(spec.rx);
                const cyTop = s(spec.y + spec.rx);
                const cyBot = s(spec.y + spec.height - spec.rx);
                const ly1 = s(spec.lobe.y1);
                const ly2 = s(spec.lobe.y2);
                const lcx = s(spec.lobe.cx);
                const lr = s(spec.lobe.r);
                const f = spec.lobe.fillet || 6;
                return [
                    `M ${x1} ${cyTop}`,
                    `A ${r} ${r} 0 0 1 ${x2} ${cyTop}`,
                    `L ${x2} ${s(spec.lobe.y1 - f)}`,
                    `Q ${x2} ${ly1} ${s(spec.x + spec.width + f)} ${ly1}`,
                    `L ${lcx} ${ly1}`,
                    `A ${lr} ${lr} 0 0 1 ${lcx} ${ly2}`,
                    `L ${s(spec.x + spec.width + f)} ${ly2}`,
                    `Q ${x2} ${ly2} ${x2} ${s(spec.lobe.y2 + f)}`,
                    `L ${x2} ${cyBot}`,
                    `A ${r} ${r} 0 0 1 ${x1} ${cyBot}`,
                    `Z`
                ].join(' ');
            }

            const x = s(spec.x);
            const y = s(spec.y);
            const r = s(Math.min(spec.rx, spec.width / 2, spec.height / 2));
            return [
                `M ${x} ${s(spec.y + Math.min(spec.rx, spec.width / 2, spec.height / 2))}`,
                `A ${r} ${r} 0 0 1 ${s(spec.x + Math.min(spec.rx, spec.width / 2, spec.height / 2))} ${y}`,
                `L ${s(spec.x + spec.width - Math.min(spec.rx, spec.width / 2, spec.height / 2))} ${y}`,
                `A ${r} ${r} 0 0 1 ${s(spec.x + spec.width)} ${s(spec.y + Math.min(spec.rx, spec.width / 2, spec.height / 2))}`,
                `L ${s(spec.x + spec.width)} ${s(spec.y + spec.height - Math.min(spec.rx, spec.width / 2, spec.height / 2))}`,
                `A ${r} ${r} 0 0 1 ${s(spec.x + spec.width - Math.min(spec.rx, spec.width / 2, spec.height / 2))} ${s(spec.y + spec.height)}`,
                `L ${s(spec.x + Math.min(spec.rx, spec.width / 2, spec.height / 2))} ${s(spec.y + spec.height)}`,
                `A ${r} ${r} 0 0 1 ${x} ${s(spec.y + spec.height - Math.min(spec.rx, spec.width / 2, spec.height / 2))}`,
                `Z`
            ].join(' ');
        }

        function updateCaseCameraCutout(modelValue) {
            const cutoutPath = document.getElementById('cutout-mask-path');
            const bevelOuter = document.getElementById('case-svg-bevel-outer');
            const bevelInner = document.getElementById('case-svg-bevel-inner');

            const spec = getCameraCutoutSpec(modelValue);
            const d = buildCutoutSvgPath(spec, 1);

            if (cutoutPath) {
                cutoutPath.setAttribute('d', d);
            }
            if (bevelOuter) {
                bevelOuter.setAttribute('d', d);
            }
            if (bevelInner) {
                bevelInner.setAttribute('d', d);
            }
        }

        // Computes the active crop rectangle in 290x580 SVG space based on crop mode and margin/inset %
        function getActiveCropGeometry() {
            const insetFraction = (currentCaseCropInset || 0) / 100;
            const padX = Math.round(290 * insetFraction * 0.65);
            const padY = Math.round(580 * insetFraction * 0.45);

            if (currentCaseCropMode === 'poster') {
                // Framed 3:4 Portrait below camera deck
                const baseW = 234 - padX * 1.4;
                const baseH = Math.min(340, Math.round(baseW * 1.33));
                const x = Math.round((290 - baseW) / 2);
                const y = Math.round(160 + (390 - baseH) / 2);
                return { x, y, width: Math.max(80, baseW), height: Math.max(100, baseH), rx: 24 };
            } else if (currentCaseCropMode === 'square') {
                // Centered 1:1 Square crop below camera deck
                const side = Math.max(90, 232 - padX * 1.6);
                const x = Math.round((290 - side) / 2);
                const y = Math.round(168 + (370 - side) / 2);
                return { x, y, width: side, height: side, rx: 26 };
            } else if (currentCaseCropMode === 'circle') {
                // Emblem Circle crop centered on lower back
                const diam = Math.max(90, 224 - padX * 1.6);
                const x = Math.round((290 - diam) / 2);
                const y = Math.round(172 + (360 - diam) / 2);
                return { x, y, width: diam, height: diam, rx: Math.round(diam / 2) };
            }

            // Default 'full': Full Bleed with adjustable Crop Margin / Trim
            const w = Math.max(100, 290 - padX * 2);
            const h = Math.max(200, 580 - padY * 2);
            const rx = Math.max(18, 44 - Math.round(padX * 0.4));
            return { x: padX, y: padY, width: w, height: h, rx: rx };
        }

        function getArtworkBaseDimensions() {
            const caseW = 290;
            const caseH = 580;
            let imgAspect = 0.5; // default 1:2
            if (customUploadedImageObj && customUploadedImageObj.naturalWidth && customUploadedImageObj.naturalHeight) {
                imgAspect = customUploadedImageObj.naturalWidth / customUploadedImageObj.naturalHeight;
            }
            let baseW = 290;
            let baseH = 580;
            if (imgAspect > 0.5) {
                baseH = 580;
                baseW = 580 * imgAspect;
            } else {
                baseW = 290;
                baseH = 290 / imgAspect;
            }
            const rad = (currentCaseRotation % 360) * Math.PI / 180;
            const rotW = Math.abs(baseW * Math.cos(rad)) + Math.abs(baseH * Math.sin(rad));
            const rotH = Math.abs(baseW * Math.sin(rad)) + Math.abs(baseH * Math.cos(rad));
            return { baseW, baseH, rotW, rotH, caseW, caseH };
        }

        function getSafeArtworkPanLimits() {
            const { rotW, rotH, caseW, caseH } = getArtworkBaseDimensions();
            const zoom = Math.max(1.0, currentCaseZoom);
            const overflowX = Math.max(0, Math.round((rotW * zoom - caseW) / 2));
            const overflowY = Math.max(0, Math.round((rotH * zoom - caseH) / 2));
            const maxPanX = Math.max(45, overflowX);
            const maxPanY = Math.max(70, overflowY);
            return { maxPanX, maxPanY, overflowX, overflowY };
        }

        function getEffectiveArtworkZoom() {
            const { rotW, rotH, caseW, caseH } = getArtworkBaseDimensions();
            const coverageScaleX = (caseW + 2 * Math.abs(currentCasePanX)) / rotW;
            const coverageScaleY = (caseH + 2 * Math.abs(currentCasePanY)) / rotH;
            const minCoverZoom = Math.max(1.0, coverageScaleX, coverageScaleY);
            return Math.max(currentCaseZoom, minCoverZoom);
        }

        function updatePanSliderRanges() {
            const { maxPanX, maxPanY } = getSafeArtworkPanLimits();
            const panXRange = document.getElementById('case-pan-x-range');
            const panYRange = document.getElementById('case-pan-y-range');
            if (panXRange) {
                panXRange.min = -maxPanX;
                panXRange.max = maxPanX;
                if (Number(panXRange.value) !== currentCasePanX) {
                    panXRange.value = currentCasePanX;
                }
            }
            if (panYRange) {
                panYRange.min = -maxPanY;
                panYRange.max = maxPanY;
                if (Number(panYRange.value) !== currentCasePanY) {
                    panYRange.value = currentCasePanY;
                }
            }
        }

        function applyArtworkTransform(showGuide = false) {
            const previewImg = document.getElementById('case-preview-img');
            const cropRect = document.getElementById('case-art-crop-rect');
            const guideRect = document.getElementById('case-crop-guide-rect');

            const { maxPanX, maxPanY } = getSafeArtworkPanLimits();
            currentCasePanX = Math.max(-maxPanX, Math.min(maxPanX, currentCasePanX));
            currentCasePanY = Math.max(-maxPanY, Math.min(maxPanY, currentCasePanY));

            const effectiveZoom = getEffectiveArtworkZoom();

            if (previewImg) {
                const sx = (effectiveZoom * currentCaseFlipH).toFixed(3);
                const sy = effectiveZoom.toFixed(3);
                previewImg.style.transformOrigin = '145px 290px';
                previewImg.style.transform = `translate(${currentCasePanX}px, ${currentCasePanY}px) rotate(${currentCaseRotation}deg) scale(${sx}, ${sy})`;
            }

            const crop = getActiveCropGeometry();
            if (cropRect) {
                cropRect.setAttribute('x', crop.x);
                cropRect.setAttribute('y', crop.y);
                cropRect.setAttribute('width', crop.width);
                cropRect.setAttribute('height', crop.height);
                cropRect.setAttribute('rx', crop.rx);
            }

            if (guideRect) {
                guideRect.setAttribute('x', crop.x);
                guideRect.setAttribute('y', crop.y);
                guideRect.setAttribute('width', crop.width);
                guideRect.setAttribute('height', crop.height);
                guideRect.setAttribute('rx', crop.rx);

                if (showGuide || currentCaseCropMode !== 'full' || currentCaseCropInset > 0) {
                    guideRect.style.opacity = showGuide ? '0.92' : '0.45';
                    if (showGuide) {
                        if (cropGuideTimeout) clearTimeout(cropGuideTimeout);
                        cropGuideTimeout = setTimeout(() => {
                            guideRect.style.opacity = (currentCaseCropMode !== 'full' || currentCaseCropInset > 0) ? '0.42' : '0';
                        }, 1100);
                    }
                } else {
                    guideRect.style.opacity = '0';
                }
            }
        }

        function setCaseCropMode(mode) {
            currentCaseCropMode = mode;
            ['full', 'poster', 'square', 'circle'].forEach(k => {
                const btn = document.getElementById('crop-mode-' + k);
                if (btn) {
                    if (k === mode) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            });
            applyArtworkTransform(true);
        }

        function rotateCaseArtwork(degDelta) {
            currentCaseRotation = (currentCaseRotation + degDelta) % 360;
            updatePanSliderRanges();
            applyArtworkTransform(true);
        }

        function flipCaseArtworkHorizontal() {
            currentCaseFlipH = currentCaseFlipH * -1;
            applyArtworkTransform(true);
        }

        function autoFitCaseArtwork() {
            currentCaseZoom = 1.0;
            currentCasePanX = 0;
            currentCasePanY = 0;
            currentCaseCropInset = 0;
            currentCaseRotation = 0;
            currentCaseFlipH = 1;
            currentCaseCropMode = 'full';

            updatePanSliderRanges();

            const zoomRange = document.getElementById('case-zoom-range');
            const zoomVal = document.getElementById('case-zoom-val');
            if (zoomRange) zoomRange.value = 100;
            if (zoomVal) zoomVal.textContent = '100%';

            const panXRange = document.getElementById('case-pan-x-range');
            const panXVal = document.getElementById('case-pan-x-val');
            if (panXRange) panXRange.value = 0;
            if (panXVal) panXVal.textContent = '0 px';

            const panYRange = document.getElementById('case-pan-y-range');
            const panYVal = document.getElementById('case-pan-y-val');
            if (panYRange) panYRange.value = 0;
            if (panYVal) panYVal.textContent = '0 px';

            const cropInsetRange = document.getElementById('case-crop-inset-range');
            const cropInsetVal = document.getElementById('case-crop-inset-val');
            if (cropInsetRange) cropInsetRange.value = 0;
            if (cropInsetVal) cropInsetVal.textContent = '0%';

            setCaseCropMode('full');
            applyArtworkTransform(false);
        }

        function resetCaseArtworkTransform() {
            autoFitCaseArtwork();
        }

        function initCaseStudio() {
            const modelSelect = document.getElementById('case-phone-model');
            const fileInput = document.getElementById('case-file-input');
            const zoomRange = document.getElementById('case-zoom-range');
            const zoomVal = document.getElementById('case-zoom-val');
            const cropInsetRange = document.getElementById('case-crop-inset-range');
            const cropInsetVal = document.getElementById('case-crop-inset-val');
            const panXRange = document.getElementById('case-pan-x-range');
            const panXVal = document.getElementById('case-pan-x-val');
            const panYRange = document.getElementById('case-pan-y-range');
            const panYVal = document.getElementById('case-pan-y-val');
            const magSafeToggle = document.getElementById('case-magsafe-toggle');
            const previewImg = document.getElementById('case-preview-img');

            if (!modelSelect || !previewImg) return;

            currentCasePhone = modelSelect.value;
            renderPhoneColorSwatches(currentCasePhone);
            selectArtisticDesign('design_1');
            updateRealPhonePhoto(currentCasePhone, currentPhoneColor);
            updateCaseCameraCutout(currentCasePhone);
            applyArtworkTransform(false);
            updateCaseBadge();

            modelSelect.addEventListener('change', (e) => {
                currentCasePhone = e.target.value;
                renderPhoneColorSwatches(currentCasePhone);
                updateRealPhonePhoto(currentCasePhone, currentPhoneColor);
                updateCaseCameraCutout(currentCasePhone);
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

            // Drag & drop image files onto Custom Print button or Mockup Container
            const customBtn = document.getElementById('case-design-btn-custom');
            const mockupContainer = document.getElementById('case-mockup-container');
            [customBtn, mockupContainer].forEach(el => {
                if (!el) return;
                ['dragenter', 'dragover'].forEach(eventName => {
                    el.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        el.classList.add('dragover');
                    });
                });
                ['dragleave', 'drop'].forEach(eventName => {
                    el.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        el.classList.remove('dragover');
                    });
                });
                el.addEventListener('drop', (e) => {
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                        handleUploadedCaseImage(file);
                    }
                });
            });

            if (zoomRange && zoomVal) {
                zoomRange.addEventListener('input', (e) => {
                    currentCaseZoom = Number(e.target.value) / 100;
                    zoomVal.textContent = e.target.value + '%';
                    updatePanSliderRanges();
                    applyArtworkTransform(true);
                });
            }

            if (cropInsetRange && cropInsetVal) {
                cropInsetRange.addEventListener('input', (e) => {
                    currentCaseCropInset = Number(e.target.value);
                    cropInsetVal.textContent = e.target.value + '%';
                    applyArtworkTransform(true);
                });
            }

            if (panXRange && panXVal) {
                panXRange.addEventListener('input', (e) => {
                    const { maxPanX } = getSafeArtworkPanLimits();
                    currentCasePanX = Math.max(-maxPanX, Math.min(maxPanX, Number(e.target.value)));
                    panXVal.textContent = currentCasePanX + ' px';
                    applyArtworkTransform(true);
                });
            }

            if (panYRange && panYVal) {
                panYRange.addEventListener('input', (e) => {
                    const { maxPanY } = getSafeArtworkPanLimits();
                    currentCasePanY = Math.max(-maxPanY, Math.min(maxPanY, Number(e.target.value)));
                    panYVal.textContent = currentCasePanY + ' px';
                    applyArtworkTransform(true);
                });
            }

            // Direct Pointer / Touch Drag on Live Case Preview to Move Artwork
            if (mockupContainer) {
                let isDraggingArt = false;
                let startClientX = 0;
                let startClientY = 0;
                let startPanX = 0;
                let startPanY = 0;

                mockupContainer.addEventListener('pointerdown', (e) => {
                    if (currentMockupView !== 'case') return;
                    isDraggingArt = true;
                    startClientX = e.clientX;
                    startClientY = e.clientY;
                    startPanX = currentCasePanX;
                    startPanY = currentCasePanY;
                    if (mockupContainer.setPointerCapture) {
                        try { mockupContainer.setPointerCapture(e.pointerId); } catch (_) {}
                    }
                    applyArtworkTransform(true);
                });

                mockupContainer.addEventListener('pointermove', (e) => {
                    if (!isDraggingArt) return;
                    const dx = Math.round(e.clientX - startClientX);
                    const dy = Math.round(e.clientY - startClientY);
                    const { maxPanX, maxPanY } = getSafeArtworkPanLimits();
                    currentCasePanX = Math.max(-maxPanX, Math.min(maxPanX, startPanX + dx));
                    currentCasePanY = Math.max(-maxPanY, Math.min(maxPanY, startPanY + dy));

                    if (panXRange) panXRange.value = currentCasePanX;
                    if (panXVal) panXVal.textContent = currentCasePanX + ' px';
                    if (panYRange) panYRange.value = currentCasePanY;
                    if (panYVal) panYVal.textContent = currentCasePanY + ' px';

                    applyArtworkTransform(true);
                });

                const stopDrag = () => {
                    if (isDraggingArt) {
                        isDraggingArt = false;
                        applyArtworkTransform(false);
                    }
                };
                mockupContainer.addEventListener('pointerup', stopDrag);
                mockupContainer.addEventListener('pointercancel', stopDrag);
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

            const grid = document.getElementById('case-phone-color-grid');
            if (grid) {
                grid.querySelectorAll('button').forEach(btn => {
                    if (btn.id === 'phone-col-' + colorKey) btn.classList.add('active');
                    else btn.classList.remove('active');
                });
            }

            const colorLabel = document.getElementById('case-phone-color-label');
            if (colorLabel) colorLabel.textContent = theme.name;

            if (currentCaseDesignMode.startsWith('design_')) {
                const svgUrl = getArtisticPreDesignSvg(currentCaseDesignMode, currentPhoneColor);
                currentCaseImageSrc = svgUrl;
                const previewImg = document.getElementById('case-preview-img');
                if (previewImg) {
                    if (previewImg.tagName && previewImg.tagName.toLowerCase() === 'image') {
                        previewImg.setAttribute('href', svgUrl);
                        previewImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', svgUrl);
                    } else {
                        previewImg.src = svgUrl;
                    }
                }
            }

            updateRealPhonePhoto(currentCasePhone, colorKey);
            updateCaseBadge();
        }

        function selectArtisticDesign(designKey) {
            const previousMode = currentCaseDesignMode;
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

            if (designKey !== 'custom') {
                customUploadedImageObj = null;
            }

            // Default artwork will automatically fit the case bounds perfectly
            autoFitCaseArtwork();

            if (designKey === 'custom') {
                if (customUploadedImageSrc && previousMode !== 'custom') {
                    applyCasePreviewImage(customUploadedImageSrc);
                } else {
                    const fileInput = document.getElementById('case-file-input');
                    if (fileInput) fileInput.click();
                }
            } else {
                const svgUrl = getArtisticPreDesignSvg(designKey, currentPhoneColor);
                applyCasePreviewImage(svgUrl);
            }

            updateCaseBadge();
        }

        function applyCasePreviewImage(srcUrl) {
            currentCaseImageSrc = srcUrl;
            const previewImg = document.getElementById('case-preview-img');
            if (previewImg) {
                previewImg.style.opacity = '0.35';
                setTimeout(() => {
                    if (previewImg.tagName && previewImg.tagName.toLowerCase() === 'image') {
                        previewImg.setAttribute('href', srcUrl);
                        previewImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', srcUrl);
                    } else {
                        previewImg.src = srcUrl;
                    }
                    previewImg.style.opacity = '1';
                    applyArtworkTransform(false);
                }, 80);
            }
        }

        function handleUploadedCaseImage(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                customUploadedImageSrc = event.target.result;
                currentCaseDesignMode = 'custom';

                ['case-design-btn-1', 'case-design-btn-2', 'case-design-btn-3'].forEach(id => {
                    document.getElementById(id)?.classList.remove('active');
                });
                document.getElementById('case-design-btn-custom')?.classList.add('active');

                const modeLabel = document.getElementById('case-design-mode-label');
                if (modeLabel) modeLabel.textContent = 'Custom Print (Uploaded)';

                const btnTitle = document.getElementById('custom-btn-title');
                const btnSubtitle = document.getElementById('custom-btn-subtitle');
                if (btnTitle) btnTitle.textContent = 'Custom Loaded';
                if (btnSubtitle) {
                    const displayName = file.name.length > 18 ? file.name.substring(0, 15) + '…' : file.name;
                    btnSubtitle.textContent = displayName;
                    btnSubtitle.title = file.name;
                }

                // Automatically measure uploaded image aspect ratio and fit to case
                const img = new Image();
                img.onload = () => {
                    customUploadedImageObj = img;
                    autoFitCaseArtwork();
                    applyCasePreviewImage(customUploadedImageSrc);
                    updateCaseBadge();
                };
                img.src = customUploadedImageSrc;
            };
            reader.readAsDataURL(file);
        }

        function setCaseFinish(finishKey) {
            if (finishKey === 'clear') setCaseType('liquid_clear', 49);
            else if (finishKey === 'magsafe') setCaseType('magsafe_armor', 59);
        }

        function setCaseType(typeKey, price) {
            currentCaseType = typeKey;
            currentCasePrice = price;

            ['case-mat-clear', 'case-mat-magsafe'].forEach(id => {
                document.getElementById(id)?.classList.remove('active');
            });

            if (typeKey === 'liquid_clear') {
                document.getElementById('case-mat-clear')?.classList.add('active');
                const toggle = document.getElementById('case-magsafe-toggle');
                if (toggle && toggle.checked) {
                    toggle.checked = false;
                    document.getElementById('case-magsafe-ring')?.classList.add('hidden');
                }
            } else if (typeKey === 'magsafe_armor') {
                document.getElementById('case-mat-magsafe')?.classList.add('active');
                const toggle = document.getElementById('case-magsafe-toggle');
                if (toggle && !toggle.checked) {
                    toggle.checked = true;
                    document.getElementById('case-magsafe-ring')?.classList.remove('hidden');
                }
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

        function updateCaseBadge() {
            const badge = document.getElementById('case-preview-badge');
            const modelSelect = document.getElementById('case-phone-model');
            if (!badge || !modelSelect) return;

            const modelName = modelSelect.options[modelSelect.selectedIndex]?.text || 'iPhone 18 Pro Max';
            const colorName = phoneColorThemes[currentPhoneColor]?.name || 'Burgundy';
            const shortDesign = {
                design_1: 'Pre-Design 01 (Great Wave)',
                design_2: 'Pre-Design 02 (Botanical)',
                design_3: 'Pre-Design 03 (Topography)',
                custom: 'Custom Print'
            }[currentCaseDesignMode] || 'Artistic Case';

            badge.textContent = `${modelName} · ${colorName} · ${shortDesign}`;
        }

        function drawAppleMagSafeCanvas(ctx, cx, cy, ro, ri, pillW, pillH, pillGap, scale) {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 10 * scale;
            ctx.shadowOffsetY = 3 * scale;

            // 1. Frosted white annular ring body
            const ringPath = new Path2D();
            ringPath.arc(cx, cy, ro, 0, Math.PI * 2, false);
            ringPath.arc(cx, cy, ri, Math.PI * 2, 0, true);
            ringPath.closePath();

            const polyGrad = ctx.createLinearGradient(cx - ro, cy - ro, cx + ro, cy + ro);
            polyGrad.addColorStop(0, '#ffffff');
            polyGrad.addColorStop(0.25, '#f8fafc');
            polyGrad.addColorStop(0.65, '#f1f5f9');
            polyGrad.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = polyGrad;
            ctx.fill(ringPath, 'evenodd');

            // 2. Metallic specular rims
            ctx.shadowColor = 'transparent';
            const rimGrad = ctx.createLinearGradient(cx, cy - ro, cx, cy + ro);
            rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
            rimGrad.addColorStop(0.4, 'rgba(241, 245, 249, 0.88)');
            rimGrad.addColorStop(0.75, 'rgba(203, 213, 225, 0.72)');
            rimGrad.addColorStop(1, 'rgba(148, 163, 184, 0.58)');
            ctx.strokeStyle = rimGrad;
            ctx.lineWidth = 1.4 * scale;
            ctx.beginPath();
            ctx.arc(cx, cy, ro, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, ri, 0, Math.PI * 2);
            ctx.stroke();

            // 3. The 36 Authentic Apple Neodymium Magnet Radial Segments
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
            ctx.lineWidth = 0.9 * scale;
            for (let i = 0; i < 36; i++) {
                const rad = (i * 10.0 * Math.PI) / 180.0;
                const x1 = cx + (ri + 1.0 * scale) * Math.cos(rad);
                const y1 = cy + (ri + 1.0 * scale) * Math.sin(rad);
                const x2 = cx + (ro - 1.0 * scale) * Math.cos(rad);
                const y2 = cy + (ro - 1.0 * scale) * Math.sin(rad);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            // Mid-channel track groove
            const rMid = ri + (ro - ri) * 0.5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 0.7 * scale;
            ctx.setLineDash([3 * scale, 5 * scale]);
            ctx.beginPath();
            ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 4. Vertical Alignment Magnet Pill
            const pillTop = cy + ro + pillGap;
            const pillLeft = cx - pillW * 0.5;
            const pillR = pillW * 0.5;

            const pillPath = new Path2D();
            if (ctx.roundRect) {
                pillPath.roundRect(pillLeft, pillTop, pillW, pillH, pillR);
            } else {
                pillPath.rect(pillLeft, pillTop, pillW, pillH);
            }

            ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
            ctx.shadowBlur = 6 * scale;
            ctx.shadowOffsetY = 2 * scale;
            ctx.fillStyle = polyGrad;
            ctx.fill(pillPath);
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = rimGrad;
            ctx.lineWidth = 1.3 * scale;
            ctx.stroke(pillPath);

            // Center alignment pin groove
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)';
            ctx.lineWidth = 1.0 * scale;
            ctx.beginPath();
            ctx.moveTo(cx, pillTop + 4 * scale);
            ctx.lineTo(cx, pillTop + pillH - 4 * scale);
            ctx.stroke();

            ctx.restore();
        }

        function downloadCaseMockup() {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');

            const baseImgEl = document.getElementById('case-phone-base-img');
            const artImgEl = document.getElementById('case-preview-img');
            const artSrc = currentCaseImageSrc || (artImgEl ? (artImgEl.getAttribute('href') || artImgEl.getAttribute('xlink:href') || artImgEl.src) : '');
            const phoneSrc = baseImgEl ? baseImgEl.src : '';

            const loadImagePromise = (url) => new Promise((resolve) => {
                if (!url) return resolve(null);
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = url;
            });

            Promise.all([loadImagePromise(phoneSrc), loadImagePromise(artSrc)]).then(([phoneImg, loadedArt]) => {
                ctx.clearRect(0, 0, 600, 1200);

                // Clip to 600x1200 rounded phone silhouette
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(0, 0, 600, 1200, 92);
                else ctx.rect(0, 0, 600, 1200);
                ctx.clip();

                // 1. Draw Real Apple Hardware Base Photo
                if (phoneImg) {
                    ctx.drawImage(phoneImg, 0, 0, 600, 1200);
                } else {
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, 600, 1200);
                }

                // 2. If in Fitted Case mode, draw cropped & positioned artwork with precision camera cutout
                if (currentMockupView !== 'phone' && loadedArt) {
                    const scaleFactor = 600 / 290;
                    const crop = getActiveCropGeometry();
                    const cutout = getCameraCutoutSpec(currentCasePhone);

                    const offCanvas = document.createElement('canvas');
                    offCanvas.width = 600;
                    offCanvas.height = 1200;
                    const offCtx = offCanvas.getContext('2d');

                    // Apply user's active Crop Geometry
                    offCtx.save();
                    offCtx.beginPath();
                    if (offCtx.roundRect) {
                        offCtx.roundRect(
                            crop.x * scaleFactor,
                            crop.y * scaleFactor,
                            crop.width * scaleFactor,
                            crop.height * scaleFactor,
                            crop.rx * scaleFactor
                        );
                    } else {
                        offCtx.rect(crop.x * scaleFactor, crop.y * scaleFactor, crop.width * scaleFactor, crop.height * scaleFactor);
                    }
                    offCtx.clip();

                    // Apply user's Pan (X/Y), Rotation, Flip, and Zoom
                    const effectiveZoom = getEffectiveArtworkZoom();
                    offCtx.translate(300 + currentCasePanX * scaleFactor, 600 + currentCasePanY * scaleFactor);
                    offCtx.rotate((currentCaseRotation * Math.PI) / 180);
                    offCtx.scale(effectiveZoom * currentCaseFlipH, effectiveZoom);

                    const artW = loadedArt.naturalWidth || loadedArt.width || 600;
                    const artH = loadedArt.naturalHeight || loadedArt.height || 1200;
                    const targetW = 600;
                    const targetH = 1200;
                    const artRatio = artW / artH;
                    const caseRatio = targetW / targetH;

                    let drawW, drawH, drawX, drawY;
                    if (artRatio > caseRatio) {
                        drawH = targetH;
                        drawW = targetH * artRatio;
                        drawX = -drawW / 2;
                        drawY = -targetH / 2;
                    } else {
                        drawW = targetW;
                        drawH = targetW / artRatio;
                        drawX = -targetW / 2;
                        drawY = -drawH / 2;
                    }
                    offCtx.drawImage(loadedArt, drawX, drawY, drawW, drawH);
                    offCtx.restore();

                    // Punch out the Precision Camera Cutout hole so the real iPhone camera bump shows through
                    const cutoutPath2D = new Path2D(buildCutoutSvgPath(cutout, scaleFactor));
                    offCtx.save();
                    offCtx.globalCompositeOperation = 'destination-out';
                    offCtx.fill(cutoutPath2D);
                    offCtx.restore();

                    ctx.drawImage(offCanvas, 0, 0);

                    // Draw raised protective camera cutout bezel
                    ctx.save();
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = 8.5;
                    ctx.strokeStyle = 'rgba(10, 15, 24, 0.94)';
                    ctx.stroke(cutoutPath2D);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
                    ctx.stroke(cutoutPath2D);
                    ctx.restore();
                }

                // Draw Authentic Official Apple MagSafe Magnet Array if MagSafe is enabled
                const isMagSafe = document.getElementById('case-magsafe-toggle')?.checked || currentCaseType === 'magsafe_armor';
                if (isMagSafe) {
                    const scaleFactor = 600 / 290;
                    drawAppleMagSafeCanvas(ctx, 300, 604, 146, 122, 19, 48, 12, scaleFactor);
                }

                // 3. Subtle optical glass sheen
                const grad = ctx.createLinearGradient(0, 0, 600, 1200);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
                grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
                grad.addColorStop(0.6, 'transparent');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 600, 1200);
                ctx.restore();

                const link = document.createElement('a');
                link.download = `Lee-Nguyen-Lab-Case-${currentCasePhone}-${currentPhoneColor}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }

        // =========================================================================
        // 8. Header Dynamic Scroll State
        // =========================================================================
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
                    showToast(`Selected service: ${name}`);
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
        window.autoFitCaseArtwork = autoFitCaseArtwork;

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
                magsafe_armor: 'MagSafe Armor Glass'
            };
            const caseImgMap = {
                liquid_clear: 'images/products/case_clear.jpg',
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

        function scrollAccessoryCarousel(direction) {
            const track = document.getElementById('accessory-carousel-track');
            if (!track) return;
            const visibleCard = track.querySelector('.accessory-carousel-card:not([style*="display: none"])');
            const cardWidth = visibleCard ? visibleCard.offsetWidth + 24 : 320;
            const scrollStep = window.innerWidth >= 1024 ? cardWidth * 2 : cardWidth;
            track.scrollBy({
                left: direction * scrollStep,
                behavior: 'smooth'
            });
        }

        function updateAccessoryCarouselState() {
            const track = document.getElementById('accessory-carousel-track');
            if (!track) return;

            const prevBtn = document.getElementById('acc-carousel-prev');
            const nextBtn = document.getElementById('acc-carousel-next');
            const sidePrevBtn = document.getElementById('acc-carousel-side-prev');
            const sideNextBtn = document.getElementById('acc-carousel-side-next');
            const counterRange = document.getElementById('acc-curr-range');
            const counterTotal = document.getElementById('acc-total-count');

            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            const isAtStart = track.scrollLeft <= 10;
            const isAtEnd = track.scrollLeft >= maxScroll - 10;

            if (prevBtn) prevBtn.disabled = isAtStart;
            if (nextBtn) nextBtn.disabled = isAtEnd;

            if (sidePrevBtn) {
                sidePrevBtn.style.opacity = isAtStart ? '0' : '1';
                sidePrevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
            }
            if (sideNextBtn) {
                sideNextBtn.style.opacity = isAtEnd ? '0' : '1';
                sideNextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
            }

            const visibleCards = Array.from(track.querySelectorAll('.accessory-carousel-card')).filter(c => c.style.display !== 'none');
            if (counterTotal) counterTotal.textContent = visibleCards.length;

            if (counterRange && visibleCards.length > 0) {
                const trackLeft = track.scrollLeft;
                const trackRight = trackLeft + track.clientWidth;
                let firstIndex = -1;
                let lastIndex = -1;

                visibleCards.forEach((c, idx) => {
                    const cardLeft = c.offsetLeft - track.offsetLeft;
                    const cardRight = cardLeft + c.offsetWidth;
                    if (cardRight > trackLeft + 15 && cardLeft < trackRight - 15) {
                        if (firstIndex === -1) firstIndex = idx + 1;
                        lastIndex = idx + 1;
                    }
                });

                if (firstIndex === -1) firstIndex = 1;
                if (lastIndex < firstIndex) lastIndex = firstIndex;
                counterRange.textContent = `${firstIndex}–${lastIndex}`;
            }
        }

        function initCarouselDrag() {
            const track = document.getElementById('accessory-carousel-track');
            if (!track) return;

            let isDown = false;
            let startX = 0;
            let scrollLeft = 0;
            let hasDragged = false;

            track.addEventListener('mousedown', (e) => {
                if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
                isDown = true;
                hasDragged = false;
                track.classList.add('cursor-grabbing');
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
            });

            window.addEventListener('mouseup', () => {
                if (!isDown) return;
                isDown = false;
                track.classList.remove('cursor-grabbing');
            });

            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 1.4;
                if (Math.abs(walk) > 6) {
                    hasDragged = true;
                }
                track.scrollLeft = scrollLeft - walk;
            });

            track.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    hasDragged = false;
                }
            }, true);

            let scrollTimeout;
            track.addEventListener('scroll', () => {
                updateAccessoryCarouselState();
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateAccessoryCarouselState, 150);
            }, { passive: true });

            window.addEventListener('resize', updateAccessoryCarouselState);
        }

        function filterAccessories(cat, btn) {
            document.querySelectorAll('.filter-pill-btn').forEach(b => {
                const bFilter = b.getAttribute('data-filter') || '';
                if (bFilter === cat) {
                    b.classList.add('active');
                } else if (!b.hasAttribute('data-filter') && b === btn) {
                    b.classList.add('active');
                } else if (bFilter !== cat) {
                    b.classList.remove('active');
                }
            });
            if (btn) btn.classList.add('active');

            const customCasesSec = document.getElementById('custom-cases');
            const carouselSec = document.getElementById('accessories-carousel-section');
            const isAccessoryCat = ['screen-protectors', 'lanyards', 'chargers-power', 'stickers'].includes(cat);

            if (customCasesSec) {
                if (cat === 'all' || cat === 'custom-cases') {
                    customCasesSec.style.display = 'block';
                } else {
                    customCasesSec.style.display = 'none';
                }
            }

            if (carouselSec) {
                if (cat === 'all' || isAccessoryCat) {
                    carouselSec.style.display = 'block';
                } else {
                    carouselSec.style.display = 'none';
                }
            }

            const cards = document.querySelectorAll('.product-ecommerce-card');
            cards.forEach(card => {
                const itemCat = card.getAttribute('data-category');
                if (cat === 'all' || itemCat === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            const track = document.getElementById('accessory-carousel-track');
            if (track) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            }
            setTimeout(updateAccessoryCarouselState, 100);
        }

        function searchAccessories(query) {
            const q = (query || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.product-ecommerce-card');
            let matchCountAccessory = 0;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isMatch = !q || text.includes(q);
                card.style.display = isMatch ? 'flex' : 'none';

                if (isMatch) {
                    matchCountAccessory++;
                }
            });

            const customCasesSec = document.getElementById('custom-cases');
            const carouselSec = document.getElementById('accessories-carousel-section');

            if (q) {
                const studioEl = document.getElementById('custom-studio-bench');
                const studioText = studioEl ? studioEl.textContent.toLowerCase() : '';
                const caseTerms = ['case', 'custom', 'artistic', 'iphone', 'print', 'magsafe', 'cover', 'clear'];
                const matchesCaseStudio = studioText.includes(q) || caseTerms.some(t => t.includes(q) || q.includes(t));
                if (customCasesSec) customCasesSec.style.display = matchesCaseStudio ? 'block' : 'none';
                if (carouselSec) carouselSec.style.display = matchCountAccessory > 0 ? 'block' : 'none';
            } else {
                if (customCasesSec) customCasesSec.style.display = 'block';
                if (carouselSec) carouselSec.style.display = 'block';
            }

            const track = document.getElementById('accessory-carousel-track');
            if (track) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            }
            setTimeout(updateAccessoryCarouselState, 100);
        }

        // Initialize cart & carousel on load
        window.addEventListener('DOMContentLoaded', () => {
            updateCartUI();
            initCarouselDrag();
            updateAccessoryCarouselState();

            const hash = (window.location.hash || '').replace('#', '');
            if (['screen-protectors', 'lanyards', 'chargers-power', 'stickers'].includes(hash)) {
                filterAccessories(hash);
                const sec = document.getElementById('accessories-carousel-section');
                if (sec) {
                    setTimeout(() => sec.scrollIntoView({ behavior: 'smooth' }), 300);
                }
            } else if (hash === 'custom-cases') {
                filterAccessories('custom-cases');
            }
        });

        window.addEventListener('hashchange', () => {
            const hash = (window.location.hash || '').replace('#', '');
            if (['screen-protectors', 'lanyards', 'chargers-power', 'stickers'].includes(hash)) {
                filterAccessories(hash);
            } else if (hash === 'custom-cases') {
                filterAccessories('custom-cases');
            }
        });


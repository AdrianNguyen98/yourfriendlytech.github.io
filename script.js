// =========================================================================
        // 1. Dynamic Floating Particle Network with Optical Glass Lens Refraction
        // Real-time background morphing and barrel distortion underneath glass buttons
        // =========================================================================
        (function() {
            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');

            let width = 0;
            let height = 0;
            let dpr = 1;
            let time = 0;
            let frameCounter = 0;

            // Interactive mouse position state
            const mouse = {
                x: null,
                y: null,
                radius: 140,       // Interactive repulsion radius in CSS pixels
                repelForce: 2.2     // Push intensity
            };

            // Cached bounding boxes of all liquid glass buttons on the screen
            let buttonRects = [];

            function updateButtonRects() {
                buttonRects = [];
                const buttons = document.querySelectorAll('.liquid-btn-primary, .liquid-btn-secondary, .liquid-btn-icon, .liquid-tier-btn');
                buttons.forEach(btn => {
                    const rect = btn.getBoundingClientRect();
                    // Include visible buttons in viewport
                    if (rect.bottom > -50 && rect.top < window.innerHeight + 50 && rect.right > -50 && rect.left < window.innerWidth + 50) {
                        buttonRects.push({
                            left: rect.left,
                            top: rect.top,
                            right: rect.right,
                            bottom: rect.bottom,
                            width: rect.width,
                            height: rect.height,
                            centerX: rect.left + rect.width / 2,
                            centerY: rect.top + rect.height / 2,
                            radiusX: rect.width / 2,
                            radiusY: rect.height / 2,
                            isHovered: btn.matches(':hover')
                        });
                    }
                });
            }

            // Real Optical Lens Refraction Formula:
            // Calculates warped coordinate (rx, ry) for particles viewed through curved glass
            function getGlassDistortion(px, py) {
                for (let i = 0; i < buttonRects.length; i++) {
                    const b = buttonRects[i];
                    if (px >= b.left - 6 && px <= b.right + 6 && py >= b.top - 6 && py <= b.bottom + 6) {
                        const nx = (px - b.centerX) / b.radiusX;
                        const ny = (py - b.centerY) / b.radiusY;
                        const rSq = nx * nx + ny * ny;

                        if (rSq <= 1.08) {
                            // Convex lens barrel distortion (Snell refraction magnification)
                            const lensPower = b.isHovered ? 0.38 : 0.22;
                            const barrelWarp = 1 + lensPower * (1 - Math.min(rSq, 1));
                            
                            // Dynamic fluid wave ripple when hovered or active
                            let waveX = 0;
                            let waveY = 0;
                            if (b.isHovered) {
                                const waveAngle = time * 4.8 + Math.sqrt(rSq) * 6.5;
                                waveX = Math.sin(waveAngle) * 3.8;
                                waveY = Math.cos(waveAngle) * 3.8;
                            }

                            const displacedX = b.centerX + (px - b.centerX) * barrelWarp + waveX;
                            const displacedY = b.centerY + (py - b.centerY) * barrelWarp + waveY;

                            return {
                                isUnderGlass: true,
                                x: displacedX,
                                y: displacedY,
                                magnification: barrelWarp,
                                isHovered: b.isHovered
                            };
                        }
                    }
                }
                return { isUnderGlass: false, x: px, y: py, magnification: 1, isHovered: false };
            }

            // Particle entity definition
            class Particle {
                constructor(w, h) {
                    this.reset(w, h, true);
                }

                reset(w, h, randomInit = false) {
                    this.x = randomInit ? Math.random() * w : (Math.random() > 0.5 ? 0 : w);
                    this.y = randomInit ? Math.random() * h : (Math.random() > 0.5 ? 0 : h);
                    
                    // Subtle ambient drift velocity
                    this.baseVx = (Math.random() - 0.5) * 0.55;
                    this.baseVy = (Math.random() - 0.5) * 0.55;
                    this.vx = this.baseVx;
                    this.vy = this.baseVy;

                    // Physical particle properties (Subtle Luminous Constellation on Deep Navy Canvas)
                    this.radius = Math.random() * 1.5 + 1.1; // 1.1px to 2.6px
                    const slateTones = [
                        'rgba(255, 255, 255, 0.75)',   // pure starlight
                        'rgba(186, 230, 253, 0.70)',   // luminous cyan
                        'rgba(147, 197, 253, 0.65)',   // celestial sky
                        'rgba(224, 242, 254, 0.80)'    // radiant ice white
                    ];
                    this.color = slateTones[Math.floor(Math.random() * slateTones.length)];
                }

                update(w, h) {
                    // Repel physics from mouse movement
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = this.x - mouse.x;
                        const dy = this.y - mouse.y;
                        const distSq = dx * dx + dy * dy;
                        const mouseRadiusSq = mouse.radius * mouse.radius;

                        if (distSq < mouseRadiusSq && distSq > 0.01) {
                            const dist = Math.sqrt(distSq);
                            const force = (1 - dist / mouse.radius) * mouse.repelForce;
                            const normalX = dx / dist;
                            const normalY = dy / dist;

                            this.vx += normalX * force * 0.45;
                            this.vy += normalY * force * 0.45;
                        }
                    }

                    // Velocity dampening back to ambient drift
                    this.vx = this.vx * 0.94 + this.baseVx * 0.06;
                    this.vy = this.vy * 0.94 + this.baseVy * 0.06;

                    // Position step
                    this.x += this.vx;
                    this.y += this.vy;

                    // Boundary bouncing
                    if (this.x < 0) {
                        this.x = 0;
                        this.vx *= -1;
                        this.baseVx *= -1;
                    } else if (this.x > w) {
                        this.x = w;
                        this.vx *= -1;
                        this.baseVx *= -1;
                    }

                    if (this.y < 0) {
                        this.y = 0;
                        this.vy *= -1;
                        this.baseVy *= -1;
                    } else if (this.y > h) {
                        this.y = h;
                        this.vy *= -1;
                        this.baseVy *= -1;
                    }
                }
            }

            let particles = [];

            function initCanvas() {
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                width = window.innerWidth;
                height = window.innerHeight;

                canvas.width = Math.floor(width * dpr);
                canvas.height = Math.floor(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                const area = width * height;
                const particleCount = Math.max(35, Math.min(85, Math.floor(area / 16000)));

                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle(width, height));
                }

                updateButtonRects();
            }

            // Mouse and touch interaction listeners
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }, { passive: true });

            window.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    mouse.x = e.touches[0].clientX;
                    mouse.y = e.touches[0].clientY;
                }
            }, { passive: true });

            window.addEventListener('touchend', () => {
                mouse.x = null;
                mouse.y = null;
            });

            window.addEventListener('scroll', updateButtonRects, { passive: true });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(initCanvas, 150);
            });

            // Dynamic mouse-coordinate specular reflection on buttons
            document.querySelectorAll('.liquid-btn-primary, .liquid-btn-secondary, .liquid-btn-icon, .liquid-tier-btn').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    btn.style.setProperty('--mouse-x', `${x}px`);
                    btn.style.setProperty('--mouse-y', `${y}px`);
                }, { passive: true });
                btn.addEventListener('mouseenter', () => {
                    updateButtonRects();
                });
                btn.addEventListener('mouseleave', () => {
                    updateButtonRects();
                });
            });

            // Main rendering loop with optical lens distortion
            function render() {
                ctx.clearRect(0, 0, width, height);
                time += 0.016;
                frameCounter++;

                // Throttled recalculation of button positions for dynamic responsive elements
                if (frameCounter % 45 === 0) {
                    updateButtonRects();
                }

                const count = particles.length;
                const maxLineDist = 125;
                const maxLineDistSq = maxLineDist * maxLineDist;

                // Step 1: Update physics and calculate optical distortion states
                const optPositions = [];
                for (let i = 0; i < count; i++) {
                    const p = particles[i];
                    p.update(width, height);
                    optPositions.push(getGlassDistortion(p.x, p.y));
                }

                // Step 2: Draw connecting lines between proximity neighbors with optical bend
                for (let i = 0; i < count; i++) {
                    const p1 = particles[i];
                    const opt1 = optPositions[i];

                    for (let j = i + 1; j < count; j++) {
                        const p2 = particles[j];
                        const opt2 = optPositions[j];

                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < maxLineDistSq) {
                            const dist = Math.sqrt(distSq);
                            let lineAlpha = (1 - dist / maxLineDist) * 0.22;

                            // When under glass, lines warp through curved glass refraction with enhanced contrast
                            if (opt1.isUnderGlass || opt2.isUnderGlass) {
                                lineAlpha = Math.min(lineAlpha * 2.2, 0.65);
                                ctx.beginPath();
                                ctx.moveTo(opt1.x, opt1.y);
                                ctx.lineTo(opt2.x, opt2.y);
                                ctx.strokeStyle = opt1.isHovered || opt2.isHovered 
                                    ? `rgba(255, 255, 255, ${lineAlpha * 1.2})` 
                                    : `rgba(186, 230, 253, ${lineAlpha * 0.9})`;
                                ctx.lineWidth = opt1.isHovered || opt2.isHovered ? 1.5 : 1.1;
                                ctx.stroke();
                            } else {
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha * 0.75})`;
                                ctx.lineWidth = 0.9;
                                ctx.stroke();
                            }
                        }
                    }

                    // Cursor tracer proximity lines (radiant celestial trace)
                    if (mouse.x !== null && mouse.y !== null) {
                        const mdx = p1.x - mouse.x;
                        const mdy = p1.y - mouse.y;
                        const mDistSq = mdx * mdx + mdy * mdy;
                        const mouseConnectDist = 140;

                        if (mDistSq < mouseConnectDist * mouseConnectDist) {
                            const mDist = Math.sqrt(mDistSq);
                            const mAlpha = (1 - mDist / mouseConnectDist) * 0.45;
                            ctx.beginPath();
                            ctx.moveTo(mouse.x, mouse.y);
                            ctx.lineTo(opt1.x, opt1.y);
                            ctx.strokeStyle = `rgba(224, 242, 254, ${mAlpha * 0.6})`;
                            ctx.lineWidth = 1.1;
                            ctx.stroke();
                        }
                    }

                    // Step 3: Render particle dots underneath glass (radiant celestial optics)
                    if (opt1.isUnderGlass) {
                        // Single magnified core particle viewed through curved glass
                        ctx.beginPath();
                        ctx.arc(opt1.x, opt1.y, p1.radius * opt1.magnification * 1.35, 0, Math.PI * 2);
                        ctx.fillStyle = opt1.isHovered ? '#ffffff' : p1.color;
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                        ctx.fillStyle = p1.color;
                        ctx.fill();
                    }
                }

                requestAnimationFrame(render);
            }

            initCanvas();
            render();
        })();

        // =========================================================================
        // 2. Scroll Reveal Intersection Observer
        // =========================================================================
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal-element').forEach(el => observer.observe(el));

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
        // 4. Comprehensive Device & Service Pricing Matrix
        // =========================================================================
        let currentPartGrade = 'premium'; 

        const gradeConfig = {
            aftermarket: { label: 'Aftermarket (Budget)', multiplier: 0.75, warranty: '3 Months Warranty' },
            premium: { label: 'Premium (OEM-Spec)', multiplier: 1.0, warranty: '6 Months Warranty' },
            genuine: { label: 'Genuine (Original Pack)', multiplier: 1.38, warranty: '12 Months Warranty' }
        };

        const phone13Services = [
            { id: 'screen', name: 'Screen Replacement', base: 69, factor: 34 },
            { id: 'battery', name: 'Battery', base: 59, factor: 12 },
            { id: 'back_glass', name: 'Back Glass Replacement', base: 79, factor: 16 },
            { id: 'charging', name: 'Charging Socket', base: 65, factor: 10 },
            { id: 'rear_camera', name: 'Rear Camera', base: 79, factor: 26 },
            { id: 'front_camera', name: 'Front Camera', base: 65, factor: 14 },
            { id: 'rear_lens', name: 'Rear Camera Lens', base: 45, factor: 6 },
            { id: 'ear_speaker', name: 'Ear Speaker/Ear Speaker Flex', base: 59, factor: 8 },
            { id: 'vibrator', name: 'Vibrator', base: 49, factor: 6 },
            { id: 'power_flex', name: 'Power Button Flex', base: 55, factor: 9 },
            { id: 'volume_flex', name: 'Mute and Volume Button Flex', base: 55, factor: 9 },
            { id: 'nfc', name: 'Wireless Charging Pad (NFC)', base: 59, factor: 10 },
            { id: 'sim_tray', name: 'Sim Tray', base: 20, factor: 2 }
        ];

        const catalog = {
            iphone: {
                name: 'Apple iPhone', baseLabor: 49, supportsGrades: true,
                models: [
                    { id: 'ip18pm', name: 'iPhone 18 Pro Max', tier: 9.6 },
                    { id: 'ip18p', name: 'iPhone 18 Pro', tier: 9.0 },
                    { id: 'ip18air', name: 'iPhone 18 Air', tier: 8.5 },
                    { id: 'ip18plus', name: 'iPhone 18 Plus', tier: 8.4 },
                    { id: 'ip18', name: 'iPhone 18', tier: 8.0 },
                    { id: 'ip17pm', name: 'iPhone 17 Pro Max', tier: 8.8 },
                    { id: 'ip17p', name: 'iPhone 17 Pro', tier: 8.2 },
                    { id: 'ip17air', name: 'iPhone 17 Air', tier: 7.6 },
                    { id: 'ip17plus', name: 'iPhone 17 Plus', tier: 7.6 },
                    { id: 'ip17', name: 'iPhone 17', tier: 7.2 },
                    { id: 'ip16pm', name: 'iPhone 16 Pro Max', tier: 7.6 },
                    { id: 'ip16p', name: 'iPhone 16 Pro', tier: 7.1 },
                    { id: 'ip16plus', name: 'iPhone 16 Plus', tier: 6.6 },
                    { id: 'ip16', name: 'iPhone 16', tier: 6.1 },
                    { id: 'ip16e', name: 'iPhone 16e', tier: 5.4 },
                    { id: 'ip15pm', name: 'iPhone 15 Pro Max', tier: 6.2 },
                    { id: 'ip15p', name: 'iPhone 15 Pro', tier: 5.8 },
                    { id: 'ip15plus', name: 'iPhone 15 Plus', tier: 5.2 },
                    { id: 'ip15', name: 'iPhone 15', tier: 4.8 },
                    { id: 'ip14pm', name: 'iPhone 14 Pro Max', tier: 5.0 },
                    { id: 'ip14p', name: 'iPhone 14 Pro', tier: 4.6 },
                    { id: 'ip14plus', name: 'iPhone 14 Plus', tier: 4.2 },
                    { id: 'ip14', name: 'iPhone 14', tier: 3.8 },
                    { id: 'ip13pm', name: 'iPhone 13 Pro Max', tier: 4.0 },
                    { id: 'ip13p', name: 'iPhone 13 Pro', tier: 3.6 },
                    { id: 'ip13', name: 'iPhone 13', tier: 3.2 },
                    { id: 'ip13mini', name: 'iPhone 13 mini', tier: 3.0 },
                    { id: 'ip12pm', name: 'iPhone 12 Pro Max', tier: 3.2 },
                    { id: 'ip12p', name: 'iPhone 12 Pro', tier: 2.9 },
                    { id: 'ip12', name: 'iPhone 12', tier: 2.6 },
                    { id: 'ip12mini', name: 'iPhone 12 mini', tier: 2.4 },
                    { id: 'ip11pm', name: 'iPhone 11 Pro Max', tier: 2.5 },
                    { id: 'ip11p', name: 'iPhone 11 Pro', tier: 2.2 },
                    { id: 'ip11', name: 'iPhone 11', tier: 1.8 },
                    { id: 'ipxsmax', name: 'iPhone XS Max', tier: 1.8 },
                    { id: 'ipxs', name: 'iPhone XS', tier: 1.6 },
                    { id: 'ipxr', name: 'iPhone XR', tier: 1.5 },
                    { id: 'ipx', name: 'iPhone X', tier: 1.5 },
                    { id: 'ipse3', name: 'iPhone SE (3rd Gen, 2022)', tier: 1.2 },
                    { id: 'ipse2', name: 'iPhone SE (2nd Gen, 2020)', tier: 1.0 },
                    { id: 'ip8plus', name: 'iPhone 8 Plus', tier: 1.1 },
                    { id: 'ip8', name: 'iPhone 8', tier: 1.0 }
                ],
                services: phone13Services
            },
            apple_ipad: {
                name: 'Apple iPad', baseLabor: 59, supportsGrades: true,
                models: [
                    { id: 'ipad_pro_13_m4', name: 'iPad Pro 13" (M4)', tier: 7.5 },
                    { id: 'ipad_pro_11_m4', name: 'iPad Pro 11" (M4)', tier: 7.0 },
                    { id: 'ipad_pro_12_9', name: 'iPad Pro 12.9" (5th/6th Gen)', tier: 6.0 },
                    { id: 'ipad_pro_11', name: 'iPad Pro 11" (3rd/4th Gen)', tier: 5.5 },
                    { id: 'ipad_air_13_m2', name: 'iPad Air 13" (M2)', tier: 5.0 },
                    { id: 'ipad_air_11_m2', name: 'iPad Air 11" (M2)', tier: 4.8 },
                    { id: 'ipad_air_5', name: 'iPad Air (5th Gen)', tier: 4.0 },
                    { id: 'ipad_10', name: 'iPad 10th Gen (10.9")', tier: 3.5 },
                    { id: 'ipad_9', name: 'iPad 9th Gen (10.2")', tier: 2.5 },
                    { id: 'ipad_mini_7', name: 'iPad mini 7 (A17 Pro)', tier: 4.5 },
                    { id: 'ipad_mini_6', name: 'iPad mini 6', tier: 4.2 }
                ],
                services: [
                    { id: 'ipad_screen', name: 'Screen / Glass Replacement', base: 110, factor: 35 },
                    { id: 'ipad_battery', name: 'Battery Replacement', base: 89, factor: 12 },
                    { id: 'ipad_charging', name: 'Charging Port Replacement', base: 79, factor: 10 },
                    { id: 'ipad_board', name: 'Logic Board Micro-soldering', base: 149, factor: 20 },
                    { id: 'ipad_housing', name: 'Chassis / Bent Housing Realignment', base: 69, factor: 10 }
                ]
            },
            apple_watch: {
                name: 'Apple Watch', baseLabor: 49, supportsGrades: true,
                models: [
                    { id: 'aw_u2', name: 'Apple Watch Ultra 2 (49mm)', tier: 5.5 },
                    { id: 'aw_u1', name: 'Apple Watch Ultra (49mm)', tier: 5.0 },
                    { id: 'aw_s10', name: 'Apple Watch Series 10 (46mm / 42mm)', tier: 4.8 },
                    { id: 'aw_s9', name: 'Apple Watch Series 9 (45mm / 41mm)', tier: 4.2 },
                    { id: 'aw_s8', name: 'Apple Watch Series 8 (45mm / 41mm)', tier: 3.8 },
                    { id: 'aw_s7', name: 'Apple Watch Series 7 (45mm / 41mm)', tier: 3.5 },
                    { id: 'aw_s6', name: 'Apple Watch Series 6 / SE 2', tier: 2.8 },
                    { id: 'aw_s5', name: 'Apple Watch Series 5 / SE 1', tier: 2.4 },
                    { id: 'aw_s4', name: 'Apple Watch Series 4', tier: 2.0 }
                ],
                services: [
                    { id: 'aw_screen', name: 'OLED Screen / Glass Digitizer', base: 129, factor: 24 },
                    { id: 'aw_battery', name: 'Battery Replacement', base: 69, factor: 8 },
                    { id: 'aw_sensor', name: 'Rear Glass & Heart Rate Sensor', base: 89, factor: 10 },
                    { id: 'aw_crown', name: 'Digital Crown / Haptic Vibrator', base: 79, factor: 8 }
                ]
            },
            apple_ipod: {
                name: 'Apple iPod', baseLabor: 39, supportsGrades: true,
                models: [
                    { id: 'ipod_touch_7', name: 'iPod touch (7th Gen)', tier: 1.5 },
                    { id: 'ipod_touch_6', name: 'iPod touch (6th Gen)', tier: 1.2 },
                    { id: 'ipod_touch_5', name: 'iPod touch (5th Gen)', tier: 1.0 },
                    { id: 'ipod_classic', name: 'iPod Classic (Flash Mod & Battery)', tier: 2.2 }
                ],
                services: [
                    { id: 'ipod_screen', name: 'Screen Replacement', base: 59, factor: 12 },
                    { id: 'ipod_battery', name: 'Battery Replacement', base: 49, factor: 8 },
                    { id: 'ipod_jack', name: 'Headphone Jack / Lightning Port', base: 45, factor: 6 },
                    { id: 'ipod_storage', name: 'SSD / SD Storage Upgrade (Classic)', base: 89, factor: 25 }
                ]
            },
            samsung_s: {
                name: 'Samsung S Series', baseLabor: 49, supportsGrades: true,
                models: [
                    { id: 's25u', name: 'Galaxy S25 Ultra', tier: 8.5 },
                    { id: 's25plus', name: 'Galaxy S25+', tier: 7.8 },
                    { id: 's25', name: 'Galaxy S25', tier: 7.2 },
                    { id: 's24u', name: 'Galaxy S24 Ultra', tier: 7.5 },
                    { id: 's24plus', name: 'Galaxy S24+', tier: 6.8 },
                    { id: 's24', name: 'Galaxy S24', tier: 6.2 },
                    { id: 's24fe', name: 'Galaxy S24 FE', tier: 5.6 },
                    { id: 's23u', name: 'Galaxy S23 Ultra', tier: 6.0 },
                    { id: 's23plus', name: 'Galaxy S23+', tier: 5.4 },
                    { id: 's23', name: 'Galaxy S23', tier: 4.9 },
                    { id: 's23fe', name: 'Galaxy S23 FE', tier: 4.4 },
                    { id: 's22u', name: 'Galaxy S22 Ultra', tier: 4.8 },
                    { id: 's22plus', name: 'Galaxy S22+', tier: 4.2 },
                    { id: 's22', name: 'Galaxy S22', tier: 3.8 },
                    { id: 's21u', name: 'Galaxy S21 Ultra', tier: 3.6 },
                    { id: 's21plus', name: 'Galaxy S21+', tier: 3.1 },
                    { id: 's21', name: 'Galaxy S21', tier: 2.8 },
                    { id: 's21fe', name: 'Galaxy S21 FE', tier: 2.6 },
                    { id: 's20u', name: 'Galaxy S20 Ultra', tier: 2.6 },
                    { id: 's20plus', name: 'Galaxy S20+', tier: 2.3 },
                    { id: 's20', name: 'Galaxy S20', tier: 2.0 },
                    { id: 's20fe', name: 'Galaxy S20 FE', tier: 1.9 }
                ],
                services: phone13Services
            },
            samsung_z: {
                name: 'Samsung Z Series', baseLabor: 69, supportsGrades: true,
                models: [
                    { id: 'z_fold_6', name: 'Galaxy Z Fold 6', tier: 9.0 },
                    { id: 'z_flip_6', name: 'Galaxy Z Flip 6', tier: 7.5 },
                    { id: 'z_fold_5', name: 'Galaxy Z Fold 5', tier: 7.8 },
                    { id: 'z_flip_5', name: 'Galaxy Z Flip 5', tier: 6.5 },
                    { id: 'z_fold_4', name: 'Galaxy Z Fold 4', tier: 6.5 },
                    { id: 'z_flip_4', name: 'Galaxy Z Flip 4', tier: 5.5 },
                    { id: 'z_fold_3', name: 'Galaxy Z Fold 3', tier: 5.0 },
                    { id: 'z_flip_3', name: 'Galaxy Z Flip 3', tier: 4.5 }
                ],
                services: [
                    { id: 'z_inner_screen', name: 'Inner Folding OLED Screen', base: 349, factor: 30 },
                    { id: 'z_outer_screen', name: 'Outer Cover Display', base: 149, factor: 20 },
                    { id: 'z_hinge', name: 'Hinge Mechanism Cleaning / Realignment', base: 119, factor: 15 },
                    { id: 'z_battery', name: 'Dual Battery Replacement', base: 99, factor: 10 },
                    { id: 'z_back', name: 'Rear Glass Panel', base: 79, factor: 10 },
                    { id: 'z_charging', name: 'Charging Socket Flex', base: 79, factor: 8 }
                ]
            },
            samsung_note: {
                name: 'Samsung Note Series', baseLabor: 49, supportsGrades: true,
                models: [
                    { id: 'note_20u', name: 'Galaxy Note 20 Ultra 5G', tier: 4.8 },
                    { id: 'note_20', name: 'Galaxy Note 20', tier: 3.8 },
                    { id: 'note_10p', name: 'Galaxy Note 10+', tier: 3.0 },
                    { id: 'note_10', name: 'Galaxy Note 10', tier: 2.6 },
                    { id: 'note_9', name: 'Galaxy Note 9', tier: 2.0 },
                    { id: 'note_8', name: 'Galaxy Note 8', tier: 1.8 }
                ],
                services: phone13Services
            },
            samsung_a: {
                name: 'Samsung A Series', baseLabor: 45, supportsGrades: true,
                models: [
                    { id: 'a55', name: 'Galaxy A55 5G', tier: 3.2 },
                    { id: 'a54', name: 'Galaxy A54 5G', tier: 2.8 },
                    { id: 'a53', name: 'Galaxy A53 5G', tier: 2.4 },
                    { id: 'a52s', name: 'Galaxy A52s / A52', tier: 2.0 },
                    { id: 'a35', name: 'Galaxy A35 5G', tier: 2.5 },
                    { id: 'a34', name: 'Galaxy A34 5G', tier: 2.2 },
                    { id: 'a25', name: 'Galaxy A25 5G', tier: 2.0 },
                    { id: 'a15', name: 'Galaxy A15 5G', tier: 1.7 },
                    { id: 'a14', name: 'Galaxy A14', tier: 1.5 }
                ],
                services: phone13Services
            },
            samsung_tab_s: {
                name: 'Samsung Tab S Series', baseLabor: 59, supportsGrades: true,
                models: [
                    { id: 'tab_s10u', name: 'Galaxy Tab S10 Ultra / S10+', tier: 7.2 },
                    { id: 'tab_s9u', name: 'Galaxy Tab S9 Ultra / S9+', tier: 6.2 },
                    { id: 'tab_s9', name: 'Galaxy Tab S9 (11")', tier: 5.0 },
                    { id: 'tab_s8u', name: 'Galaxy Tab S8 Ultra / S8+', tier: 4.8 },
                    { id: 'tab_s8', name: 'Galaxy Tab S8 (11")', tier: 4.0 },
                    { id: 'tab_s7', name: 'Galaxy Tab S7 / S7+', tier: 3.2 }
                ],
                services: [
                    { id: 'tab_screen', name: 'Super AMOLED Display Assembly', base: 169, factor: 30 },
                    { id: 'tab_battery', name: 'High-Capacity Battery', base: 89, factor: 10 },
                    { id: 'tab_charging', name: 'Type-C Charging Daughterboard', base: 69, factor: 8 },
                    { id: 'tab_board', name: 'Motherboard IC Repair', base: 149, factor: 15 }
                ]
            },
            samsung_tab_a: {
                name: 'Samsung Tab A Series', baseLabor: 45, supportsGrades: true,
                models: [
                    { id: 'tab_a9p', name: 'Galaxy Tab A9+ (11")', tier: 2.2 },
                    { id: 'tab_a9', name: 'Galaxy Tab A9 (8.7")', tier: 1.8 },
                    { id: 'tab_a8', name: 'Galaxy Tab A8 10.5 (2022)', tier: 1.7 },
                    { id: 'tab_a7', name: 'Galaxy Tab A7 10.4', tier: 1.5 }
                ],
                services: [
                    { id: 'tab_a_screen', name: 'LCD Screen & Touch Glass', base: 89, factor: 18 },
                    { id: 'tab_a_battery', name: 'Battery Replacement', base: 59, factor: 8 },
                    { id: 'tab_a_charging', name: 'Charging Port Replacement', base: 55, factor: 6 }
                ]
            },
            google_pixel: {
                name: 'Google Pixel', baseLabor: 49, supportsGrades: true,
                models: [
                    { id: 'pix_9p_fold', name: 'Google Pixel 9 Pro Fold', tier: 8.5 },
                    { id: 'pix_9pxl', name: 'Google Pixel 9 Pro XL', tier: 7.4 },
                    { id: 'pix_9p', name: 'Google Pixel 9 Pro', tier: 7.0 },
                    { id: 'pix_9', name: 'Google Pixel 9', tier: 6.2 },
                    { id: 'pix_8p', name: 'Google Pixel 8 Pro', tier: 5.5 },
                    { id: 'pix_8', name: 'Google Pixel 8', tier: 4.8 },
                    { id: 'pix_8a', name: 'Google Pixel 8a', tier: 4.2 },
                    { id: 'pix_7p', name: 'Google Pixel 7 Pro', tier: 4.0 },
                    { id: 'pix_7', name: 'Google Pixel 7', tier: 3.4 },
                    { id: 'pix_7a', name: 'Google Pixel 7a', tier: 3.0 },
                    { id: 'pix_6p', name: 'Google Pixel 6 Pro', tier: 2.8 },
                    { id: 'pix_6', name: 'Google Pixel 6', tier: 2.4 },
                    { id: 'pix_6a', name: 'Google Pixel 6a', tier: 2.1 }
                ],
                services: phone13Services
            },
            oppo: {
                name: 'OPPO', baseLabor: 45, supportsGrades: true,
                models: [
                    { id: 'oppo_fx7', name: 'OPPO Find X7 / X6 Pro', tier: 6.0 }, { id: 'oppo_fx5', name: 'OPPO Find X5 Pro / X5', tier: 4.2 },
                    { id: 'oppo_reno11', name: 'OPPO Reno 11 / 10 Pro', tier: 3.5 }, { id: 'oppo_a98', name: 'OPPO A98 / A78 / A58', tier: 2.0 }
                ],
                services: phone13Services
            },
            microsoft_surface: {
                name: 'Microsoft Surface', baseLabor: 69, supportsGrades: false,
                models: [
                    { id: 'surf_pro_9', name: 'Surface Pro 9 / 10', tier: 5.5 }, { id: 'surf_pro_8', name: 'Surface Pro 8 / Pro X', tier: 4.8 },
                    { id: 'surf_pro_7', name: 'Surface Pro 7 / 7+', tier: 3.8 }, { id: 'surf_lap_5', name: 'Surface Laptop 4 / 5', tier: 4.5 }
                ],
                services: [
                    { id: 'surf_screen', name: 'PixelSense Display Assembly', base: 220, factor: 32 },
                    { id: 'surf_battery', name: 'Internal Battery Replacement', base: 129, factor: 15 },
                    { id: 'surf_charging', name: 'Surface Connect / USB-C Port', base: 99, factor: 10 },
                    { id: 'surf_board', name: 'Board Level Micro-soldering', base: 180, factor: 20 }
                ]
            },
            nintendo_switch: {
                name: 'Nintendo Switch', baseLabor: 45, supportsGrades: false,
                models: [
                    { id: 'sw_oled', name: 'Nintendo Switch OLED', tier: 2.5 }, { id: 'sw_v2', name: 'Nintendo Switch (V1 / V2)', tier: 1.8 },
                    { id: 'sw_lite', name: 'Nintendo Switch Lite', tier: 1.4 }
                ],
                services: [
                    { id: 'sw_screen', name: 'Screen Digitizer / OLED Panel', base: 79, factor: 18 },
                    { id: 'sw_port', name: 'USB-C Charging Port Replacement', base: 69, factor: 10 },
                    { id: 'sw_m92t36', name: 'M92T36 Power IC Micro-soldering', base: 89, factor: 12 },
                    { id: 'sw_drift', name: 'Joy-Con Stick Drift Repair (Hall Effect)', base: 35, factor: 5 },
                    { id: 'sw_card', name: 'Game Card Reader / Headphone Jack', base: 55, factor: 8 },
                    { id: 'sw_battery', name: 'Battery Replacement', base: 49, factor: 8 }
                ]
            },
            macbook: {
                name: 'MacBook & Laptops', baseLabor: 89, supportsGrades: false,
                models: [
                    { id: 'mac_m3', name: 'MacBook Pro 14" / 16" (M-Series)', tier: 5.5 },
                    { id: 'mac_air_m2', name: 'MacBook Air (M1 / M2 / M3)', tier: 4.0 },
                    { id: 'mac_intel', name: 'MacBook Pro (Intel Models)', tier: 3.2 }
                ],
                services: [
                    { id: 'mb_screen', name: 'Retina Display Assembly', base: 320, factor: 45 },
                    { id: 'mb_battery', name: 'Battery & Top Case Service', base: 160, factor: 20 },
                    { id: 'mb_logic', name: 'Logic Board Micro-soldering', base: 220, factor: 25 },
                    { id: 'mb_liquid', name: 'Ultrasonic Liquid Damage Clean', base: 150, factor: 15 }
                ]
            },
            ps5: {
                name: 'PlayStation 5', baseLabor: 59, supportsGrades: false,
                models: [
                    { id: 'ps5_slim', name: 'PlayStation 5 Slim', tier: 2.2 },
                    { id: 'ps5_orig', name: 'PlayStation 5 (Original)', tier: 1.8 }
                ],
                services: [
                    { id: 'ps5_hdmi', name: 'HDMI 2.1 Port Replacement', base: 89, factor: 15 },
                    { id: 'ps5_liquid_metal', name: 'APU Liquid Metal Repaste & Clean', base: 69, factor: 10 },
                    { id: 'ps5_psu', name: 'Internal Power Supply Repair', base: 119, factor: 15 },
                    { id: 'ps5_drive', name: 'Optical Disc Drive Laser Repair', base: 85, factor: 12 }
                ]
            }
        };

        // =========================================================================
        // 5. Quote Calculator UI Synchronization
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
                label.className = 'flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] transition-all cursor-pointer border border-white/10 shadow-sm select-none';
                label.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" value="${svc.id}" ${index === 0 ? 'checked' : ''} onchange="calculateQuote()" class="w-4 h-4 rounded text-appleBlue cursor-pointer liquid-checkbox">
                        <span class="text-sm font-bold text-white">${svc.name}</span>
                    </div>
                    <span id="price-tag-${svc.id}" class="text-xs font-bold text-sky-400 apple-price"></span>
                `;
                container.appendChild(label);
            });
        }

        function calculateQuote() {
            const familyKey = document.getElementById('device-family').value;
            const currentCat = catalog[familyKey];
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
                document.getElementById('receipt-warranty').textContent = '6 Months Warranty';
            }

            const checkboxes = document.querySelectorAll('#services-checklist input[type="checkbox"]:checked');
            const receiptItems = document.getElementById('receipt-items');
            receiptItems.innerHTML = '';

            let partsTotal = 0;
            const baseLabor = currentCat.baseLabor;
            let timeEstimate = "30–45 mins";

            if (checkboxes.length === 0) {
                receiptItems.innerHTML = '<p class="text-[#86868b] text-xs text-center py-8">Select one or more services to generate your estimate.</p>';
                document.getElementById('receipt-parts').textContent = 'A$0.00';
                document.getElementById('receipt-labor').textContent = 'A$0.00';
                animatePriceCounter('receipt-total', 0, 'A$');
                return;
            }

            const multiplier = currentCat.supportsGrades ? gradeInfo.multiplier : 1.0;

            checkboxes.forEach(cb => {
                const svc = currentCat.services.find(s => s.id === cb.value);
                if (svc) {
                    let rawPrice = (svc.base + (selectedModel.tier * svc.factor)) * multiplier;
                    let itemPrice = Math.round(rawPrice);
                    
                    if (svc.id !== 'sim_tray' && svc.id !== 'sw_drift') {
                        itemPrice = Math.ceil(itemPrice / 10) * 10 - 1; // Apple-style .99/.00 ending
                    }

                    partsTotal += itemPrice;

                    const tag = document.getElementById(`price-tag-${svc.id}`);
                    if (tag) tag.textContent = `A$${itemPrice}`;

                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center text-xs text-[#94a3b8] animate-in fade-in duration-200';
                    row.innerHTML = `<span>${svc.name}</span><span class="apple-price font-bold text-white">A$${itemPrice}.00</span>`;
                    receiptItems.appendChild(row);
                }
            });

            if (checkboxes.length > 2) timeEstimate = "1–2 Hours";
            else if (Array.from(checkboxes).some(c => c.value.includes('back') || c.value.includes('hinge'))) timeEstimate = "1–2 Hours";
            else if (Array.from(checkboxes).every(c => c.value.includes('battery'))) timeEstimate = "20–30 mins";
            else if (familyKey === 'macbook' || familyKey === 'microsoft_surface') timeEstimate = "1–2 Days";

            const grandTotal = partsTotal + baseLabor;
            document.getElementById('receipt-parts').textContent = `A$${partsTotal.toFixed(2)}`;
            document.getElementById('receipt-labor').textContent = `A$${baseLabor.toFixed(2)}`;
            animatePriceCounter('receipt-total', grandTotal, 'A$');
            
            const totalEl = document.getElementById('receipt-total');
            if (totalEl) {
                totalEl.classList.remove('price-pulse');
                void totalEl.offsetWidth;
                totalEl.classList.add('price-pulse');
            }
            document.getElementById('receipt-time').textContent = timeEstimate;
        }

        // Animated Rolling Price Counter (Apple A$ Standard)
        function animatePriceCounter(elementId, targetValue, prefix = 'A$', suffix = '') {
            const el = document.getElementById(elementId);
            if (!el) return;
            const currentNum = parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0;
            if (Math.abs(currentNum - targetValue) < 0.01) {
                el.textContent = `${prefix}${targetValue.toFixed(2)}${suffix}`;
                return;
            }

            const startTime = performance.now();
            const duration = 360;

            function updateCounter(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Apple smooth ease-out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const currentVal = currentNum + (targetValue - currentNum) * ease;
                el.textContent = `${prefix}${currentVal.toFixed(2)}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = `${prefix}${targetValue.toFixed(2)}${suffix}`;
                }
            }
            requestAnimationFrame(updateCounter);
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
        }

        function closeBookingModal() {
            document.getElementById('booking-modal').classList.add('hidden');
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
                ? `${gradePart}${selectedServices.join(', ')} — Est. ${document.getElementById('receipt-total').textContent}`
                : 'General Diagnostic / Inspection';

            openBookingModal(modelName, summary);
        }

        
        // =========================================================================
        // 7. Custom Phone Case Studio & Live Mockup Engine
        // =========================================================================
        let currentCasePhone = 'iphone_18_pm';
        let currentCaseType = 'liquid_clear';
        let currentCasePrice = 49;
        let currentCaseZoom = 1.0;
        let currentCaseImageSrc = '';

        // Curated Monochrome & Spatial Apple Aesthetic Presets
        const casePresets = {
            burgundy: 'images/iphone-18-pro-burgundy.jpg',
            spatial: 'images/iphone-18-series.png',
            marble: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231a1e29"/><stop offset="50%" stop-color="%230c0f17"/><stop offset="100%" stop-color="%23030407"/></linearGradient></defs><rect width="600" height="1200" fill="url(%23bg)"/><path d="M50,0 Q180,300 120,600 T300,1200" stroke="%23ffffff" stroke-opacity="0.35" stroke-width="2.5" fill="none"/><path d="M400,0 Q280,450 450,800 T200,1200" stroke="%23ffffff" stroke-opacity="0.22" stroke-width="1.8" fill="none"/><path d="M0,400 Q300,500 600,350" stroke="%23ffffff" stroke-opacity="0.2" stroke-width="2" fill="none"/><circle cx="300" cy="650" r="140" fill="none" stroke="%23ffffff" stroke-opacity="0.08" stroke-width="40"/></svg>',
            obsidian: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200"><rect width="600" height="1200" fill="%2305070a"/><path d="M-100,200 C150,100 250,400 700,250" stroke="%23ffffff" stroke-opacity="0.4" stroke-width="3" fill="none"/><path d="M-100,280 C150,180 250,480 700,330" stroke="%23ffffff" stroke-opacity="0.3" stroke-width="2.5" fill="none"/><path d="M-100,360 C150,260 250,560 700,410" stroke="%23ffffff" stroke-opacity="0.2" stroke-width="2" fill="none"/><path d="M-100,440 C150,340 250,640 700,490" stroke="%23ffffff" stroke-opacity="0.15" stroke-width="1.5" fill="none"/><path d="M-100,520 C150,420 250,720 700,570" stroke="%23ffffff" stroke-opacity="0.1" stroke-width="1" fill="none"/></svg>',
            blueprint: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1200" viewBox="0 0 600 1200"><rect width="600" height="1200" fill="%23080b12"/><g stroke="%23ffffff" stroke-opacity="0.18" stroke-width="1.2" fill="none"><rect x="120" y="300" width="360" height="420" rx="24"/><rect x="180" y="360" width="240" height="300" rx="16"/><circle cx="300" cy="510" r="60"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="720" x2="600" y2="720"/><line x1="300" y1="0" x2="300" y2="1200"/></g><text x="300" y="515" fill="%23ffffff" fill-opacity="0.5" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="4">LEE NGUYEN LAB</text></svg>'
        };

        function initCaseStudio() {
            const modelSelect = document.getElementById('case-phone-model');
            const fileInput = document.getElementById('case-file-input');
            const dropzone = document.getElementById('case-dropzone');
            const zoomRange = document.getElementById('case-zoom-range');
            const zoomVal = document.getElementById('case-zoom-val');
            const magSafeToggle = document.getElementById('case-magsafe-toggle');
            const previewImg = document.getElementById('case-preview-img');

            if (!modelSelect || !previewImg) return;

            loadSampleCaseArt('marble');
            if (modelSelect) {
                updateCaseCameraBump(modelSelect.value);
                updateCaseBadge();
            }

            modelSelect.addEventListener('change', (e) => {
                currentCasePhone = e.target.value;
                updateCaseCameraBump(currentCasePhone);
                updateCaseBadge();
            });

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handleUploadedCaseImage(file);
                }
            });

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

        function handleUploadedCaseImage(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentCaseImageSrc = event.target.result;
                const previewImg = document.getElementById('case-preview-img');
                if (previewImg) {
                    previewImg.style.transition = 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
                    previewImg.style.opacity = '0.35';
                    previewImg.style.transform = `scale(${currentCaseZoom * 0.95})`;
                    setTimeout(() => {
                        previewImg.src = currentCaseImageSrc;
                        previewImg.style.opacity = '1';
                        previewImg.style.transform = `scale(${currentCaseZoom})`;
                    }, 120);
                }
            };
            reader.readAsDataURL(file);
        }

        function loadSampleCaseArt(presetKey) {
            const preset = casePresets[presetKey] || casePresets.marble;
            currentCaseImageSrc = preset;
            const previewImg = document.getElementById('case-preview-img');
            if (previewImg) {
                previewImg.style.transition = 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
                previewImg.style.opacity = '0.35';
                previewImg.style.transform = `scale(${currentCaseZoom * 0.95})`;
                setTimeout(() => {
                    previewImg.src = preset;
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = `scale(${currentCaseZoom})`;
                }, 120);
            }
        }

        function setCaseType(typeKey, price) {
            currentCaseType = typeKey;
            currentCasePrice = price;

            document.querySelectorAll('.case-type-btn').forEach(btn => btn.classList.remove('active'));
            if (typeKey === 'liquid_clear') document.getElementById('case-type-clear')?.classList.add('active');
            else if (typeKey === 'matte_frosted') document.getElementById('case-type-matte')?.classList.add('active');
            else if (typeKey === 'magsafe_armor') {
                document.getElementById('case-type-magsafe')?.classList.add('active');
                const toggle = document.getElementById('case-magsafe-toggle');
                if (toggle && !toggle.checked) {
                    toggle.checked = true;
                    document.getElementById('case-magsafe-ring')?.classList.remove('hidden');
                }
            }

            animatePriceCounter('case-total-price', price, 'A$', '');
            const priceEl = document.getElementById('case-total-price');
            if (priceEl) {
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
            } else if (modelValue === 'iphone_18_air' || modelValue === 'iphone_17_air') {
                // iPhone 18 & 17 Air: Ultra-slim Horizontal Capsule Island
                activeBump = bumps.air;
            } else if (['iphone_18', 'iphone_18_plus', 'iphone_17', 'iphone_17_plus', 'iphone_16', 'iphone_16_plus', 'iphone_16e'].includes(modelValue)) {
                // iPhone 16 / 17 / 18 Standard & Plus: Vertical Spatial Video Pill
                activeBump = bumps.pill;
            } else if (['iphone_16_pm', 'iphone_16_p', 'iphone_15_pm', 'iphone_15_p', 'iphone_14_pm', 'iphone_14_p', 'iphone_13_pm', 'iphone_13_p', 'iphone_12_pm', 'iphone_12_p', 'iphone_11_pm'].includes(modelValue)) {
                // Classic Rounded-Square Triple Lens Pro Island
                activeBump = bumps.proClassic;
            } else if (['iphone_15', 'iphone_15_plus', 'iphone_14', 'iphone_14_plus', 'iphone_13', 'iphone_13_mini'].includes(modelValue)) {
                // Classic Diagonal Dual Lens
                activeBump = bumps.diagonal;
            } else if (['iphone_12', 'iphone_11'].includes(modelValue)) {
                // Classic Vertical Dual Lens Square
                activeBump = bumps.dualVert;
            }

            if (activeBump) {
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
            const typeNames = {
                liquid_clear: 'Liquid Clear Glass',
                matte_frosted: 'Frosted Matte Glass',
                magsafe_armor: 'MagSafe Armor Glass'
            };
            badge.textContent = modelName + ' · ' + (typeNames[currentCaseType] || 'Custom Glass Case');
        }

        function orderCustomCase() {
            const modelSelect = document.getElementById('case-phone-model');
            const modelName = modelSelect?.options[modelSelect.selectedIndex]?.text || 'Custom Device';
            const typeNames = {
                liquid_clear: 'Liquid Clear Optical Glass Case',
                matte_frosted: 'Frosted Matte White Glass Case',
                magsafe_armor: 'MagSafe Optical Armor Glass Case'
            };
            const caseTitle = typeNames[currentCaseType] || 'Custom Glass Case';
            const summary = 'Custom Case UV Print [' + caseTitle + '] — A$' + currentCasePrice + '.00 (Photo Configured)';

            openBookingModal(modelName, summary);
        }

        function downloadCaseMockup() {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#05070a';
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

                    const scale = currentCaseZoom || 1;
                    const dw = 500 * scale;
                    const dh = 1100 * scale;
                    const dx = 50 + (500 - dw) / 2;
                    const dy = 50 + (1100 - dh) / 2;
                    ctx.drawImage(tempImg, dx, dy, dw, dh);

                    const grad = ctx.createLinearGradient(50, 50, 550, 1150);
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
                    grad.addColorStop(0.6, 'transparent');
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(50, 50, 500, 1100);

                    ctx.restore();

                    ctx.lineWidth = 10;
                    ctx.strokeStyle = '#232a3b';
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(50, 50, 500, 1100, 70);
                    else ctx.rect(50, 50, 500, 1100);
                    ctx.stroke();

                    const link = document.createElement('a');
                    link.download = 'Lee-Nguyen-Lab-Case-Mockup.png';
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

        // Header dynamic scroll state & adaptive hero transition
        function updateHeaderState() {
            const header = document.querySelector('.apple-header-bar');
            const hero = document.getElementById('hero');
            if (header) {
                if (window.scrollY > 15) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Check if user has scrolled past the black Keynote Overview hero onto the white lab sections
                if (hero) {
                    const heroRect = hero.getBoundingClientRect();
                    if (heroRect.bottom <= 70) {
                        header.classList.add('on-white-section');
                    } else {
                        header.classList.remove('on-white-section');
                    }
                }
            }
        }

        window.addEventListener('scroll', updateHeaderState, { passive: true });

        window.addEventListener('DOMContentLoaded', () => {
            onFamilyChange();
            initCaseStudio();
            init3DTiltCards();
            initMockup3DTilt();
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
            const typeNames = {
                liquid_clear: 'Liquid Clear Optical Glass Case',
                matte_frosted: 'Frosted Matte Glass Case',
                magsafe_armor: 'MagSafe Armor Glass Case'
            };
            const caseImgMap = {
                liquid_clear: 'images/products/case_clear.jpg',
                matte_frosted: 'images/products/case_matte.jpg',
                magsafe_armor: 'images/products/case_magsafe.jpg'
            };
            const title = 'Custom Laser UV Glass Case';
            const variant = modelName + ' · ' + (typeNames[currentCaseType] || 'Custom Glass');
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
            }
        }

        function closeCartDrawer() {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-backdrop');
            if (drawer && backdrop) {
                backdrop.classList.remove('active');
                drawer.classList.remove('active');
                document.body.style.overflow = '';
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
                    <div class="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all">
                        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0 bg-slate-900">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-xs sm:text-sm text-white truncate">${item.title}</h4>
                            <p class="text-[11px] text-[#94a3b8] truncate">${item.variant}</p>
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
            toast.innerHTML = `<span>✨</span><span>${message}</span>`;
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


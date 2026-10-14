/**
 * Lee Nguyen Lab — Quote Calculation & Email Dispatch Server
 * Hosted on cPanel at leenguyenlab.com.au
 *
 * All repair service pricing is stored and calculated exclusively on this
 * backend server so prices are never displayed or exposed on the public website.
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer(); // Parses multipart/form-data fields (upload.none())

// Enable CORS for leenguyenlab.com.au (and local testing)
app.use(cors({
    origin: [
        'https://leenguyenlab.com.au',
        'https://www.leenguyenlab.com.au',
        'http://localhost:3000',
        'http://127.0.0.1:5500'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Built-in body parsers for JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// 1. MASTER PRICING CATALOG & PRICE_MAP DICTIONARY (Backend-Only)
// ============================================================================

const GRADE_CONFIG = {
    aftermarket: {
        label: 'Aftermarket (Budget)',
        multiplier: 0.75,
        warranty: '3 Months Warranty'
    },
    premium: {
        label: 'Premium (OEM-Spec)',
        multiplier: 1.0,
        warranty: '3 Months Warranty'
    },
    genuine: {
        label: 'Genuine (Original Pack)',
        multiplier: 1.38,
        warranty: '3 Months Warranty'
    },
    standard: {
        label: 'Standard Lab Grade',
        multiplier: 1.0,
        warranty: '3 Months Warranty'
    }
};

const PHONE_13_SERVICES = [
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

const CATALOG = {
    iphone: {
        name: 'Apple iPhone', baseLabor: 49, supportsGrades: true,
        models: [
            { id: 'ip18pm', name: 'iPhone 18 Pro Max', tier: 9.6 },
            { id: 'ip18p', name: 'iPhone 18 Pro', tier: 9.0 },
            { id: 'ip17pm', name: 'iPhone 17 Pro Max', tier: 8.8 },
            { id: 'ip17p', name: 'iPhone 17 Pro', tier: 8.2 },
            { id: 'ip17air', name: 'iPhone Air (17 Air)', tier: 7.6 },
            { id: 'ip17', name: 'iPhone 17', tier: 7.2 },
            { id: 'ip17e', name: 'iPhone 17e', tier: 6.4 },
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
        services: PHONE_13_SERVICES
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
        services: PHONE_13_SERVICES
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
        services: PHONE_13_SERVICES
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
        services: PHONE_13_SERVICES
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
        services: PHONE_13_SERVICES
    },
    oppo: {
        name: 'OPPO', baseLabor: 45, supportsGrades: true,
        models: [
            { id: 'oppo_fx7', name: 'OPPO Find X7 / X6 Pro', tier: 6.0 },
            { id: 'oppo_fx5', name: 'OPPO Find X5 Pro / X5', tier: 4.2 },
            { id: 'oppo_reno11', name: 'OPPO Reno 11 / 10 Pro', tier: 3.5 },
            { id: 'oppo_a98', name: 'OPPO A98 / A78 / A58', tier: 2.0 }
        ],
        services: PHONE_13_SERVICES
    },
    microsoft_surface: {
        name: 'Microsoft Surface', baseLabor: 69, supportsGrades: false,
        models: [
            { id: 'surf_pro_9', name: 'Surface Pro 9 / 10', tier: 5.5 },
            { id: 'surf_pro_8', name: 'Surface Pro 8 / Pro X', tier: 4.8 },
            { id: 'surf_pro_7', name: 'Surface Pro 7 / 7+', tier: 3.8 },
            { id: 'surf_lap_5', name: 'Surface Laptop 4 / 5', tier: 4.5 }
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
            { id: 'sw_oled', name: 'Nintendo Switch OLED', tier: 2.5 },
            { id: 'sw_v2', name: 'Nintendo Switch (V1 / V2)', tier: 1.8 },
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
    },
    playstation_console: {
        name: 'PlayStation & Consoles', baseLabor: 59, supportsGrades: false,
        models: [
            { id: 'ps5_pro', name: 'PlayStation 5 Pro', tier: 2.5 },
            { id: 'ps5_slim', name: 'PlayStation 5 Slim', tier: 2.2 },
            { id: 'ps5_orig', name: 'PlayStation 5 (Original)', tier: 1.8 },
            { id: 'xbox_sx', name: 'Xbox Series X', tier: 2.0 }
        ],
        services: [
            { id: 'ps5_hdmi', name: 'HDMI 2.1 Port Replacement', base: 89, factor: 15 },
            { id: 'ps5_liquid_metal', name: 'APU Liquid Metal Repaste & Clean', base: 69, factor: 10 },
            { id: 'ps5_psu', name: 'Internal Power Supply Repair', base: 119, factor: 15 },
            { id: 'ps5_drive', name: 'Optical Disc Drive Laser Repair', base: 85, factor: 12 }
        ]
    },
    other_devices: {
        name: 'Other Smartphones & Tablets', baseLabor: 39, supportsGrades: true,
        models: [
            { id: 'other_flagship', name: 'Flagship Smartphone / Tablet', tier: 2.2 },
            { id: 'other_midrange', name: 'Mid-Range Smartphone / Tablet', tier: 1.4 }
        ],
        services: PHONE_13_SERVICES
    }
};

/**
 * Computes the exact AUD price for a service + model tier + part grade.
 */
function computeServicePrice(svc, modelTier, multiplier) {
    const rawPrice = (svc.base + (modelTier * svc.factor)) * multiplier;
    let itemPrice = Math.round(rawPrice);

    if (svc.id !== 'sim_tray' && svc.id !== 'sw_drift') {
        itemPrice = Math.ceil(itemPrice / 10) * 10 - 1; // Apple-style .99/.00 ending
    }
    return itemPrice;
}

/**
 * Builds the master PRICE_MAP dictionary indexed by:
 * 1) Composite key: `${familyKey}:${modelId}:${grade}:${serviceId}`
 * 2) Flat fallback key: `${serviceId}`
 */
function buildMasterPriceMap() {
    const map = {};

    for (const [familyKey, family] of Object.entries(CATALOG)) {
        const grades = family.supportsGrades
            ? ['aftermarket', 'premium', 'genuine']
            : ['standard', 'aftermarket', 'premium', 'genuine'];

        for (const model of family.models) {
            for (const gradeKey of grades) {
                const effectiveGrade = family.supportsGrades
                    ? (GRADE_CONFIG[gradeKey] || GRADE_CONFIG.premium)
                    : GRADE_CONFIG.standard;

                for (const svc of family.services) {
                    const price = computeServicePrice(svc, model.tier, effectiveGrade.multiplier);
                    const compositeKey = `${familyKey}:${model.id}:${gradeKey}:${svc.id}`;

                    map[compositeKey] = {
                        id: compositeKey,
                        serviceId: svc.id,
                        name: svc.name,
                        deviceFamily: family.name,
                        familyKey,
                        modelId: model.id,
                        modelName: model.name,
                        partGrade: effectiveGrade.label,
                        warranty: effectiveGrade.warranty,
                        price,
                        baseLabor: family.baseLabor
                    };
                }
            }
        }
    }

    // Flat serviceId fallback keys
    for (const [familyKey, family] of Object.entries(CATALOG)) {
        const defaultModel = family.models[0];
        for (const svc of family.services) {
            if (!map[svc.id]) {
                const price = computeServicePrice(svc, defaultModel.tier, 1.0);
                map[svc.id] = {
                    id: svc.id,
                    serviceId: svc.id,
                    name: svc.name,
                    deviceFamily: family.name,
                    familyKey,
                    modelId: defaultModel.id,
                    modelName: defaultModel.name,
                    partGrade: family.supportsGrades ? GRADE_CONFIG.premium.label : GRADE_CONFIG.standard.label,
                    warranty: family.supportsGrades ? GRADE_CONFIG.premium.warranty : GRADE_CONFIG.standard.warranty,
                    price,
                    baseLabor: family.baseLabor
                };
            }
        }
    }

    return map;
}

const PRICE_MAP = buildMasterPriceMap();

// ============================================================================
// 2. PLACEHOLDER EMAIL DISPATCH FUNCTION
// ============================================================================
/**
 * TODO: Connect your real email API here later (e.g., Nodemailer / SendGrid / AWS SES / Resend).
 * The itemized prices and total cost are sent ONLY via email and never shown on the website.
 */
async function sendQuoteEmailPlaceholder(customerEmail, formattedQuoteText, quoteSummary) {
    // ------------------------------------------------------------------------
    // PLACEHOLDER FOR REAL EMAIL API INTEGRATION
    // Example (to be connected later):
    // await emailClient.send({
    //     from: 'quotes@leenguyenlab.com.au',
    //     to: customerEmail,
    //     subject: `Your Itemized Repair Quote — Lee Nguyen Lab (${quoteSummary.deviceName})`,
    //     text: formattedQuoteText
    // });
    // ------------------------------------------------------------------------
    console.log(`[EMAIL PLACEHOLDER] Ready to dispatch private quote email to: ${customerEmail}`);
    return true;
}

// ============================================================================
// 3. POST /calculate-quote ROUTE (Also mounted at /api/calculate-quote)
// ============================================================================

async function handleCalculateQuote(req, res) {
    try {
        const {
            email,
            selectedItems,
            partIds,
            familyKey = 'iphone',
            modelId,
            partGrade = 'premium'
        } = req.body || {};

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid customer email address.'
            });
        }

        let rawList = selectedItems || partIds || [];
        if (typeof rawList === 'string') {
            try {
                rawList = JSON.parse(rawList);
            } catch {
                rawList = rawList.split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        if (!Array.isArray(rawList) || rawList.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please select at least one repair service or part.'
            });
        }

        // Resolve each requested item from PRICE_MAP
        const resolvedItems = [];
        for (const itemKey of rawList) {
            const keyStr = typeof itemKey === 'string' ? itemKey.trim() : (itemKey && itemKey.id);
            if (!keyStr) continue;

            if (PRICE_MAP[keyStr]) {
                resolvedItems.push(PRICE_MAP[keyStr]);
                continue;
            }

            const family = CATALOG[familyKey] || CATALOG.iphone;
            const targetModelId = modelId || family.models[0].id;
            const targetGrade = family.supportsGrades ? partGrade : 'standard';
            const compositeKey = `${familyKey}:${targetModelId}:${targetGrade}:${keyStr}`;

            if (PRICE_MAP[compositeKey]) {
                resolvedItems.push(PRICE_MAP[compositeKey]);
            }
        }

        if (resolvedItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'None of the selected part IDs matched valid entries in PRICE_MAP.'
            });
        }

        // Calculate totals on the backend
        const primaryItem = resolvedItems[0];
        const partsSubtotal = resolvedItems.reduce((sum, item) => sum + item.price, 0);
        const baseLabor = primaryItem.baseLabor;
        const grandTotal = partsSubtotal + baseLabor;

        const itemizedLines = resolvedItems.map(
            (item, idx) => `  ${idx + 1}. ${item.name} — A$${item.price.toFixed(2)}`
        );

        const formattedQuote = [
            '============================================================',
            '              LEE NGUYEN LAB — REPAIR QUOTE                 ',
            '                 leenguyenlab.com.au                        ',
            '============================================================',
            `Customer Email : ${email.trim()}`,
            `Device Model   : ${primaryItem.modelName} (${primaryItem.deviceFamily})`,
            `Part Tier      : ${primaryItem.partGrade}`,
            `Warranty       : ${primaryItem.warranty}`,
            '------------------------------------------------------------',
            'ITEMIZED BREAKDOWN:',
            ...itemizedLines,
            '------------------------------------------------------------',
            `Parts Subtotal : A$${partsSubtotal.toFixed(2)}`,
            `Base Lab Labor : A$${baseLabor.toFixed(2)}`,
            '------------------------------------------------------------',
            `ESTIMATED TOTAL: A$${grandTotal.toFixed(2)} (Inc. GST)`,
            '============================================================'
        ].join('\n');

        // Log the full itemized quote with prices on the backend server
        console.log('\n' + formattedQuote + '\n');

        // Trigger the email dispatch placeholder (with the full itemized prices)
        await sendQuoteEmailPlaceholder(email.trim(), formattedQuote, {
            deviceName: primaryItem.modelName,
            grandTotal
        });

        // Return 200 OK JSON WITHOUT exposing any dollar amounts to the browser
        return res.status(200).json({
            success: true,
            message: `Your itemized quote for ${primaryItem.modelName} has been sent to ${email.trim()}. Please check your inbox.`
        });
    } catch (err) {
        console.error('Error in /calculate-quote:', err);
        return res.status(500).json({
            success: false,
            error: 'An unexpected server error occurred while generating your quote.'
        });
    }
}

app.post('/calculate-quote', upload.none(), handleCalculateQuote);
app.post('/api/calculate-quote', upload.none(), handleCalculateQuote);

// ============================================================================
// 4. START SERVER (cPanel Compatible Port)
// ============================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Lee Nguyen Lab Quote Server listening on port ${PORT}`);
});

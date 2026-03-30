# TransparenSee — Master Design System
## Pharmacy Price Transparency (DPRI) Concierge App
### ServiceNow Service Portal · Design Specification v1.0

---

## 🎯 Design Philosophy

```json
{
  "app_name": "TransparenSee",
  "tagline": "Bridging the gap between patients and affordable medicine.",
  "design_language": "Clarity-First Healthcare",
  "aesthetic_direction": "Bento Grid + Soft Glassmorphism + Medical Precision",
  "mood": [
    "Trustworthy",
    "Modern",
    "Accessible",
    "Empowering",
    "Filipino-grounded"
  ],
  "anti_patterns": [
    "Cold clinical white walls",
    "Generic government portal aesthetics",
    "Overused purple-gradient AI slop",
    "Dense table-heavy interfaces",
    "Intimidating medical jargon UI"
  ],
  "inspiration_references": [
    "Apple Health App (data clarity)",
    "GoodRx (price transparency UX)",
    "Linear.app (bento grid elegance)",
    "Philippine DOH rebrand direction (trust + warmth)"
  ]
}
```

---

## 🎨 Color Palette

```json
{
  "palette_name": "Teal Clarity",
  "source": "Derived from TransparenSee logo identity",

  "primary": {
    "teal_deep":     "#007A72",
    "teal_mid":      "#009688",
    "teal_bright":   "#00BFA5",
    "teal_light":    "#E0F2F1",
    "teal_ghost":    "#F0FAFA"
  },

  "secondary": {
    "navy_dark":     "#0D1F4E",
    "navy_mid":      "#1A2B5E",
    "navy_soft":     "#2C3E6B",
    "navy_muted":    "#4A5D8A"
  },

  "accent": {
    "savings_gold":  "#F59E0B",
    "savings_light": "#FEF3C7",
    "alert_red":     "#EF4444",
    "alert_light":   "#FEE2E2",
    "success_green": "#10B981",
    "success_light": "#D1FAE5"
  },

  "neutral": {
    "white":         "#FFFFFF",
    "surface":       "#F8FAFB",
    "surface_mid":   "#F1F5F5",
    "border":        "#E2EAEB",
    "text_primary":  "#0D1F4E",
    "text_secondary":"#4A5D8A",
    "text_muted":    "#8FA3A8",
    "text_inverse":  "#FFFFFF"
  },

  "glass": {
    "white_glass":   "rgba(255, 255, 255, 0.72)",
    "teal_glass":    "rgba(0, 150, 136, 0.12)",
    "navy_glass":    "rgba(13, 31, 78, 0.08)",
    "blur":          "backdrop-filter: blur(16px) saturate(180%)"
  },

  "gradients": {
    "hero_bg":       "linear-gradient(135deg, #0D1F4E 0%, #007A72 100%)",
    "card_savings":  "linear-gradient(135deg, #007A72 0%, #00BFA5 100%)",
    "card_warning":  "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    "card_neutral":  "linear-gradient(135deg, #1A2B5E 0%, #2C3E6B 100%)",
    "price_badge":   "linear-gradient(90deg, #00BFA5, #007A72)"
  }
}
```

---

## ✍️ Typography

```json
{
  "font_strategy": "Bold display + Clean data + Warm body",

  "fonts": {
    "display": {
      "family": "Clash Display",
      "fallback": "'DM Sans', sans-serif",
      "cdn": "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap",
      "use_for": "Page titles, hero headlines, drug names (large)",
      "personality": "Geometric, modern, authoritative — feels like a fintech app"
    },
    "body": {
      "family": "Plus Jakarta Sans",
      "fallback": "'Nunito', sans-serif",
      "cdn": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      "use_for": "Body text, labels, descriptions, navigation",
      "personality": "Warm, readable, slightly rounded — feels approachable not clinical"
    },
    "mono_data": {
      "family": "DM Mono",
      "fallback": "'Courier New', monospace",
      "cdn": "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap",
      "use_for": "Prices (₱120.00), drug codes, DPRI reference numbers",
      "personality": "Precise, trustworthy — numbers feel official"
    }
  },

  "scale": {
    "display_xl":  { "size": "48px",  "weight": "700", "line_height": "1.1", "font": "Clash Display" },
    "display_lg":  { "size": "36px",  "weight": "600", "line_height": "1.2", "font": "Clash Display" },
    "heading_1":   { "size": "28px",  "weight": "600", "line_height": "1.3", "font": "Clash Display" },
    "heading_2":   { "size": "22px",  "weight": "600", "line_height": "1.4", "font": "Plus Jakarta Sans" },
    "heading_3":   { "size": "18px",  "weight": "600", "line_height": "1.4", "font": "Plus Jakarta Sans" },
    "body_lg":     { "size": "16px",  "weight": "400", "line_height": "1.6", "font": "Plus Jakarta Sans" },
    "body_md":     { "size": "14px",  "weight": "400", "line_height": "1.6", "font": "Plus Jakarta Sans" },
    "body_sm":     { "size": "13px",  "weight": "400", "line_height": "1.5", "font": "Plus Jakarta Sans" },
    "label":       { "size": "12px",  "weight": "500", "line_height": "1.4", "letter_spacing": "0.06em", "font": "Plus Jakarta Sans", "transform": "uppercase" },
    "price_lg":    { "size": "32px",  "weight": "500", "line_height": "1.2", "font": "DM Mono" },
    "price_md":    { "size": "22px",  "weight": "500", "line_height": "1.2", "font": "DM Mono" },
    "price_sm":    { "size": "16px",  "weight": "400", "line_height": "1.2", "font": "DM Mono" }
  }
}
```

---

## 📐 Layout System

```json
{
  "layout_system": "Bento Grid + Fluid Columns",
  "grid": {
    "columns": 12,
    "gutter": "24px",
    "margin": "40px",
    "max_width": "1280px",
    "breakpoints": {
      "mobile":  "< 768px  → 1 column, 16px gutter",
      "tablet":  "768–1024px → 6 column, 20px gutter",
      "desktop": "> 1024px → 12 column, 24px gutter"
    }
  },

  "spacing_scale": {
    "xs":  "4px",
    "sm":  "8px",
    "md":  "16px",
    "lg":  "24px",
    "xl":  "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px"
  },

  "border_radius": {
    "sm":   "8px",
    "md":   "12px",
    "lg":   "16px",
    "xl":   "24px",
    "2xl":  "32px",
    "pill": "9999px",
    "card": "20px"
  },

  "shadows": {
    "card":    "0 4px 24px rgba(0, 122, 114, 0.08), 0 1px 4px rgba(13, 31, 78, 0.06)",
    "card_hover": "0 8px 40px rgba(0, 122, 114, 0.16), 0 2px 8px rgba(13, 31, 78, 0.08)",
    "badge":   "0 2px 8px rgba(0, 191, 165, 0.30)",
    "modal":   "0 24px 64px rgba(13, 31, 78, 0.20)",
    "nav":     "0 2px 16px rgba(13, 31, 78, 0.08)"
  }
}
```

---

## 🧩 Component Library

```json
{
  "components": {

    "navbar": {
      "style": "Sticky top, white glass with blur",
      "height": "64px",
      "bg": "rgba(255,255,255,0.88) with backdrop-filter blur(20px)",
      "border_bottom": "1px solid rgba(0,150,136,0.10)",
      "logo": "TransparenSee SVG eye+pill logo, left-aligned",
      "nav_items": ["Home", "Search", "Map", "Profile"],
      "active_state": "Teal underline + teal text weight 600",
      "cta_button": "Teal pill button: 'Find Drug Price'",
      "icons": "Bell (notifications) + Avatar circle (profile)"
    },

    "search_bar": {
      "style": "Prominent hero search",
      "height": "56px",
      "border_radius": "pill (9999px)",
      "bg": "White with 2px teal border on focus",
      "shadow": "0 8px 32px rgba(0,122,114,0.15)",
      "placeholder": "Search Drug Name (e.g., Amoxicillin...)",
      "left_icon": "Magnifying glass in teal",
      "right_icon": "Microphone icon (voice search) in teal",
      "autocomplete_dropdown": {
        "bg": "White glass panel",
        "item_hover": "teal_ghost background",
        "shows": "Drug name + category pill + DPRI price preview"
      }
    },

    "drug_result_card": {
      "style": "Elevated white card with left teal accent border",
      "border_left": "4px solid teal_bright",
      "border_radius": "card (20px)",
      "bg": "White",
      "shadow": "card shadow",
      "hover": "card_hover shadow + translateY(-2px) transition",
      "layout": "3-column: Drug Info | DPRI Price | Savings Badge",
      "elements": {
        "drug_name":    "Clash Display 18px semibold, navy_dark",
        "brand_names":  "Plus Jakarta Sans 13px italic, text_secondary",
        "dosage_pills": "Chip tags: teal_light bg + teal_deep text",
        "dpri_price":   "DM Mono 22px, teal_deep, prefix '₱'",
        "savings_badge": "Gradient gold pill: 'Save up to X% vs Hospital'",
        "retail_avg":   "Strikethrough DM Mono 14px text_muted",
        "limited_stock": "Alert red pill badge"
      }
    },

    "clinical_recommendation_card": {
      "style": "Full-width teal gradient banner",
      "bg": "gradient card_savings",
      "text_color": "White",
      "border_radius": "card (20px)",
      "icon": "Info circle top-right",
      "headline": "Clash Display 18px bold",
      "body": "Plus Jakarta Sans 14px",
      "cta_button": "White outlined pill button"
    },

    "stat_card": {
      "style": "Bento grid stat tile",
      "variants": {
        "primary":   "teal gradient bg, white text",
        "secondary": "navy gradient bg, white text",
        "neutral":   "white bg, navy text, teal left-border"
      },
      "layout": "Icon top-left, value center, label bottom",
      "value_font": "Clash Display 36px bold",
      "label_font": "Plus Jakarta Sans 12px uppercase label"
    },

    "ai_concierge_panel": {
      "style": "Glassmorphism floating panel",
      "bg": "rgba(255,255,255,0.85) backdrop-filter blur(20px)",
      "border": "1px solid rgba(0,191,165,0.25)",
      "border_radius": "xl (24px)",
      "shadow": "modal shadow",
      "header": "Teal gradient strip: 'AI Pharmacist · TransparenSee'",
      "avatar": "Teal circle with pill capsule icon",
      "message_bubble": {
        "ai":   "teal_ghost bg, left-aligned, teal_deep text",
        "user": "navy_dark bg, right-aligned, white text"
      },
      "typing_indicator": "3 teal dots animated pulse"
    },

    "map_card": {
      "style": "Full-width embedded map with floating pharmacy list",
      "map_provider": "Leaflet.js (OpenStreetMap) or Google Maps embed",
      "overlay_panel": "Glassmorphism left sidebar, pharmacy list cards",
      "pharmacy_pin": "Custom teal SVG map pin with pill icon",
      "selected_pin": "Navy pin with white label tooltip",
      "pharmacy_list_item": {
        "name": "Plus Jakarta Sans 14px semibold",
        "distance": "DM Mono 13px teal_bright",
        "address": "Plus Jakarta Sans 12px text_muted",
        "distance_badge": "Teal pill: '0.3 km away'"
      }
    },

    "price_report_modal": {
      "style": "Clean printable overlay",
      "bg": "White",
      "border_radius": "xl",
      "header": "TransparenSee logo + 'Official Price Reference' label",
      "stamp": "DPRI 2025 teal watermark diagonal",
      "sections": ["Drug Details", "DPRI Fair Price", "Nearest Pharmacy Map", "AI Safety Note"],
      "cta": "Print / Download PDF button in teal"
    },

    "notification_toast": {
      "variants": {
        "success": "Green left-border, checkmark icon",
        "warning": "Gold left-border, alert icon",
        "info":    "Teal left-border, info icon",
        "error":   "Red left-border, X icon"
      },
      "position": "Bottom-right",
      "animation": "Slide up + fade in"
    },

    "pill_tag": {
      "category_antibiotic":     "bg:#E0F2F1, text:#007A72",
      "category_maintenance":    "bg:#E8EAF6, text:#3949AB",
      "category_painkiller":     "bg:#FFF3E0, text:#E65100",
      "category_vitamin":        "bg:#F1F8E9, text:#558B2F",
      "route_oral":              "bg:#F3F4F6, text:#374151",
      "route_topical":           "bg:#FDF2F8, text:#9D174D"
    },

    "empty_state": {
      "icon": "Large teal eye/search illustration",
      "headline": "Clash Display 22px",
      "body": "Plus Jakarta Sans 14px text_secondary",
      "cta": "Teal pill button"
    }
  }
}
```

---

## 📱 Pages Specification

```json
{
  "pages": {

    "P01_HOME": {
      "url": "/transparensee",
      "title": "Home — Search Portal",
      "layout": "Hero + Bento Grid",
      "sections": [
        {
          "id": "hero",
          "type": "full_width_hero",
          "bg": "gradient hero_bg (navy → teal)",
          "height": "480px desktop / 360px mobile",
          "content": {
            "eyebrow": "LABEL: 'DPRI 2025 · Department of Health'",
            "headline": "Bridging the gap between patients and affordable medicine.",
            "subtext": "Real-time DPRI pricing, clinical insights, and financial transparency at your fingertips.",
            "search_bar": "Large pill search bar (white on dark bg)",
            "popular_searches": "Chips: Paracetamol · Metformin · Amoxicillin · Amlodipine"
          },
          "decorative": "Subtle pill/capsule pattern overlay at 5% opacity"
        },
        {
          "id": "stats_row",
          "type": "bento_3col",
          "cards": [
            "Total Drugs in DPRI: [count] — teal stat card",
            "Avg Savings vs Hospital: 65% — gold stat card",
            "Accredited Pharmacies: [count] — navy stat card"
          ]
        },
        {
          "id": "recent_activity",
          "type": "two_col_bento",
          "left": "Recent searches list with drug icons",
          "right": "Savings Tip card — glassmorphism style, gold accent"
        },
        {
          "id": "how_it_works",
          "type": "3_step_horizontal",
          "steps": ["Search Drug", "Compare Prices", "Find Nearest Pharmacy"],
          "style": "Numbered teal circles + icon + short description"
        }
      ]
    },

    "P02_SEARCH_RESULTS": {
      "url": "/transparensee?search=amoxicillin",
      "title": "Search Results",
      "layout": "Split: Filter sidebar (left 25%) + Results (right 75%)",
      "sections": [
        {
          "id": "search_bar_sticky",
          "type": "sticky_top",
          "content": "Pre-filled search bar + result count + Filter button"
        },
        {
          "id": "filter_sidebar",
          "type": "collapsible_panel",
          "filters": [
            "Drug Category (checkbox: Antibiotic, Analgesic, etc.)",
            "Dosage Form (checkbox: Tablet, Capsule, Syrup)",
            "Price Range (range slider in teal)",
            "Generic Only (toggle switch)"
          ]
        },
        {
          "id": "results_list",
          "type": "card_list",
          "card": "drug_result_card component",
          "injected_at_position_3": "clinical_recommendation_card",
          "empty_state": "empty_state component"
        },
        {
          "id": "floating_cta",
          "type": "fixed_bottom_right",
          "content": "Compare Savings button (teal gradient pill with ✦ icon)"
        }
      ]
    },

    "P03_DRUG_DETAIL": {
      "url": "/transparensee/drug/{id}",
      "title": "Drug Detail Page",
      "layout": "Two-col: Detail left (60%) + AI Panel right (40%)",
      "sections": [
        {
          "id": "drug_header",
          "type": "hero_card",
          "bg": "teal_ghost with teal left-border accent",
          "content": {
            "generic_name": "Clash Display 32px bold",
            "brand_names":  "Italic subtitle",
            "category_tag": "pill_tag component",
            "dpri_price":   "Large DM Mono price + 'DPRI Fair Price' label",
            "retail_comparison": "vs Hospital Avg bar chart (teal vs red)"
          }
        },
        {
          "id": "drug_info_bento",
          "type": "bento_2x2_grid",
          "tiles": [
            "Dosage & Form",
            "Drug Classification",
            "Indications (What it treats)",
            "Warnings & Interactions"
          ]
        },
        {
          "id": "ai_concierge",
          "type": "floating_right_panel",
          "component": "ai_concierge_panel",
          "auto_prompt": "Generates safety counsel on page load"
        },
        {
          "id": "nearest_pharmacies_preview",
          "type": "mini_map_strip",
          "shows": "Top 3 nearest pharmacies with distance + price",
          "cta": "View Full Map button"
        },
        {
          "id": "actions_bar",
          "type": "sticky_bottom",
          "buttons": [
            "Generate Price Report (primary teal)",
            "Find Nearest Pharmacy (outlined teal)",
            "Share (ghost button)"
          ]
        }
      ]
    },

    "P04_MAP_VIEW": {
      "url": "/transparensee/map",
      "title": "Nearest Pharmacies Map",
      "layout": "Full-screen map with floating panels",
      "sections": [
        {
          "id": "map_full",
          "type": "full_viewport_map",
          "provider": "Leaflet.js with OpenStreetMap tiles",
          "custom_pins": "Teal pill-shaped markers with pharmacy initial"
        },
        {
          "id": "pharmacy_list_overlay",
          "type": "glass_sidebar_left",
          "style": "ai_concierge_panel glass style",
          "content": "Sortable pharmacy list (by distance / by price)",
          "each_item": "map_card pharmacy_list_item component"
        },
        {
          "id": "selected_pharmacy_popup",
          "type": "map_tooltip_card",
          "content": "Name + Address + Distance + Drug price + Directions button"
        }
      ]
    },

    "P05_PRICE_REPORT": {
      "url": "/transparensee/report/{drug_id}",
      "title": "Price Report — Printable",
      "layout": "A4 document layout centered",
      "sections": [
        {
          "id": "report_header",
          "content": "Logo + 'DPRI Price Reference Report' + Date generated"
        },
        {
          "id": "patient_section",
          "content": "Generated for: [name if logged in] or 'Anonymous Patient'"
        },
        {
          "id": "drug_summary_table",
          "content": "Generic Name | Dosage | Form | DPRI Price | Retail Avg | Savings %"
        },
        {
          "id": "nearest_pharmacy_list",
          "content": "Top 3 pharmacies with address + estimated price"
        },
        {
          "id": "ai_safety_note",
          "content": "Box: AI-generated pharmacist note for this drug"
        },
        {
          "id": "dpri_disclaimer",
          "content": "Official DPRI 2025 source citation + DOH logo"
        },
        {
          "id": "print_actions",
          "type": "no_print",
          "buttons": ["Print PDF", "Download", "Share via Email"]
        }
      ]
    },

    "P06_ADMIN_DASHBOARD": {
      "url": "/transparensee/admin",
      "title": "Admin — Data Management",
      "access_role": "dpri_admin only",
      "layout": "Left nav sidebar + Main content area",
      "sections": [
        {
          "id": "admin_nav",
          "items": ["Overview", "Drug Records", "Pharmacy Records", "Categories", "Search Logs", "Notifications"]
        },
        {
          "id": "overview_bento",
          "type": "bento_4col_stat_cards",
          "cards": ["Total Drugs", "Active Pharmacies", "Searches Today", "Reports Generated"]
        },
        {
          "id": "quick_actions",
          "type": "action_card_row",
          "actions": ["Import New DPRI Data", "Add Pharmacy", "Manage Categories", "View Search Logs"]
        },
        {
          "id": "recent_activity_table",
          "type": "data_table",
          "style": "Clean white table, teal header row, striped rows"
        }
      ]
    },

    "P07_PROFILE": {
      "url": "/transparensee/profile",
      "title": "User Profile",
      "layout": "Single column centered, max 640px",
      "sections": [
        {
          "id": "profile_card",
          "type": "glass_card_centered",
          "content": "Avatar + Name + Role badge + Edit button"
        },
        {
          "id": "search_history",
          "type": "timeline_list",
          "content": "Past drug searches with timestamp + quick re-search button"
        },
        {
          "id": "saved_reports",
          "type": "card_grid",
          "content": "Saved price reports with download buttons"
        },
        {
          "id": "preferences",
          "type": "settings_list",
          "content": "Language (Filipino/English), Notification preferences, Saved location"
        }
      ]
    }
  }
}
```

---

## 🎞️ Motion & Animation

```json
{
  "motion_philosophy": "Purposeful, never decorative for its own sake",
  "transitions": {
    "page_enter":    "fadeInUp 280ms ease-out",
    "card_hover":    "translateY(-2px) + shadow deepen, 200ms ease",
    "search_expand": "Height + opacity, 250ms cubic-bezier(0.4,0,0.2,1)",
    "badge_appear":  "scale(0.8→1) + fade, 300ms spring",
    "ai_typing":     "3-dot pulse, 1.2s infinite",
    "price_reveal":  "Number count-up animation on card load",
    "toast":         "slideInRight 250ms ease-out, fadeOut 300ms"
  },
  "hover_states": {
    "drug_card":     "Lift + deepen shadow + teal left border brightens",
    "nav_item":      "Teal underline slides in from left",
    "cta_button":    "Background brightens 10% + subtle scale(1.02)",
    "pharmacy_pin":  "Bounce + scale up + show tooltip"
  }
}
```

---

## 🔐 Roles & Access Visual States

```json
{
  "roles": {
    "dpri_patient": {
      "accessible_pages": ["Home", "Search Results", "Drug Detail", "Map", "Price Report", "Profile"],
      "hidden_elements": ["Admin Dashboard", "Import Data button", "Delete/Edit drug records"],
      "visual_indicator": "None (clean patient view)"
    },
    "dpri_admin": {
      "accessible_pages": "All pages",
      "extra_elements": ["Admin nav item", "Edit/Delete on drug cards", "Import DPRI button"],
      "visual_indicator": "Small 'Admin' navy badge next to username in navbar"
    }
  }
}
```

---

## 🛠️ ServiceNow Implementation Notes

```json
{
  "implementation": {
    "portal_suffix": "/transparensee",
    "theme": "Custom CSS in ServiceNow Style Sheet record",
    "fonts": "Load via UI Script (external CDN call in portal header)",
    "icons": "Phosphor Icons or Heroicons (lightweight, CDN)",
    "charts": "Chart.js via UI Script for savings bar charts",
    "map": "Leaflet.js loaded via UI Script",
    "glass_effect": "backdrop-filter CSS in custom style sheet",
    "bento_grid": "CSS Grid with named areas in widget HTML",
    "angularjs_note": "ng-repeat for drug cards, ng-model for search, $http for GlideAjax calls",
    "print_report": "window.print() with @media print CSS rules hiding nav/buttons"
  }
}
```

---

## 🏁 Quick Reference Cheatsheet

| Element | Value |
|---|---|
| Primary Color | `#009688` Teal |
| Dark Color | `#0D1F4E` Navy |
| Accent | `#F59E0B` Gold |
| Display Font | Clash Display |
| Body Font | Plus Jakarta Sans |
| Price Font | DM Mono |
| Card Radius | 20px |
| Base Shadow | `0 4px 24px rgba(0,122,114,0.08)` |
| Grid | 12-col, 24px gutter |
| Portal URL | `/transparensee` |
| Admin Role | `dpri_admin` |
| Patient Role | `dpri_patient` |

---

*TransparenSee Design System v1.0 — Created for ALPS Batch 2 Hackathon · EY GDS × ServiceNow*
*Team TransparenSee · G6 · PRBCS00034*

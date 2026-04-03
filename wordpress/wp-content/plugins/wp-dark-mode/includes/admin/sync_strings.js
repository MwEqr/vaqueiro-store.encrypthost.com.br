const fs = require('fs');

const missingKeys = {
    // Route Names (for Suggestions/Navigation)
    'frontend_dark_mode': 'Frontend Dark Mode',
    'admin_panel_dark_mode': 'Admin Panel Dark Mode',
    'switch_settings': 'Switch Settings',
    'color_settings': 'Color Settings',
    'image_settings': 'Image Settings',
    'video_settings': 'Video Settings',
    'site_animation': 'Site Animation',
    'performance': 'Performance',
    'exclude_settings': 'Exclude Settings',
    'custom_css': 'Custom CSS',
    'accessibility': 'Accessibility',
    'shortcode': 'Shortcode',
    'switch_widget': 'Switch Widget',
    'analytics': 'Analytics',
    'tools': 'Tools',

    // Transition & Admin
    'enable_page_transition_animation': 'Enable Page Transition Animation',
    'enable_admin_dashboard_dark_mode': 'Enable Admin Dashboard Dark Mode',
    'enable_admin_dashboard_dark_mode_hints': 'Turn it ON to enable dark mode on the WordPress dashboard',
    'block_editor_dark_mode': 'Block Editor Dark Mode',
    'block_editor_dark_mode_hints': 'Turn it ON to show dark mode switch in the block editor for toggling between dark and light mode.',
    'classic_editor_dark_mode': 'Classic Editor Dark Mode',
    'classic_editor_dark_mode_hints': 'Turn it ON to show dark mode switch in the classic editor for toggling between dark and light mode.',
    
    // Performance
    'track_dynamic_content': 'Track Dynamic Content',
    'track_dynamic_content_hints': 'Please turn on this feature only if you have any Ajax Loaded dynamic content like ajax product filters, ajax page loader, ajax image loaders/sliders, lazy loaded images etc.',
    'load_scripts_in_footer': 'Load Scripts in Footer',
    'load_scripts_in_footer_hints': 'Enable this feature to improve page load performance and reduce render-blocking',
    'exclude_from_caching': 'Exclude WP Dark Mode from Caching',
    'exclude_from_caching_hints': 'Enable this feature to exclude WP Dark Mode from server-side caching technology like Lightspeed Cache, WPRocket etc.',
    
    // Excludes / HTML Elements
    'html_elements': 'HTML Elements',
    'pages_posts': 'Pages/Posts',
    'woocommerce': 'WooCommerce',
    'html_element_title': 'HTML Element',
    'html_element_desc': 'Exclude dark mode on HTML tags, CSS class, CSS ids and more',
    'exclude_elements': 'Exclude Elements',
    'enter_element_selectors': 'Enter HTML element selectors',
    'exclude_elements_hints': 'Add HTML element selectors (tags, classes, or IDs) to exclude them from being affected by dark mode.',
    'include_elements': 'Include Elements',
    'include_elements_hints': 'Add HTML element selectors (tags, classes, or IDs) to explicitly include them in dark mode.',

    // Accessibility.vue
    'typography_settings': 'Typography Settings',
    'typography_alert_msg': 'Typography features are only available for',
    'accessibility_switches': 'Accessibility Switches',
    'explore_accessibility_switches': 'Explore Accessibility Switches',
    'adjust_typography': 'Adjust Typography for Dark Mode',
    'adjust_typography_hints': 'Enable to get seamless readability by font adaptation during dark-light mode toggling.',
    'url_parameter_usage_hints': 'Use',
    'to_enable_dark_mode': 'to enable dark mode',
    'to_enable_light_mode': 'to enable light mode',
    'delete_trigger_confirm': 'Are you sure you want to delete this trigger?',

    // AI Preset Generator
    'ai_preset_generator_title': 'AI Preset Generator',
    'ai_preset_generator_desc': 'Let AI instantly generate a smart dark mode theme preset for you.',
    'enter_your_prompt': 'Enter Your Prompt',
    'edit_prompt': 'Edit Prompt',
    'prompt_placeholder': 'e.g., Modern dark theme with blue accents and high contrast...',
    'generate_colors': 'Generate Colors',
    'generating_colors': 'Generating colors...',
    'choose_palettes': 'Choose Your Preferred Color Palettes',
    'palette_label': 'Palette %s',
    'preset_name_label': 'Preset Name',
    'preset_name_placeholder': 'e.g., Blue Night Theme',
    'preset_name_error': 'Preset name is required. Please enter a name for your preset.',
    'ai_preset_saved': 'AI Preset saved successfully!',
    'analyze_my_website': 'Analyze my website',
    'upcoming': 'Upcoming',

    // Widget / Menu / Content Display
    'display_switch_top_posts': 'Display Switch at Top of Posts',
    'display_switch_top_pages': 'Display Switch at Top of Pages',
    'display_switch_menus_hints': 'The switch will be displayed in the selected menus.',
    'add_widget_to_menu': 'Add Dark Mode switch to Menus from WordPress dashboard',
    'select_switch_style_menu': 'Select a switch style for the menu',
    'update_done_title': 'Click update and you are done!',
    'widget_instruction_1': 'Drag & drop the Darkmode Switcher to any of your menus from the Menu option under Appearance settings in WordPress dashboard',
    'switch_widget_instruction_2': 'Click on the WP Darkmode Widget and you will see the available switches on the right side of the screen. Select the one that you like',
    'update_done_instruction': 'Click update and you are done! The switch will now be visible in the menu where you placed.',
};

const filePath = 'C:\\Users\\Shimul\\Local Sites\\wpdarkmode\\app\\public\\wp-content\\plugins\\wp-dark-mode\\includes\\admin\\class-strings.php';
let content = fs.readFileSync(filePath, 'utf8');

// Modernized Extraction: Extracts all 'key' => __('Value', 'domain') patterns
// Handles multiline and potentially messy spacing
const regex = /'([^']+)'\s*=>\s*__\(\s*'([^']+)',\s*'wp-dark-mode'\s*\)/g;
let match;
const keys = new Map();

while ((match = regex.exec(content)) !== null) {
    keys.set(match[1], match[2]);
}

// Merge missing keys (overwrite existing to ensure consistency)
for (const [key, value] of Object.entries(missingKeys)) {
    keys.set(key, value);
}

// Build the fresh PHP file
let output = '<?php\n/**\n * Admin strings\n *\n * @package WP_Dark_Mode\n */\n\nnamespace WP_Dark_Mode\\Admin;\n\nclass Strings {\n\tpublic static function get() {\n\t\treturn apply_filters(\n\t\t\t\'wp_dark_mode_admin_strings\',\n\t\t\tarray(\n';

const sortedKeys = Array.from(keys.keys()).sort();
for (const key of sortedKeys) {
    const value = keys.get(key);
    // Escape single quotes in values for PHP output
    const escapedValue = value.replace(/\'/g, "\\'");
    output += `\t\t\t\t\t'${key}'`.padEnd(46) + `=> __( '${escapedValue}', 'wp-dark-mode' ),\n`;
}

output += '\t\t\t)\n\t\t);\n\t}\n}\n';

fs.writeFileSync(filePath, output);
console.log('✅ class-strings.php synchronized successfully including all requested keys.');

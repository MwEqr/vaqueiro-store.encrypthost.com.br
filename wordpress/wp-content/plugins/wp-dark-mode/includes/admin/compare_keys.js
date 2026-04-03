const fs = require('fs');

// Keys from Vue files (subset from my previous terminal command + manual ones)
const vueKeys = [
    'adjust_typography',
    'adjust_typography_hints',
    'explore_accessibility_switches',
    'typography_alert_msg',
    'shortcode',
    'exclude_settings',
    'accessibility',
    'performance',
    'analytics',
    'switch_to_dark_mode',
    'switch_to_light_mode',
    'typography_disable_title',
    'typography_disable_desc',
    'floating_switch_size_desc',
    'exclude_pages_posts_only_on_selected_hints',
    'exclude_taxonomy_type',
    'exclude_taxonomies_hints',
    'dark_mode_analytics',
    'performance_behavior_title',
    'other_performance_settings',
    'other_accessibility_settings',
    'scrollbar_customization_hints',
    'ai_preset_saved',
    'choose_palettes',
    'analyze_my_website',
    'add_widget_to_menu',
    'select_switch_style_menu',
    'update_done_title',
    'widget_instruction_1',
    'switch_widget_instruction_2',
    'update_done_instruction'
];

// Read class-strings.php content
const content = fs.readFileSync('C:\\Users\\Shimul\\Local Sites\\wpdarkmode\\app\\public\\wp-content\\plugins\\wp-dark-mode\\includes\\admin\\class-strings.php', 'utf8');

const regex = /'([^']+)'\s*=>/g;
let match;
const phpKeys = new Set();
while ((match = regex.exec(content)) !== null) {
    phpKeys.add(match[1]);
}

console.log('Missing Keys:');
vueKeys.forEach(key => {
    if (!phpKeys.has(key)) {
        console.log(key);
    }
});

<?php
/**
 * Plugin Name: Rivulet Duo CMS Model
 * Description: Registers WordPress content models and REST endpoint for Next.js.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    register_post_type('services', [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service',
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-screenoptions',
        'supports' => ['title', 'excerpt', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'services'],
    ]);

    register_post_type('work', [
        'labels' => [
            'name' => 'Work',
            'singular_name' => 'Work Item',
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => ['title', 'excerpt', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'work'],
    ]);

    register_post_type('rivulet_home', [
        'labels' => [
            'name' => 'Home Content',
            'singular_name' => 'Home Content',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-home',
        'supports' => ['title', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => false,
    ]);

    register_post_type('contact_submission', [
        'labels' => [
            'name' => 'Contact Submissions',
            'singular_name' => 'Contact Submission',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => false,
        'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title', 'editor', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => false,
    ]);

    register_post_type('rivulet_about', [
        'labels' => [
            'name' => 'About Content',
            'singular_name' => 'About Content',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-id',
        'supports' => ['title', 'custom-fields'],
        'has_archive' => false,
        'rewrite' => false,
    ]);
});

add_action('rest_api_init', function () {
    register_rest_route('rivulet/v1', '/home', [
        'methods' => 'GET',
        'callback' => function () {
            $post = get_posts([
                'post_type' => 'rivulet_home',
                'post_status' => 'publish',
                'posts_per_page' => 1,
            ]);

            if (empty($post)) {
                return rest_ensure_response([
                    'banner' => [],
                    'process' => [],
                    'testimonials' => [],
                ]);
            }

            $home_id = $post[0]->ID;

            $banner = [
                'badge' => (string) get_field('banner_badge', $home_id),
                'headlineLine1' => (string) get_field('banner_headline_line_1', $home_id),
                'headlineEmphasis' => (string) get_field('banner_headline_emphasis', $home_id),
                'headlineLine3' => (string) get_field('banner_headline_line_3', $home_id),
                'subcopy' => (string) get_field('banner_subcopy', $home_id),
                'tickerItems' => array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n|,/', (string) get_field('banner_ticker_items', $home_id))))),
            ];

            $process = [];
            for ($i = 1; $i <= 4; $i++) {
                $process[] = [
                    'n' => str_pad((string) $i, 2, '0', STR_PAD_LEFT),
                    'title' => (string) get_field("process_{$i}_title", $home_id),
                    'desc' => (string) get_field("process_{$i}_desc", $home_id),
                    'tags' => array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n|,/', (string) get_field("process_{$i}_tags", $home_id))))),
                ];
            }

            $testimonials = [];
            for ($i = 1; $i <= 6; $i++) {
                $text = (string) get_field("testimonial_{$i}_text", $home_id);
                if ($text === '') {
                    continue;
                }
                $testimonials[] = [
                    'initials' => (string) get_field("testimonial_{$i}_initials", $home_id),
                    'text' => $text,
                    'name' => (string) get_field("testimonial_{$i}_name", $home_id),
                    'role' => (string) get_field("testimonial_{$i}_role", $home_id),
                ];
            }

            return rest_ensure_response([
                'banner' => $banner,
                'process' => $process,
                'testimonials' => $testimonials,
            ]);
        },
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('rivulet/v1', '/contact', [
        'methods' => 'POST',
        'callback' => function (WP_REST_Request $request) {
            $secret = defined('RIVULET_CONTACT_SECRET') ? RIVULET_CONTACT_SECRET : getenv('RIVULET_CONTACT_SECRET');
            if (is_string($secret) && trim($secret) !== '') {
                $incoming_secret = (string) $request->get_header('x-rivulet-contact-secret');
                if ($incoming_secret === '' || !hash_equals(trim($secret), $incoming_secret)) {
                    return new WP_Error('forbidden', 'Invalid contact submission secret.', ['status' => 403]);
                }
            }

            $payload = $request->get_json_params();
            if (!is_array($payload)) {
                return new WP_Error('invalid_payload', 'Invalid payload.', ['status' => 400]);
            }

            $enquiry_type = sanitize_key((string) ($payload['enquiryType'] ?? ''));
            if (!in_array($enquiry_type, ['project', 'general'], true)) {
                return new WP_Error('invalid_enquiry', 'Invalid enquiry type.', ['status' => 400]);
            }

            $first_name = sanitize_text_field((string) ($payload['firstName'] ?? ''));
            $last_name = sanitize_text_field((string) ($payload['lastName'] ?? ''));
            $name = sanitize_text_field((string) ($payload['name'] ?? ''));
            $email = sanitize_email((string) ($payload['email'] ?? ''));
            $phone = sanitize_text_field((string) ($payload['phone'] ?? ''));
            $budget = sanitize_text_field((string) ($payload['budget'] ?? ''));
            $project_description = sanitize_textarea_field((string) ($payload['projectDescription'] ?? ''));
            $message = sanitize_textarea_field((string) ($payload['message'] ?? ''));

            $services_raw = $payload['services'] ?? [];
            $services = [];
            if (is_array($services_raw)) {
                foreach ($services_raw as $service) {
                    if (!is_string($service)) {
                        continue;
                    }
                    $service = sanitize_text_field($service);
                    if ($service !== '') {
                        $services[] = $service;
                    }
                }
            }

            if (!is_email($email)) {
                return new WP_Error('invalid_email', 'Please enter a valid email.', ['status' => 400]);
            }

            if ($enquiry_type === 'project') {
                if ($first_name === '' || $last_name === '' || $project_description === '') {
                    return new WP_Error('missing_fields', 'Missing required project fields.', ['status' => 400]);
                }
            } else {
                if ($name === '' || $message === '') {
                    return new WP_Error('missing_fields', 'Missing required general enquiry fields.', ['status' => 400]);
                }
            }

            $display_name = $enquiry_type === 'project' ? trim($first_name . ' ' . $last_name) : $name;
            $title_prefix = $enquiry_type === 'project' ? 'Project Brief' : 'General Enquiry';
            $submission_title = sprintf('%s - %s - %s', $title_prefix, $display_name ?: 'Unknown', wp_date('Y-m-d H:i'));

            $content_lines = [
                'Type: ' . $enquiry_type,
                'Name: ' . ($display_name ?: 'N/A'),
                'Email: ' . $email,
                'Phone: ' . ($phone ?: 'N/A'),
            ];

            if ($enquiry_type === 'project') {
                $content_lines[] = 'Services: ' . (!empty($services) ? implode(', ', $services) : 'N/A');
                $content_lines[] = 'Budget: ' . ($budget ?: 'N/A');
                $content_lines[] = 'Project Description:';
                $content_lines[] = $project_description;
            } else {
                $content_lines[] = 'Message:';
                $content_lines[] = $message;
            }

            $post_id = wp_insert_post([
                'post_type' => 'contact_submission',
                'post_status' => 'private',
                'post_title' => $submission_title,
                'post_content' => implode("\n", $content_lines),
            ], true);

            if (is_wp_error($post_id)) {
                return new WP_Error('save_failed', 'Unable to save contact submission.', ['status' => 500]);
            }

            update_post_meta($post_id, 'enquiry_type', $enquiry_type);
            update_post_meta($post_id, 'full_name', $display_name);
            update_post_meta($post_id, 'email', $email);
            update_post_meta($post_id, 'phone', $phone);
            update_post_meta($post_id, 'services', $services);
            update_post_meta($post_id, 'budget', $budget);
            update_post_meta($post_id, 'project_description', $project_description);
            update_post_meta($post_id, 'message', $message);
            $remote_ip = '';
            if (isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])) {
                $remote_ip = $_SERVER['REMOTE_ADDR'];
            }
            $forwarded_for = (string) $request->get_header('x-forwarded-for');
            update_post_meta($post_id, 'ip_address', sanitize_text_field($forwarded_for !== '' ? $forwarded_for : $remote_ip));
            update_post_meta($post_id, 'user_agent', sanitize_text_field((string) ($request->get_header('user-agent') ?: '')));

            $notify_to = (string) apply_filters('rivulet_contact_notify_email', get_option('admin_email'), $payload);
            $notify_subject = sprintf('[Rivulet] %s from %s', ucfirst($enquiry_type), $display_name ?: $email);
            $notify_sent = wp_mail($notify_to, $notify_subject, implode("\n", $content_lines));

            $ack_subject = 'We received your message - Rivuletduo';
            $ack_lines = [
                'Hi ' . ($display_name ?: 'there') . ',',
                '',
                'Thanks for reaching out. We have received your enquiry and will get back to you within 24 hours.',
                '',
                'Regards,',
                'Rivuletduo',
            ];
            $ack_sent = wp_mail($email, $ack_subject, implode("\n", $ack_lines));

            return rest_ensure_response([
                'success' => true,
                'submissionId' => (int) $post_id,
                'mailSent' => (bool) $notify_sent,
                'clientMailSent' => (bool) $ack_sent,
            ]);
        },
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('rivulet/v1', '/about', [
        'methods' => 'GET',
        'callback' => function () {
            $post = get_posts([
                'post_type' => 'rivulet_about',
                'post_status' => 'publish',
                'posts_per_page' => 1,
            ]);

            if (empty($post)) {
                return rest_ensure_response([
                    'hero' => [],
                    'tickerItems' => [],
                    'story' => [],
                    'values' => [],
                    'team' => [],
                    'timeline' => [],
                    'philosophy' => [],
                    'stack' => [],
                ]);
            }

            $id = $post[0]->ID;

            $hero = [
                'headline' => (string) get_field('about_hero_headline', $id),
                'subheadline' => (string) get_field('about_hero_subheadline', $id),
            ];
            $stats = [];
            for ($i = 1; $i <= 3; $i++) {
                $num = (string) get_field("about_hero_stat_{$i}_num", $id);
                if ($num !== '') {
                    $stats[] = ['n' => $num, 'l' => (string) get_field("about_hero_stat_{$i}_label", $id)];
                }
            }
            $hero['stats'] = $stats;

            $tickerItems = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n|,/', (string) get_field('about_ticker_items', $id)))));

            $story = [
                'paragraphs' => array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) get_field('about_story_paragraphs', $id))))),
                'badgeYear' => (string) get_field('about_story_badge_year', $id),
                'badgeLabel' => (string) get_field('about_story_badge_label', $id),
            ];

            $values = [];
            for ($i = 1; $i <= 6; $i++) {
                $title = (string) get_field("about_value_{$i}_title", $id);
                if ($title !== '') {
                    $values[] = [
                        'title' => $title,
                        'desc' => (string) get_field("about_value_{$i}_desc", $id),
                    ];
                }
            }

            $team = [];
            for ($i = 1; $i <= 2; $i++) {
                $name = (string) get_field("about_team_{$i}_name", $id);
                if ($name !== '') {
                    $team[] = [
                        'role' => (string) get_field("about_team_{$i}_role", $id),
                        'name' => $name,
                        'bio' => (string) get_field("about_team_{$i}_bio", $id),
                        'skills' => array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n|,/', (string) get_field("about_team_{$i}_skills", $id))))),
                    ];
                }
            }

            $timeline = [];
            for ($i = 1; $i <= 6; $i++) {
                $year = (string) get_field("about_timeline_{$i}_year", $id);
                if ($year !== '') {
                    $timeline[] = [
                        'year' => $year,
                        'title' => (string) get_field("about_timeline_{$i}_title", $id),
                        'desc' => (string) get_field("about_timeline_{$i}_desc", $id),
                    ];
                }
            }

            $philosophy = [
                'quote' => (string) get_field('about_philosophy_quote', $id),
                'attr' => (string) get_field('about_philosophy_attr', $id),
            ];

            $stack = [];
            for ($i = 1; $i <= 4; $i++) {
                $cat = (string) get_field("about_stack_{$i}_cat", $id);
                if ($cat !== '') {
                    $stack[] = [
                        'cat' => $cat,
                        'items' => array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n|,/', (string) get_field("about_stack_{$i}_items", $id))))),
                    ];
                }
            }

            return rest_ensure_response([
                'hero' => $hero,
                'tickerItems' => $tickerItems,
                'story' => $story,
                'values' => $values,
                'team' => $team,
                'timeline' => $timeline,
                'philosophy' => $philosophy,
                'stack' => $stack,
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
});

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_rivulet_services',
        'title' => 'Rivulet Service Fields',
        'fields' => [
            ['key' => 'field_service_num', 'label' => 'Service Number', 'name' => 'num', 'type' => 'text'],
            ['key' => 'field_service_badge', 'label' => 'Badge', 'name' => 'badge', 'type' => 'text'],
            ['key' => 'field_service_title_prefix', 'label' => 'Title Prefix', 'name' => 'title_prefix', 'type' => 'text'],
            ['key' => 'field_service_title_em', 'label' => 'Title Emphasis', 'name' => 'title_em', 'type' => 'text'],
            ['key' => 'field_service_tagline', 'label' => 'Tagline', 'name' => 'tagline', 'type' => 'textarea'],
            ['key' => 'field_service_short_desc', 'label' => 'Short Description', 'name' => 'short_description', 'type' => 'textarea'],
            ['key' => 'field_service_tags', 'label' => 'Tags (comma or newline separated)', 'name' => 'tags', 'type' => 'textarea'],
            ['key' => 'field_service_category', 'label' => 'Category Label', 'name' => 'category', 'type' => 'text'],
            ['key' => 'field_service_category_id', 'label' => 'Category ID', 'name' => 'category_id', 'type' => 'text'],
            ['key' => 'field_service_category_num', 'label' => 'Category Number', 'name' => 'category_num', 'type' => 'text'],
            ['key' => 'field_service_category_title', 'label' => 'Category Title', 'name' => 'category_title', 'type' => 'text'],
            ['key' => 'field_service_category_desc', 'label' => 'Category Description', 'name' => 'category_desc', 'type' => 'textarea'],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'services']]],
    ]);

    acf_add_local_field_group([
        'key' => 'group_rivulet_work',
        'title' => 'Rivulet Work Fields',
        'fields' => [
            ['key' => 'field_work_num', 'label' => 'Work Number', 'name' => 'num', 'type' => 'text'],
            ['key' => 'field_work_year', 'label' => 'Year', 'name' => 'year', 'type' => 'text'],
            ['key' => 'field_work_tag', 'label' => 'Tagline', 'name' => 'tag', 'type' => 'text'],
            ['key' => 'field_work_category', 'label' => 'Category', 'name' => 'category', 'type' => 'text'],
            ['key' => 'field_work_featured', 'label' => 'Featured', 'name' => 'featured', 'type' => 'true_false'],
            ['key' => 'field_work_short_desc', 'label' => 'Short Description', 'name' => 'short_description', 'type' => 'textarea'],
            ['key' => 'field_work_services', 'label' => 'Services (comma or newline separated)', 'name' => 'services', 'type' => 'textarea'],
            ['key' => 'field_work_title_html', 'label' => 'Title HTML (optional)', 'name' => 'title_html', 'type' => 'text'],
            ['key' => 'field_work_tagline_long', 'label' => 'Detailed Tagline', 'name' => 'tagline', 'type' => 'textarea'],
            ['key' => 'field_work_client', 'label' => 'Client', 'name' => 'client', 'type' => 'text'],
            ['key' => 'field_work_duration', 'label' => 'Duration', 'name' => 'duration', 'type' => 'text'],
            ['key' => 'field_work_role', 'label' => 'Role', 'name' => 'role', 'type' => 'text'],
            ['key' => 'field_work_industry', 'label' => 'Industry', 'name' => 'industry', 'type' => 'text'],
            ['key' => 'field_work_tags', 'label' => 'Tech Tags (comma or newline separated)', 'name' => 'tags', 'type' => 'textarea'],
            ['key' => 'field_work_metrics', 'label' => 'Metrics (4 values)', 'name' => 'metrics', 'type' => 'textarea'],
            ['key' => 'field_work_metric_labels', 'label' => 'Metric Labels (4 values)', 'name' => 'metric_labels', 'type' => 'textarea'],
            ['key' => 'field_work_metric_changes', 'label' => 'Metric Changes (4 values)', 'name' => 'metric_changes', 'type' => 'textarea'],
            ['key' => 'field_work_test_quote', 'label' => 'Testimonial Quote', 'name' => 'testimonial_quote', 'type' => 'textarea'],
            ['key' => 'field_work_test_avatar', 'label' => 'Testimonial Initials', 'name' => 'testimonial_avatar', 'type' => 'text'],
            ['key' => 'field_work_test_name', 'label' => 'Testimonial Name', 'name' => 'testimonial_name', 'type' => 'text'],
            ['key' => 'field_work_test_role', 'label' => 'Testimonial Role', 'name' => 'testimonial_role', 'type' => 'text'],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'work']]],
    ]);

    $home_fields = [
        ['key' => 'field_home_banner_badge', 'label' => 'Banner Badge', 'name' => 'banner_badge', 'type' => 'text'],
        ['key' => 'field_home_banner_h1_1', 'label' => 'Banner Headline Line 1', 'name' => 'banner_headline_line_1', 'type' => 'text'],
        ['key' => 'field_home_banner_h1_em', 'label' => 'Banner Headline Emphasis', 'name' => 'banner_headline_emphasis', 'type' => 'text'],
        ['key' => 'field_home_banner_h1_3', 'label' => 'Banner Headline Line 3', 'name' => 'banner_headline_line_3', 'type' => 'text'],
        ['key' => 'field_home_banner_subcopy', 'label' => 'Banner Subcopy', 'name' => 'banner_subcopy', 'type' => 'textarea'],
        ['key' => 'field_home_banner_ticker', 'label' => 'Banner Ticker Items (comma or newline separated)', 'name' => 'banner_ticker_items', 'type' => 'textarea'],
    ];

    for ($i = 1; $i <= 4; $i++) {
        $home_fields[] = ['key' => "field_home_process_{$i}_title", 'label' => "Process {$i} Title", 'name' => "process_{$i}_title", 'type' => 'text'];
        $home_fields[] = ['key' => "field_home_process_{$i}_desc", 'label' => "Process {$i} Description", 'name' => "process_{$i}_desc", 'type' => 'textarea'];
        $home_fields[] = ['key' => "field_home_process_{$i}_tags", 'label' => "Process {$i} Tags (comma or newline separated)", 'name' => "process_{$i}_tags", 'type' => 'textarea'];
    }

    for ($i = 1; $i <= 6; $i++) {
        $home_fields[] = ['key' => "field_home_test_{$i}_initials", 'label' => "Testimonial {$i} Initials", 'name' => "testimonial_{$i}_initials", 'type' => 'text'];
        $home_fields[] = ['key' => "field_home_test_{$i}_text", 'label' => "Testimonial {$i} Text", 'name' => "testimonial_{$i}_text", 'type' => 'textarea'];
        $home_fields[] = ['key' => "field_home_test_{$i}_name", 'label' => "Testimonial {$i} Name", 'name' => "testimonial_{$i}_name", 'type' => 'text'];
        $home_fields[] = ['key' => "field_home_test_{$i}_role", 'label' => "Testimonial {$i} Role", 'name' => "testimonial_{$i}_role", 'type' => 'text'];
    }

    acf_add_local_field_group([
        'key' => 'group_rivulet_home_content',
        'title' => 'Rivulet Home Content Fields',
        'fields' => $home_fields,
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'rivulet_home']]],
    ]);

    $about_fields = [
        ['key' => 'field_about_hero_headline', 'label' => 'Hero Headline', 'name' => 'about_hero_headline', 'type' => 'text'],
        ['key' => 'field_about_hero_subheadline', 'label' => 'Hero Subheadline', 'name' => 'about_hero_subheadline', 'type' => 'textarea'],
    ];

    for ($i = 1; $i <= 3; $i++) {
        $about_fields[] = ['key' => "field_about_hero_stat_{$i}_num", 'label' => "Hero Stat {$i} Number", 'name' => "about_hero_stat_{$i}_num", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_hero_stat_{$i}_label", 'label' => "Hero Stat {$i} Label", 'name' => "about_hero_stat_{$i}_label", 'type' => 'text'];
    }

    $about_fields[] = ['key' => 'field_about_ticker_items', 'label' => 'Ticker Items (comma separated)', 'name' => 'about_ticker_items', 'type' => 'textarea'];
    $about_fields[] = ['key' => 'field_about_story_paragraphs', 'label' => 'Story Paragraphs (separate by newline)', 'name' => 'about_story_paragraphs', 'type' => 'textarea'];
    $about_fields[] = ['key' => 'field_about_story_badge_year', 'label' => 'Story Badge Year', 'name' => 'about_story_badge_year', 'type' => 'text'];
    $about_fields[] = ['key' => 'field_about_story_badge_label', 'label' => 'Story Badge Label', 'name' => 'about_story_badge_label', 'type' => 'text'];

    for ($i = 1; $i <= 6; $i++) {
        $about_fields[] = ['key' => "field_about_value_{$i}_title", 'label' => "Value {$i} Title", 'name' => "about_value_{$i}_title", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_value_{$i}_desc", 'label' => "Value {$i} Description", 'name' => "about_value_{$i}_desc", 'type' => 'textarea'];
    }

    for ($i = 1; $i <= 2; $i++) {
        $about_fields[] = ['key' => "field_about_team_{$i}_role", 'label' => "Team Member {$i} Role", 'name' => "about_team_{$i}_role", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_team_{$i}_name", 'label' => "Team Member {$i} Name", 'name' => "about_team_{$i}_name", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_team_{$i}_bio", 'label' => "Team Member {$i} Bio", 'name' => "about_team_{$i}_bio", 'type' => 'textarea'];
        $about_fields[] = ['key' => "field_about_team_{$i}_skills", 'label' => "Team Member {$i} Skills (comma separated)", 'name' => "about_team_{$i}_skills", 'type' => 'textarea'];
    }

    for ($i = 1; $i <= 6; $i++) {
        $about_fields[] = ['key' => "field_about_timeline_{$i}_year", 'label' => "Timeline {$i} Year", 'name' => "about_timeline_{$i}_year", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_timeline_{$i}_title", 'label' => "Timeline {$i} Title", 'name' => "about_timeline_{$i}_title", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_timeline_{$i}_desc", 'label' => "Timeline {$i} Description", 'name' => "about_timeline_{$i}_desc", 'type' => 'textarea'];
    }

    $about_fields[] = ['key' => 'field_about_philosophy_quote', 'label' => 'Philosophy Quote', 'name' => 'about_philosophy_quote', 'type' => 'textarea'];
    $about_fields[] = ['key' => 'field_about_philosophy_attr', 'label' => 'Philosophy Attribution', 'name' => 'about_philosophy_attr', 'type' => 'text'];

    for ($i = 1; $i <= 4; $i++) {
        $about_fields[] = ['key' => "field_about_stack_{$i}_cat", 'label' => "Stack Category {$i}", 'name' => "about_stack_{$i}_cat", 'type' => 'text'];
        $about_fields[] = ['key' => "field_about_stack_{$i}_items", 'label' => "Stack Items {$i} (comma separated)", 'name' => "about_stack_{$i}_items", 'type' => 'textarea'];
    }

    acf_add_local_field_group([
        'key' => 'group_rivulet_about_content',
        'title' => 'Rivulet About Content Fields',
        'fields' => $about_fields,
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'rivulet_about']]],
    ]);
});
